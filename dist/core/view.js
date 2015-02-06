/**
 * [视图控制模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var C = require('@core/config');

	/**
	 * createIndex 创建主页容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createIndex = function( config ) {
		if( $.type( config ) === 'object' ) {
			var cont = null;
			require.async('layout', function( layout ) {
				var doms = layout.doms;
				cont = doms.index.body;

				// 创建头部
				// layout.buildHeader({
				// 	'target': doms.index['head']
				// });

				// 更新导航激活状态
				// layout.updateNav( config.container );

				// 隐藏blog容器
				doms.blog.body.hide();
				cont.show();

			});
			return cont;
		}
	}

	/**
	 * createArchive 创建栏目容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createArchive = function( config ) {
		if( $.type( config ) === 'object' ) {
			var tag = 'div',
				cont = $('<'+ tag +'/>'),
				contName = config.container,
				width = C['blogWidth'];

			require.async('layout', function( layout ) {
				var doms = layout.doms,
					head = doms.blog.head,
					archiveDom = doms.blog.archive,
					sons = archiveDom.children(),
					i = 0,
					len = sons.size();

				doms.index['body'].hide();
				doms.blog['body'].show();
				doms.blog['article'].hide();
				doms.blog['archive'].show();

				// 创建头部
				if( head.html() === "" ) {
					layout.buildHeader({
						'target': head,
						'css': {
							'width': width
						}
					});
				}

				// 更新导航激活状态
				layout.updateNav( contName );

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
				}).width( width );

				// 隐藏其他栏目
				sons.hide();
				archiveDom.append( cont );
			});
			return cont;
		}
	}

	/**
	 * createArticle 创建文章容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createArticle = function( config ) {
		if( $.type( config ) === 'object' ) {
			var tag = 'div',
				cont = $('<'+ tag +'/>'),
				contName = config.container,
				marker = contName + '/' + config.pageid;

			require.async('layout', function( layout ) {
				var doms = layout.doms,
					head = doms.blog.head,
					articleDom = doms.blog.article,
					sons = articleDom.children(),
					i = 0,
					len = sons.size();

				doms.index['body'].hide();
				doms.blog['body'].show();
				doms.blog['archive'].hide();
				doms.blog['article'].show();

				// 创建头部
				if( head.html() === "" ) {
					layout.buildHeader({
						'target': head
					});
				}

				// 更新导航激活状态
				layout.updateNav( contName );

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
				});

				// 隐藏其他栏目
				sons.hide();
				articleDom.append( cont );
			});
			return cont;
		}
	}
});