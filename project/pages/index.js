define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout').base;
	var C = require('@core/config');

	exports.onMain = function( data ) {
		$(document).attr( 'title', C.archiveTitle[data.name] );
	}
});