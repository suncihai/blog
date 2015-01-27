/**
 * [布局模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var util = require('@core/util');
	var C = require('@core/config');
	var header = require('@modules/header');

	// 整体框架布局
	var layout = [
		'<div id="MAIN">',
			'<div class="G-frame">',
				'<div class="G-frameBody">',
					// 首页
					'<div class="G-frameBodyIndex">',
						'<div class="G-frameBodyIndexHead"/>',
						'<div class="G-frameBodyIndexContent"/>',
						'<div class="G-frameBodyIndexFooter"/>',
					'</div>',
					// 博客
					'<div class="G-frameBodyBlog">',
						'<div class="G-frameBodyBlogHead"/>',
						'<div class="G-frameBodyBlogArchive"/>',
						'<div class="G-frameBodyBlogArticle"/>',
						'<div class="G-frameBodyBlogFooter"/>',
					'</div>',
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
		// 框架容器：
		'frame': 		$('.G-frame', body),
		'body': 		$('.G-frameBody', body),
		// 主页容器：
		'index': {
			'body': 	$('.G-frameBodyIndex', body),
			'head': 	$('.G-frameBodyIndexHead', body),
			'content': 	$('.G-frameBodyIndexContent', body),
			'footer': 	$('.G-frameBodyIndexFooter', body)
		},
		// 博客容器
		'blog': {
			'body': 	$('.G-frameBodyBlog', body),
			'head': 	$('.G-frameBodyBlogHead', body),	// 头部容器
			'archive': 	$('.G-frameBodyBlogArchive', body),	// 栏目容器
			'article': 	$('.G-frameBodyBlogArticle', body),	// 文章容器
			'footer': 	$('.G-frameBodyBlogFooter', body)
		}
	}
	exports.doms = doms;

	/**
	 * init 初始化
	 * @return {type} [layout]
	 */
	exports.init = function() {
		// 移除一些提示
		$('noScript,#welcome').remove();
		return this;
	}

	/**
	 * buildHeader 创建头部
	 * @param  {Object} config [配置,应包含创建头部的目标DOM]
	 * @return {type} [layout]
	 */
	exports.buildHeader = function( config ) {
		// require.async('@modules/header', function( header ) {
			header.init( config );
		// });
		return this;
	}

	/**
	 * updateNav 更新导航选中状态
	 * @param  {String} link [导航hash值]
	 * @return {type}        [layout]
	 */
	exports.updateNav = function( link ) {
		header.updateNav( link );
		return this;
	}

	/**
	 * setTitle 设置网站title, 栏目与标题的组合，一个参数则直接设置
	 * @param {type} name  [栏目名称]
	 * @param {type} title [文章名称]
	 */
	exports.setTitle = function( name, title ) {
		var str = '', art, arc;
		if( util.isString( name ) && arguments.length == 1 ) {
			str = name;
		}
		else {
			art = title == null ? '' : title + ' | ';
			arc = C.archiveTitle[name] || C.archiveTitle.index;
			str = art + arc;
		}
		$(document).attr('title', str);
		return this;
	}

});