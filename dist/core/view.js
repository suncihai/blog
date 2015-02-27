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
			var sons = archiveDom.children();
			var i = 0, len = sons.size();

			blogDOM['article'].hide();
			blogDOM['archive'].show();

			// 防止重复创建 TODO: 不要用DOM查找的方式判断
			for( ; i < len; i++ ) {
				if( sons.eq(i).attr('archive-name') === contName ) {
					sons.eq(i).show().siblings().hide();
					return false;
				}
			}

			// 添加标识属性
			cont.attr({
				'class': 'P-archives',
				'archive-name': contName
			}).width( C.blogWidth );

			// 隐藏其他栏目
			sons.hide();
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
			var sons = articleDom.children();
			var i = 0, len = sons.size();

			blogDOM['archive'].hide();
			blogDOM['article'].show();

			// 防止重复创建
			for( ; i < len; i++ ) {
				if( sons.eq(i).attr('article-name') === marker ) {
					sons.eq(i).show().siblings().hide();
					return false;
				}
			}

			// 添加标识属性
			cont.attr({
				'class': 'P-article',
				'article-name': marker
			}).width( C.blogWidth );

			// 隐藏其他栏目
			sons.hide();
			articleDom.append( cont );

			return cont;
		},

		/**
		 * createNotFound 返回404容器
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		createNotFound: function() {
			var blank = null;
			require.async('layout', function( mod ) {
				var layout = mod.base;
				blank = layout.getDOM('blank');
				blank.show().siblings().hide();
			});
			return blank;
		}
	}
	exports.base = Main;

});