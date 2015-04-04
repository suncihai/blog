/**
 * [视图控制模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var C = require('@core/config');

	var Main = {
		/**
		 * createIndex 创建主页容器
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		createIndex: function( config ) {
			if( $.type( config ) !== 'object' ) {
				return false;
			}
			var content = null;
			require.async('layout', function( mod ) {
				var layout = mod.base;
				var indexDOM = layout.getDOM('index');
				var indexBody = indexDOM['body'];
				content = layout.getDOM('index/content');

				// 隐藏滚动条
				layout.getDOM('frame').addClass('overflowHidden');

				// 隐藏blog容器
				indexBody.show().siblings().hide();

			});
			return content.empty();
		},

		/**
		 * createBlog 创建博客容器<archive or article>
		 * @param  {JSON} config   [配置参数]
		 */
		createBlog: function( config ) {
			var self = this;
			var retDOM = null;

			require.async('layout', function( mod ) {
				var layout = mod.base;
				var blogDOM = layout.getDOM('blog');
				var blogBody = blogDOM['body'];
				var head = blogDOM['head'];
				var foot = blogDOM['footer'];

				// 显示滚动条
				layout.getDOM('frame').removeClass('overflowHidden');

				// 隐藏兄弟容器
				blogBody.show().siblings().hide();

				// 创建博客头部/激活导航状态
				layout.buildHeader({
					'target': head,
					'type': 'blog',
					'headroom': true,
					'css': {
						'width': C.blogWidth
					}
				}).updateNav( config.container );

				// 创建博客页脚
				layout.buildFooter({
					'target': foot,
					'type': 'blog',
					'css': {
						'width': C.blogWidth
					},
					'content': C.copyright
				});

				// 存在pageid为文章页
				if( config.pageid ) {
					retDOM = self._createArticle( layout, config );
				}
				// 不存在则为列表页
				else {
					retDOM = self._createArchive( layout, config );
				}
			});
			return retDOM;
		},

		/**
		 * _createArchive 创建栏目容器
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		_createArchive: function( layout, config ) {
			if( $.type( config ) !== 'object' ) {
				return false;
			}
			var tag = 'div';
			var cont = $('<'+ tag +'/>');
			var contName = config.container;
			var blogDOM = layout.getDOM('blog');
			var archiveDom = blogDOM['archive'];
			archiveDom.empty();

			blogDOM['article'].hide();
			blogDOM['archive'].show();


			// 添加标识属性
			cont.attr({
				'class': 'P-archives',
				'archive-name': contName
			}).width( C.blogWidth );

			archiveDom.append( cont );

			return cont;
		},

		/**
		 * _createArticle 创建文章容器
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		_createArticle: function( layout, config ) {
			if( $.type( config ) !== 'object' ) {
				return false;
			}
			var tag = 'div';
			var cont = $('<'+ tag +'/>');
			var contName = config.container;
			var marker = contName + '/' + config.pageid;

			var blogDOM = layout.getDOM('blog');
			var articleDom = blogDOM['article'];
			articleDom.empty();

			blogDOM['archive'].hide();
			blogDOM['article'].show();

			// 添加标识属性
			cont.attr({
				'class': 'P-article',
				'article-name': marker
			}).width( C.blogWidth );

			articleDom.append( cont );

			return cont;
		},

		/**
		 * createBlank 返回空白容器<与index/blog同级>
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		createBlank: function() {
			var blank = null;
			require.async('layout', function( mod ) {
				var layout = mod.base;
				blank = layout.getDOM('blank');
				blank.show().siblings().hide();
			});
			return blank.empty();
		}
	}
	exports.base = Main;

});