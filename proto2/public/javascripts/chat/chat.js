/*global $, localStorage, chat, io */
var chat = {};

chat.userInfo = {
	id : localStorage.id,
	isChief : false
};

chat.init = function () {
	
	chat.socket.init();

	//채팅 관련함수
	$('#enterRoom').live('click', function () {
		var roomNumber = $(this).parent().siblings('#roomNumber').text(),
		    check = $(this).parent().siblings('#checkRoom').text(),
		    password;
		if (check === '공개') {
			chat.socket.send('join', {
				roomNumber : roomNumber
			});
		} else {
			password = prompt('비밀번호를 입력하세요.');
			chat.socket.send('checkPassword', {
				password : password, 
				roomNumber : roomNumber
			});
		}
	});
	
	// function clearContent() {
		// $('#content').text('');
	// }
	
	$('#sendMessage').click(function () {
		var message = $('#message').val(),
		    to = $('#showRoomMember option:selected').val();
		$('#message').val('');
		chat.socket.send('message', {
			message : message, 
			to : to
		});
	});
	
	$('#message').keydown(function (data) {
		var message = $('#message').val(),
			to = $('#showRoomMember option:selected').val();
		if (data.keyCode === 13) {
			chat.socket.send('message', {
				message : message, 
				to : to
			});
			$('#message').val('');
		}
	});
	
	$('#outRoom').click(function () {
		
		chat.socket.send('leave');
	});
	
	$('#makeRoom').click(function () {
		chat.userInfo.isChief = false;
		$('#roomForm').removeAttr('style');
		$('#title').val('');
		$('[data-roomUpdate]').attr('data-roomUpdate', 'make').attr('value' , 'make');
	});
	
	$('#cancle').click(function () {
		$('#roomForm').css('display', 'none');
	});
	
	$('[data-roomUpdate]').click(function () {
		var flag = $(this).attr('data-roomUpdate'),
			makeRoomInformation = {
				title : $('#title').val(),
				maximumNumber : $('#maximumNumber option:selected').val(),
				isOpenRoom : $(':radio[name="isOpenRoom"]:checked').val(),
				password : $('#password').val(),
				chiefId : localStorage.id
			};
		if(flag === 'make') {
			chat.socket.send('makeRoom', makeRoomInformation);	
		} else {
			chat.socket.send('changeRoomInfo', makeRoomInformation);
		}
		
	});
	
	$('.isOpenRoom').click(function () {
		var isOpenRome = $(':radio[name="isOpenRoom"]:checked').val();
		if (isOpenRome === '비공개') {
			$('#password').removeAttr("disabled");
		} else {
			$('#password').val('');
			$('#password').attr("disabled", 'disabled');
		}
	});
	$('#currentRoomTitle').delegate('#changeRoomInfo', 'click', function (){
		chat.socket.send('getRoomInfo');
	});
	
	$('#member').delegate('[data-event=out]', 'click', function () {
		var userId = $(this).text();
		console.log(userId);
		console.log(chat.userInfo.id);
		console.log(chat.userInfo.isChief);
		if(chat.userInfo.isChief && chat.userInfo.id != userId && confirm(userId + "를 강퇴하시겠습니까?")) {
			chat.socket.send('out', {
				target : userId 
			});
			
		}
	});
};

chat.socket = (function () {
	var socket;
	socket = io.connect();
	function send(key, data) {
		socket.emit(key, data);
	}
	
	function init() {
		send('saveUserInformation', localStorage.id);
		send('showAllRoomInformation');
		
		socket.on('getRoomInfo', function (result){
			$('#title').val(result.title);
			$('[data-roomUpdate]').attr('data-roomUpdate', 'change').attr('value' , 'change');
			$('#roomForm').removeAttr('style');
			
		}); 
		
		socket.on('showRoomInformation', function (result) {
			$('#' + result.roomNumber).remove();
			if (result.currentNumber !== 0) {
				var output = '';
				output += '<tr id =' + result.roomNumber + '>';
				output += ' <td id ="roomNumber">' + result.roomNumber + '</td>';
				output += ' <td>' + result.title + '</td>';
				output += ' <td>' + result.chiefId + '</td>';
				output += ' <td>' + result.currentNumber + ' / ' + result.maximumNumber + '</td>';
				output += ' <td id="checkRoom">' + result.isOpenRoom + '</td>';
				output += ' <td><input type = "button" id="enterRoom" value = "입장"></td>';
				output += '</tr>';
				$('#roomInformation').append(output);
			}
		});
		
		socket.on('changeRoomInfo', function (result) {
			if(result.success) {
				$('#currentRoomTitle').text(result.title);
				if (result.isChief) {
					alert('수정완료하였습니다.');
					$('#currentRoomTitle').append('<input type="button" id="changeRoomInfo" value="방정보 수정" />');
					$('#roomForm').css('display', 'none');	
				}
			} else {
				alert('현재인원보다 최대인원이 작습니다. (강퇴바랍니다.)');
			}
		});

		socket.on('successJoinRoom', function (result) {
			$('#outRoom').removeAttr('disabled');
			$('#currentRoomTitle').text(result.title);
			
			if (result.isChief) {
				$('#currentRoomTitle').append('<input type="button" id="changeRoomInfo" value="방정보 수정" />');	
			}
		});
		
		socket.on('giveChief', function (result) {
			$('#currentRoomTitle').append('<input type="button" id="changeRoomInfo" value="방정보 수정" />');
		});
	
		socket.on('secretRoomJoin', function (result) {
			if (result.isCorrect) {
				send('join',  {
					roomNumber : result.roomNumber
				});
			} else {
				alert('비밀번호가 일치하지 않습니다. 다시입력해주시기 바랍니다.');
			}
		});
	
		socket.on('showRoomMember', function (result) {
			var member = '',
				i;
			member += '<option value="전체보내기">전체보내기</option>';
			for (i = 0 ; i < result.members.length; i += 1) {
				member += '<option value=' + result.members[i] + '>' + result.members[i] + '</option>';
			}
			$('#showRoomMember').children().remove();
			$('#showRoomMember').append(member);
		});
	
		socket.on('memberFull', function (result) {
			alert('인원수가 꽉 찼습니다.');
		});
	
		socket.on('message', function (result) {
			$('<p>' + result.userId + ': ' + result.message + '</p>').appendTo('#messageBox');
			var scroll = document.getElementById("messageBox");
			scroll.scrollTop = scroll.scrollHeight;
		});
		
		socket.on('out', function (result) {
			send('leave');
			alert('방장에의해 강퇴되었습니다.');
		});
	
		socket.on('report', function (result) {
			$('<p>' + result.userId + result.message + '</p>').appendTo('#messageBox');
			var scroll = document.getElementById("messageBox");
			scroll.scrollTop = scroll.scrollHeight;
		});
		
		socket.on('makeRoom', function (result) {
			chat.userInfo.isChief = true;
			$('#roomForm').css('display', 'none');
			send('join', result);
		});
		
		socket.on('leave', function (result) {
			$('#outRoom').attr('disabled', 'disabled');
			$('#member').html('');
			$('#messageBox').html('');
			$('#currentRoomTitle').text('');
		});
		
		socket.on('showMember', function (result) {
			var member = '';
			if (result.flag === 'remove') {
				$('#' + result.userId).remove();
			} else if (result.flag === 'append') {
				member += '<p id='+ result.userId +' data-event="out">' + result.userId + '</p>';
				$('#member').append(member);
			}
		});
	}
	
	return {
		init : init,
		send : send
	};
}()); 

