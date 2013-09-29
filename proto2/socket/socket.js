/*global $, require, exports, io */

// console.dir(io.sockets.clients('1'));
// console.log(io.sockets.clients('1'));
// console.log(io.sockets.manager.roomClients[connectUsers[socket.userInfo.id]]);
var connectUsers = {},
	roomInfo = [],
	seq = 0,
	currentMakeRoomNumber = 0;


exports.connectUsers = connectUsers;


exports.init = function (server) {
	io = require('socket.io').listen(server);
	
	//socket.io의 로그 레벨 하양
	io.set('log level', 2);

	//socket.io가 연결됫을때 함수들 정의
	io.sockets.on('connection', function (socket) {
		
		//특정 유저에게 전달 
		function privateCast(targetId, key, data) {
			io.sockets.sockets[targetId].emit(key, data);
		}
		
		//socket(자기자신)을 제외한 방에 접속한 사람에게 전달 
		function broadCast(room, key, data) {
			socket.broadcast['in'](room).emit(key, data);		
		}
		
		//방에 접속한 모든 user에게 전달 
		function roomCast(room, key, data) {
			io.sockets['in'](room).emit(key, data);
		}
		
		//모든 user에게 전달 
		function totalCast(key, data) {
			io.sockets.emit(key, data);
		}
		
		//socket(자기자신)에게 전달  
		function response(key, data) {
			socket.emit(key, data);		
		}
		//User정보 저장
		socket.on('saveUserInformation', function (id) {
			connectUsers[id] = socket.id;
			socket.userInfo = {
				id : id,
				enterRoom : ''
			};
		});

		//모든 방정보보기
		socket.on('showAllRoomInformation', function () {
			
			for (var room in roomInfo) {
				if (roomInfo.hasOwnProperty(room)) {
					response('showRoomInformation', roomInfo[room]);
				}
			}
		});

		//비밀방일때 방페스워드 check
		socket.on('checkPassword', function (data) {
			var isCorrect = (roomInfo[data.roomNumber].password) === data.password;
			response('secretRoomJoin', {
				isCorrect : isCorrect, 
				roomNumber : data.roomNumber
			});
		});
		
		//방만드기 
		socket.on('makeRoom', function (data) {
			var roomNumber,
				i;
			for (i = 1; i <= seq; i += 1) {
				if (!(roomInfo[i])) {
					seq -= 1;
					break;
				}
			}
			currentMakeRoomNumber = roomNumber = i;
			roomInfo[roomNumber] = {
				roomNumber : roomNumber,
				chiefId : data.chiefId,
				title : data.title,
				currentNumber : 0,
				maximumNumber : data.maximumNumber - 0,
				password : data.password,
				isOpenRoom : data.isOpenRoom
			};
			response('makeRoom', {
				roomNumber : currentMakeRoomNumber
			});
			seq += 1;
		});
		
		socket.on('changeRoomInfo', function (data) {
			var enterRoom = socket.userInfo.enterRoom;
			
			if (data.maximumNumber < roomInfo[enterRoom].currentNumber) {
				response('changeRoomInfo', {
					success : false
				});
				return;
			}
			
			roomInfo[enterRoom].title = data.title;
			roomInfo[enterRoom].maximumNumber = data.maximumNumber;
			roomInfo[enterRoom].password = data.password;
			roomInfo[enterRoom].isOpenRoom = data.isOpenRoom;
			response('changeRoomInfo', {
				success : true,
				title : data.title,
				isChief : true
			});
			broadCast(enterRoom, 'changeRoomInfo', {
				success : true,
				title : data.title
			});
			totalCast('showRoomInformation', roomInfo[enterRoom]); 
		});
		
		//방접속
		socket.on('join', function (data) {
			var id = socket.userInfo.id,
				memberArray = [],
				members,
				member,
				isChief = false;
			if ((roomInfo[data.roomNumber].currentNumber) === (roomInfo[data.roomNumber].maximumNumber)) {
				response('memberFull', {});
			} else {
				if (roomInfo[data.roomNumber].currentNumber === 0) {
					isChief = true;
				}
				socket.userInfo.enterRoom = data.roomNumber;
				socket.join(data.roomNumber);
				roomInfo[data.roomNumber].currentNumber += 1;
				members = io.sockets.clients(socket.userInfo.enterRoom);
				for (member in members) {
					if (members.hasOwnProperty(member)) {
						memberArray.push(members[member].userInfo.id);
					}
				}
				
				members = io.sockets.clients(socket.userInfo.enterRoom);
				for (member in members) {
					if (members.hasOwnProperty(member)) {
						response('showMember', {
							flag : 'append',
							userId : members[member].userInfo.id
						});
					}
				}
				//해당 유저에게 접속 성공을 알림 
				response('successJoinRoom', {
					roomNumber : data.roomNumber,
					isChief : isChief,
					title : roomInfo[data.roomNumber].title
				});
				
				//해당 방 맴버(접속자 제외)에게 접속 자 맴버 업데이트 
				broadCast(data.roomNumber, 'showMember', {
					flag : 'append',
					userId : id
				}); 
				
				//해당 방에 접속자 보내기 
				roomCast(data.roomNumber, 'report', {
					userId : id, 
					message : '님이 입장하셨습니다.'
				});
				
				//해당방에 채팅할맴버 업데이트(귓속말) 
				roomCast(data.roomNumber, 'showRoomMember', {
					members : memberArray
				});
				
				//방리스트 정보 업데이트 (전체보내기)
				totalCast('showRoomInformation', roomInfo[data.roomNumber]);
			}
		});
		
		//방나가기 함수
		function leaveRoom() {
			if (socket.userInfo === undefined || socket.userInfo.enterRoom === '') {
				return;
			}
			socket.userInfo.outting = true; 
			var roomInformation = roomInfo,
				check,
				userId = socket.userInfo.id,
				enterRoom = socket.userInfo.enterRoom,
				i,
				memberArray = [],
				members,
				member;

			roomInfo[enterRoom].currentNumber -= 1;
			check = roomInfo[enterRoom].currentNumber;
			socket.leave(enterRoom);
			
			members = io.sockets.clients(enterRoom);
			for (member in members) {
				if (members.hasOwnProperty(member)) {
					memberArray.push(members[member].userInfo.id);
				}
			}
			totalCast('showRoomInformation', roomInfo[enterRoom]);
			
			if (check === 0) {
				roomInfo[enterRoom] = null;
			} else {
				if (roomInfo[enterRoom].chiefId === userId) {
					roomInfo[enterRoom].chiefId = members[0].userInfo.id;
					privateCast(connectUsers[members[0].userInfo.id], 'giveChief');
				}
				//해당방에 채팅할맴버 업데이트(귓속말) 
				broadCast(enterRoom, 'showRoomMember', {
					members : memberArray
				});
				
				//해당 방 맴버(접속자 제외)에게 퇴장을 알림
				broadCast(enterRoom, 'report', {
					userId : userId,
					message : '님이 퇴장하셨습니다.'
				});  
				
				//해당 방 맴버(접속자 제외)에게 접속 자 맴버 업데이트
				broadCast(enterRoom, 'showMember', {
					flag : 'remove',
					userId : userId
				});  
			}
			response('leave', {});
			enterRoom = '';
		}
		//방 나가기
		socket.on('leave', function () {
			leaveRoom();
		});
		
		socket.on('out', function (data) {
			privateCast(connectUsers[data.target], 'out', {});
		});

		//메세지 전달
		socket.on('message', function (data) {
			var enterRoom = socket.userInfo.enterRoom,
				userId = socket.userInfo.id;
			if (data.to === '전체보내기') {
				roomCast(enterRoom, 'message', {
					userId : userId,
					message : data.message
				});
			} else {
				if (connectUsers[data.to] !== connectUsers[userId]) {
					privateCast(connectUsers[data.to], 'message', {
						userId : userId,
						message : data.message
					});
				}
				response('message', {
					userId : userId, 
					message : data.message
				});
			}
		});
		
		socket.on('getRoomInfo', function () {
			response('getRoomInfo', roomInfo[socket.userInfo.enterRoom]);
		});

		//연결 해제시.
		socket.on('disconnect', function () {
			delete connectUsers[socket.userInfo.id];
			leaveRoom();
		});

		//접속자 맴버 나타내기 
		socket.on('showAllMember', function (data) {
			var members = io.sockets.clients(socket.userInfo.enterRoom),
				member;
			for (member in members) {
				if (members.hasOwnProperty(member)) {
					response('showMember', {
						flag : 'append',
						userId : members[member].userInfo.id
					});
				}
			}
		});
	});
};
