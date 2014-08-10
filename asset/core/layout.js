define(function( require, exports ){
	// 变量&模块
	var $ = require('jquery');
	var C = require('@core/config');

	// 整体框架布局
	var layout = [
		'<div id="MAIN">',
			'<div class="G-frame">',
				'<div class="G-frameBody">',
					'<div class="G-frameBodyHead">',
					'</div>',
					'<div class="G-frameBodyContent">',
					'</div>',
					'<div class="G-frameBodyAside">',
					'</div>',
					'<div class="G-frameBodyFooter">',
					'</div>',
				'</div>',
			'</div>',
		'</div>',
		'<div id="LOADING"/>',
		'<div id="POPWIN"/>'
	].join('');

	var body = $('body').append( layout );
	var doms = {
		// 框架结构：
		'MAIN': 		$('#MAIN'),
		'LOADING':  	$('#LOADING'),
		'POPWIN': 		$('#POPWIN'),

		// 框架主体：
		'body': 		$('.G-frameBody', body),
		'head': 		$('.G-frameBodyHead', body),
		'content': 		$('.G-frameBodyContent', body),
		'aside': 		$('.G-frameBodyAside', body),
		'footer': 		$('.G-frameBodyFooter', body)
	}
	exports.doms = doms;

});