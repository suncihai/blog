/**
 * [视图控制模块]
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var c = require('@boot/config');
	var LAYOUT_PATH = '@view/layout';

	var Main = {
		/**
		 * createIndex 创建主页容器
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		createIndex: function(config) {
			if ($.type(config) !== 'object') {
				return false;
			}
			var content = null;
			require.async(LAYOUT_PATH, function(layout) {
				content = layout.getDOM('index/content');

				// 隐藏滚动条
				layout.getDOM('frame').addClass('overflowHidden');

				// 隐藏blog容器
				layout.switchContainer('index');

			});
			return content;
		},

		/**
		 * createBlog 创建博客容器<archive or article>
		 * @param  {JSON} config   [配置参数]
		 */
		createBlog: function(config) {
			var self = this;
			var retDOM = null;

			require.async(LAYOUT_PATH, function(layout) {
				var blogDOM = layout.getDOM('blog');
				var head = blogDOM.head;
				var foot = blogDOM.footer;

				// 显示滚动条
				layout.getDOM('frame').removeClass('overflowHidden');

				// 隐藏兄弟容器
				layout.switchContainer('blog');

				// 创建博客头部/激活导航状态
				layout.buildHeader({
					'target': head,
					'type': 'blog',
					'headroom': true,
					'css': {
						'width': c.blogWidth
					}
				}).updateNav(config.container);

				// 创建博客页脚
				layout.buildFooter({
					'target': foot,
					'type': 'blog',
					'css': {
						'width': c.blogWidth
					},
					'content': c.copyright
				});

				// 存在pageid为文章页
				if (config.pageid) {
					retDOM = self._createArticle(layout, config);
				}
				// 不存在则为列表页
				else {
					retDOM = self._createArchive(layout, config);
				}
			});
			return retDOM;
		},

		/**
		 * _createArchive 创建栏目容器
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		_createArchive: function(layout, config) {
			if ($.type(config) !== 'object') {
				return false;
			}
			var tag = 'div';
			var cont = $('<'+ tag +'/>');
			var contName = config.container;
			var blogDOM = layout.getDOM('blog');
			var archiveDom = blogDOM.archive;
			archiveDom.empty();

			blogDOM.article.hide();
			blogDOM.archive.show();


			// 添加标识属性
			cont.attr({
				'class': 'P-archives',
				'archive-name': contName
			});

			archiveDom.append(cont);

			return cont;
		},

		/**
		 * _createArticle 创建文章容器
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		_createArticle: function(layout, config) {
			if ($.type(config) !== 'object') {
				return false;
			}
			var tag = 'div';
			var cont = $('<'+ tag +'/>');
			var contName = config.container;
			var marker = contName + '/' + config.pageid;

			var blogDOM = layout.getDOM('blog');
			var articleDom = blogDOM.article;
			articleDom.empty();

			blogDOM.archive.hide();
			blogDOM.article.show();

			// 添加标识属性
			cont.attr({
				'class': 'P-article',
				'article-name': marker
			});

			articleDom.append(cont);

			return cont;
		},

		/**
		 * createBlank 返回空白容器<与index/blog同级>
		 * @param  {JSON} config   [配置参数]
		 * @return {Object}        [容器对象]
		 */
		createBlank: function() {
			var blank = null;
			require.async(LAYOUT_PATH, function(layout) {
				blank = layout.getDOM('blank');
				layout.switchContainer('blank');
			});
			return blank;
		}
	}
	module.exports = Main;

});