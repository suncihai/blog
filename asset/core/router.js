define(function( require, exports ){
	var WIN = window,
		DOC = document,
		LOC = WIN.location,
		util = require('util');

	function hashChanged() {
		var hash = LOC.hash.replace(/^[#\/\!]+/, '');
	}

	// 开始执行路由
	exports.start = function() {
		hashChanged();
	}
});