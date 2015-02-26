/**
 * [布局模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var util = require('@core/util');
	var C = require('@core/config');
	var header = require('@modules/header').base;

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
						'<div class="G-frameBodyBlogBanner"/>',
						'<div class="G-frameBodyBlogArchive"/>',
						'<div class="G-frameBodyBlogArticle"/>',
						'<div class="G-frameBodyBlogFooter"/>',
					'</div>',
					// 空白页
					'<div class="G-frameBodyBlank"/>',
				'</div>',
			'</div>',
		'</div>',
		'<div id="LOADING/">',
		'<div id="POPWIN/">'
	].join('');

	var body = $('body').append( layout );
	var doms = {
		// 框架结构：
		'MAIN'    : 		$('#MAIN'),
		'LOADING' :  		$('#LOADING'),
		'POPWIN'  : 		$('#POPWIN'),
		// 框架容器：
		'frame'   : 		$('.G-frame', body),
		'body'    : 		$('.G-frameBody', body),
		// 主页容器：
		'index': {
			'body'    : 	$('.G-frameBodyIndex', body),
			'head'    : 	$('.G-frameBodyIndexHead', body),
			'content' : 	$('.G-frameBodyIndexContent', body),
			'footer'  : 	$('.G-frameBodyIndexFooter', body)
		},
		// 博客容器
		'blog': {
			'body'    : 	$('.G-frameBodyBlog', body),
			'head'    : 	$('.G-frameBodyBlogHead', body),	// 头部LOGO、导航、TOOL容器
			'banner'  : 	$('.G-frameBodyBlogBanner', body),	// Banner容器
			'archive' : 	$('.G-frameBodyBlogArchive', body),	// 栏目列表容器
			'article' : 	$('.G-frameBodyBlogArticle', body),	// 文章内容容器
			'footer'  : 	$('.G-frameBodyBlogFooter', body)
		},
		// 空白容器
		'blank' : 			$('.G-frameBodyBlank', body)
	}

	var Main = {
		/**
		 * init 初始化
		 * @return {type} [layout]
		 */
		init: function() {
			// 移除一些提示
			$('noScript,#welcome').remove();
			// 缓存变量$tick
			this.$tick = {
				'headerType': [] // 头部类型 [blog,index]
			}
		},

		/**
		 * getDOM 获取指定DOM对象
		 * @param  {String} domName [需要获取的DOM对象,格式为blog/head, 暂时支持两层]
		 * @return {Object} [DOM]
		 */
		getDOM: function( domName ) {
			var retDom, domArr = domName.toString().split('/');
			return domArr.length === 2 ? doms[domArr[0]][domArr[1]] : doms[domArr[0]];
		},

		/**
		 * buildHeader 创建头部
		 * @param  {Object} config [配置,应包含创建头部的目标DOM]
		 * @return {type} [layout]
		 */
		buildHeader: function( config ) {
			var self = this;
			var type = config['type']; // 头部类型, index,blog
			var types = self._getTick('headerType');
			var exist = util.inArray( type, types );
			if( exist === -1 ) {
				header.init( config , function( completed ) {
					if( completed ) {
						self._setTick( 'headerType', type );
					}
				});
			}
			return self;
		},

		/**
		 * updateNav 更新导航选中状态
		 * @param  {String} link [导航hash值]
		 * @return {type}        [layout]
		 */
		updateNav: function( link ) {
			var nav = header.getChild('nav');
			nav.updateNav( link );
			return this;
		},

		/**
		 * setTitle 设置网站title, 栏目与标题的组合，一个参数则直接设置
		 * @param {type} name  [栏目名称]
		 * @param {type} title [文章名称]
		 */
		setTitle: function( name, title ) {
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
		},

		/**
		 * buildBanner 构建博客的Banner内容
		 */
		buildBanner: function() {},

		/**
		 * _setTick 设置tick(内部调用)
		 * @param {String} name [缓存的字段,eg: field, field/subfield]
		 * @param {Mixed}  val [缓存值]
		 */
		_setTick: function( name, val ) {
			var tick = this.$tick[name];
			// 字符串
			if( util.isString( tick ) ) {
				this.$tick[name] = val.toString();
			}
			// 数组
			else if( util.isArray( tick ) ) {
				this.$tick[name].push( val );
			}
			// 对象及其他
			else {
				this.$tick[name] = val;
			}
			return false;
		},

		/**
		 * _getTick 获取tick(内部调用)
		 * @param {String} field [需要获取的tick字段]
		 */
		_getTick: function( field ) {
			return this.$tick[field];
		}
	}
	exports.base = Main;
});