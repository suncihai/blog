/**
 * [视图控制模块]
 */
define(function( require, exports ){
	var $ = require('jquery');

	/**
	 * createIndex 创建主页容器
	 * @param  {JSON} config   [配置参数]
	 * @return {Object}        [容器对象]
	 */
	exports.createIndex = function( config ) {
		if( $.type( config ) === 'object' ) {
			var cont = null;
			require.async('layout', function( layout ) {
				cont = layout.doms.index;

				// 隐藏wrapper容器
				layout.doms.wrapper.hide();
				cont.show();

				// 更新导航激活状态
				layout.updateNav( config.container );
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
				contName = config.container;

			require.async('layout', function( layout ) {
				var DomC = layout.doms.archive,
					Sons = DomC.children(),
					i = 0,
					len = Sons.size();

				layout.doms.index.hide();
				layout.doms.wrapper.show();
				layout.doms.article.hide();
				layout.doms.archive.show();

				// 更新导航激活状态
				layout.updateNav( contName );

				// 防止重复创建
				for( ; i < len; i++ ) {
					if( Sons.eq(i).attr('archive-name') === contName ) {
						Sons.eq(i).show().siblings().hide();
						return;
					}
				}

				// 添加标识属性
				cont.attr({
					'class': 'P-archives',
					'archive-name': contName
				});

				// 隐藏其他栏目
				Sons.hide();
				DomC.append( cont );
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
				var DomA = layout.doms.article,
					Sons = DomA.children(),
					i = 0,
					len = Sons.size();

				layout.doms.index.hide();
				layout.doms.wrapper.show();
				layout.doms.archive.hide();
				layout.doms.article.show();

				// 更新导航激活状态
				layout.updateNav( contName );

				// 防止重复创建
				for( ; i < len; i++ ) {
					if( Sons.eq(i).attr('article-name') === marker ) {
						Sons.eq(i).show().siblings().hide();
						return;
					}
				}

				// 添加标识属性
				cont.attr({
					'class': 'P-article',
					'article-name': marker
				});

				// 隐藏其他栏目
				Sons.hide();
				DomA.append( cont );
			});
			return cont;
		}
	}
});