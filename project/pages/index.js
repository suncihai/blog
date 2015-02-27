define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout').base;
	var C = require('@core/config');

	var Index = {
		init: function( data ) {
			this.data = data;
			this.build();
		},

		build: function() {
			$(document).attr( 'title', C.archiveTitle[this.data.name] );
		}
	}
	exports.base = Index;
});