/*global $ */

var main = (function () {
	var init = function () {
		$('#nav').delegate('li', 'click', function (event) {
			var targetContId = 'cont_' + event.currentTarget.id.replace('nav_', '');
			$('#content >  div:not(#' + targetContId + ')').hide();
			$('#' + targetContId).show();
		});
	};
	return {
		init : init
	};
}());
