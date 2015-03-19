define(function( require, exports ){
	var $ = require('jquery');
	// var layout = require('layout');
	// var C = require('@core/config');

	exports.onMain = function( data ) {
		$(document).attr( 'title', '(╯^╰) 页面不存在哦~' );
		data.dom.html('<h1>页面不存在</h1>');
	}
});