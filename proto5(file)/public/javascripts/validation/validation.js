/*global $ */

var validation = (function () {
	var init = function () {
		function loginHandler(form) {
			var userInfo = $(form).serialize();
			$.post('/login', userInfo, function (result) {
				if (result.success) {
					location.href = '/';
				} else {
					alert(result.massage);
				}
			});
		}
		function joinHandler(form) {
			var userInfo = $(form).serialize();
			
			$.post('/join', userInfo, function (result) {
				if (result.success) {
					location.href = '/';
				} else {
					alert(result.message);
				}
			});
		}

		function findPasswordHandler(form) {
			var userInfo = $(form).serialize();
			
			$.post('/findPassword', userInfo, function (result) {
				alert(result);
			});
		}
		
		$('#check_login').validate({
			rules : {
				email : {
					required : true
				},
				password : {
					required : true
				}
			},
			messages : {
				email : {
					required : '이메일을 입력해주시기 바랍니다.'
				},
				password : {
					required : '비밀번호를 입력해 주수기 바랍니다.'
				}
			},
			submitHandler : loginHandler
		});

		$('#check_join').validate({
			rules : {
				password : {
					required : true
				},
				passwordCheck : {
					required : true,
					equalTo : '#check_join_password'
				},
				email : {
					required : true,
					email : true,
					remote : '/checkDuplicateEmail'
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
				},
				email : {
					required : 'email을 입력해주시기바랍니다.',
					email : '옳바른 이메일형식이 아닙니다.',
					remote : '중복된 email입니다.'
				}
			},
			submitHandler : joinHandler
		});
		
		$('#check_findPassword').validate({
			rules : {
				email : {
					required : true,
					email : true
				}
			},
			messages : {
				email : {
					required : 'email을 입력해주시기바랍니다.',
					email : '옳바른 이메일형식이 아닙니다.'
				}
			},
			submitHandler : findPasswordHandler
		});
	};

	return {
		init : init
	};
}());

