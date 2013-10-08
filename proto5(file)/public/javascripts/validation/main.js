/*global $ */

var main = (function () {
	var init = function () {
		$('#nav').delegate('li', 'click', function (event) {
			var targetContId = 'cont_' + event.currentTarget.id.replace('nav_', '');
			$('#content >  div:not(#' + targetContId + ')').hide();
			$('#' + targetContId).show();
		});

		$('#getKey').click(function () {
			var userInfo = {
				domain : $('#domain').val(),
				email : $('#email').val()
			};
			$.post('/saveKey', userInfo, function (result) {
				if (result.success) {
					$('#keyContent').append('<tr><th>' + userInfo.domain + '</th><th>' + result.key + '</th><th></th> </tr>');
					alert(result.message);
				} else {
					alert(result.message);
				}

			});
		});

		$('#logout').click(function () {
			$.get('/logout', function (result) {
				if (result) {
					location.href = '/';
				}
			});

		});
	};
	return {
		init : init
	};
}()); 

var getKey = function (email) {
	var userInfo = {
		email : email
	};
	if (email !== 'undefined') {
		$.post('/getKey', userInfo, function (result) {
			for (var i in result) {
				if (result.hasOwnProperty(i)) {
					$('#keyContent').append('<tr><th>' + result[i].domain + '</th><th>' + result[i].key + '</th><th></th> </tr>');
				}
			}
			console.dir(result);
		});
	}
};
