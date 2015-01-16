/**
 * [页脚模块(全站)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout');
	var C = require('@core/config');
	var util = require('util');

	var footer = layout.doms.footer;

	var html = [
		'<div class="P-footer-info"/>',
		'<div class="P-footer-hide"/>',
	].join('');

	$(html).appendTo( footer );
	var doms = {
		'info': 	$('.P-footer-info', footer),
		'hide': 	$('.P-footer-hide', footer).hide()
	}
	exports.doms = doms;

	/**
	 * init 页脚初始化, 标注, 版权等文字信息
	 */
	exports.init = function() {
		this.buildFooterInfo( C.copyright );
		return true;
	}

	/**
	 * buildFooterInfo 构建页脚文字信息
	 * @param  {type} str [显示的文字]
	 * @return {type}     [footer]
	 */
	exports.buildFooterInfo = function( str ) {
		doms.info.html( str || C.copyright );
		return this;
	}
});