define(function( require, exports ){
	var $ = require('jquery');
	var util = require('@core/util');
	var C = require('@core/config');

	// 整体框架布局
	var layout = [
		'<div id="MAIN">',
			'<div class="G-frame">',
				'<div class="G-frameBody">',
					'<div class="G-frameBodyHead"/>',
					'<div class="G-frameBodyContent"/>',
					'<div class="G-frameBodyAside"/>',
					'<div class="G-frameBodyFooter"/>',
				'</div>',
			'</div>',
		'</div>',
		'<div id="LOADING"><span><em></em></span></div>',
		'<div id="POPWIN"><span><em></em></span></div>'
	].join('');

	var body = $('body').append( layout );
	var doms = {
		// 框架结构：
		'MAIN': 		$('#MAIN'),
		'LOADING':  	$('#LOADING'),
		'POPWIN': 		$('#POPWIN'),

		// 框架主体：
		'frame': 		$('.G-frame', body),
		'body': 		$('.G-frameBody', body),
		'head': 		$('.G-frameBodyHead', body),
		'content': 		$('.G-frameBodyContent', body),
		'aside': 		$('.G-frameBodyAside', body),
		'footer': 		$('.G-frameBodyFooter', body)
	}
	exports.doms = doms;

	// 移除一些提示
	$('#noScript').remove();

	// 构建导航
	exports.buildNav = function() {
		var navs = [];
		$.each( C.nav, function( idx, item ) {
			navs.push([
				'<li>',
					'<a href="#' + item.link + '" data-id="' + idx + '">' + item.name + '</a>',
				'</li>'
			].join(''));
		});
		doms.head.append( '<ul>' + navs.join('') + '</ul>' );
		return this;
	}

	exports.buildAside = function() {
		doms.aside.html('侧边栏');
		doms.footer.html('bidingX');
	}

});