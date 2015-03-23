define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout').base;

	var NotFound = {
		init: function( data ) {
			this.$dom = data.dom;
			layout.setTitle('糟了！页面不存在哦~');
			this.build();
		},

		// 创建404容器
		build: function() {
			var blank = this.$dom;
		}
	}
	exports.base = NotFound;
});