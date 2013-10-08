/*global $ */

var validation = (function () {
	var init = function () {
		function changePasswordHandler(form) {
			var userInfo = $(form).serialize();
			
			$.post('/savePassword', userInfo, function (result) {
				if (result.success) {
					alert(result.message);
					location.href = '/';
				} else {
					alert(result.message);
				}
			});
		}

		$('#check_changePassword').validate({
			rules : {
				password : {
					required : true
				},
				passwordCheck : {
					required : true,
					equalTo : '#check_changePassword_password'
				}
			},
			messages : {
				password : {
					required : '비밀번호를 입력해주시기 바랍니다.',
					minlength : '최소 4글자 이상 입력해 주시기 바랍니다.'
				},
				passwordCheck : {
					required : '비밀번호와 일치하지 않습니다.',
					equalTo : '비밀번호와 일치하지 않습니다'
				}
			},
			submitHandler : changePasswordHandler
		});
		
	};

	return {
		init : init
	};
}());

