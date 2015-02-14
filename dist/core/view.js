/**
 * [视图控制模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var C = require('@core/config');
	var blogWidth = C['blogWidth']

	/**
	 * createIndex 创建主页容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createIndex = function( config ) {
		if( $.type( config ) !== 'object' ) {
			return false;
		}
		var body = null;
		require.async('layout', function( mod ) {
			var layout = mod.base;
			var indexDOM = layout.getDOM('index');
			var indexBody = body = indexDOM['body'];

			// 创建头部/激活导航状态
			layout.buildHeader({
				'target': indexDOM['head'],
				'type': 'index',
				'headroom': true,
				'css': {
					'width': C.indexWidth
				}
			}).updateNav( config.container );

			// 隐藏blog容器
			indexBody.show().siblings().hide();

		});
		return body;
	}

	/**
	 * createArchive 创建栏目容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createArchive = function( config ) {
		if( $.type( config ) !== 'object' ) {
			return false;
		}
		var tag = 'div';
		var	cont = $('<'+ tag +'/>');
		var	contName = config.container;

		require.async('layout', function( mod ) {
			var layout = mod.base;
			var blogDOM = layout.getDOM('blog');
			var	blogBody = blogDOM['body'];
			var	head = blogDOM['head'];
			var	archiveDom = blogDOM['archive'];
			var	sons = archiveDom.children();
			var	i = 0, len = sons.size();

			blogBody.show().siblings().hide();
			blogDOM['article'].hide();
			blogDOM['archive'].show();

			// 创建头部/激活导航状态
			layout.buildHeader({
				'target': head,
				'type': 'blog',
				'headroom': true,
				'css': {
					'width': blogWidth
				}
			}).updateNav( contName );

			// 防止重复创建
			for( ; i < len; i++ ) {
				if( sons.eq(i).attr('archive-name') === contName ) {
					sons.eq(i).show().siblings().hide();
					return;
				}
			}

			// 添加标识属性
			cont.attr({
				'class': 'P-archives',
				'archive-name': contName
			}).width( blogWidth );

			// 隐藏其他栏目
			sons.hide();
			archiveDom.append( cont );
		});
		return cont;
	}

	/**
	 * createArticle 创建文章容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createArticle = function( config ) {
		if( $.type( config ) !== 'object' ) {
			return false;
		}
		var tag = 'div';
		var	cont = $('<'+ tag +'/>');
		var	contName = config.container;
		var	marker = contName + '/' + config.pageid;

		require.async('layout', function( mod ) {
			var layout = mod.base;
			var blogDOM = layout.getDOM('blog');
			var	blogBody = blogDOM['body'];
			var	head = blogDOM['head'];
			var	articleDom = blogDOM['article'];
			var	sons = articleDom.children();
			var	i = 0, len = sons.size();

			blogBody.show().siblings().hide();
			blogDOM['archive'].hide();
			blogDOM['article'].show();

			// 创建头部/激活导航状态
			layout.buildHeader({
				'target': head,
				'type': 'blog',
				'headroom': true,
				'css': {
					'width': blogWidth
				}
			}).updateNav( contName );

			// 防止重复创建
			for( ; i < len; i++ ) {
				if( sons.eq(i).attr('article-name') === marker ) {
					sons.eq(i).show().siblings().hide();
					return;
				}
			}

			// 添加标识属性
			cont.attr({
				'class': 'P-article',
				'article-name': marker
			}).width( blogWidth );

			// 隐藏其他栏目
			sons.hide();
			articleDom.append( cont );
		});
		return cont;
	}

	/**
	 * createNotFound 返回404容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createNotFound = function() {
		var blank = null;
		require.async('layout', function( mod ) {
			var layout = mod.base;
			blank = layout.getDOM('blank');
			blank.show().siblings().hide();
		});
		return blank;
	}
});