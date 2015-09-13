/**
 * 视图切换控制模块
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var util = require('util');
	var c = require('@boot/config');
	var LAYOUT_PATH = '@view/layout';

	var ViewControler = {
		/**
		 * getIndex 获取主页容器
		 * @return  {Object}  [容器对象]
		 */
		getIndex: function(config) {
			var container = null;
			require.async(LAYOUT_PATH, function(layout) {
				// 获取容器
				container = layout.getDOM('index/content');

				// 主页隐藏滚动条
				layout.getDOM('frame').addClass('overflowHidden');

				layout.switchContainer('index');

			});

			return container;
		},

		/**
		 * getBlog 获取博客容器
		 * @param  {JSON} config   [配置参数]
		 */
		getBlog: function(config) {
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
		 * 返回栏目页容器
		 * @return  {Object}  [栏目页jQueryDOM对象]
		 */
		getBlogAchive: function() {},

		/**
		 * 返回文章页容器
		 * @return  {Object}  [文章页jQueryDOM对象]
		 */
		getBlogArticle: function() {},


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
	module.exports = ViewControler;

});