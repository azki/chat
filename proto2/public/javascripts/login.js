/*global $, localStorage */

//localStorage.id = userId;
//localStorage.clear();

$(document).ready(function () {
	$('#enter').click(function () {
		var userId;
		userId = prompt('생성할 아이디를 입력');
		if (userId) {
			$.get('/checkId', {
				id : userId
			}, function (success) {
				if (success) {
					localStorage.id = userId;
					location.href = '/chat';
				} else {
					alert('중복된 아이디가 있습니다 다시만들어 주시기 바랍니다.');
				}
			});
		}
	});
});

