/**
 * 全局基础布局模块，定义系统通用布局
 */
define(function(require, exports) {
	var app = require('app');

	var Layout = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'G-frame',
				'tag'     : 'div',
				'template': 'project/template/layout.html'
			});
			this.Super('init', arguments);
		},

		/**
		 * 布局视图渲染完成
		 */
		viewReady: function() {
			// DOM缓存
			var dom = this.getDOM();
			this.$doms = {
				// 全局布局主体
				'BODY'  : dom.find('.G-frameBody'),
					// 主页容器
					'index': dom.find('.G-frameBodyIndex'),
						'indexHead'   : dom.find('.G-frameBodyIndexHead'),
						'indexContent': dom.find('.G-frameBodyIndexConetnt'),
						'indexFooter' : dom.find('.G-frameBodyIndexFooter'),
					// 博客容器
					'blog' : dom.find('.G-frameBodyBlog'),
						'blogHead'   : dom.find('.G-frameBodyBlogHead'),
						'blogBanner' : dom.find('.G-frameBodyBlogBanner'),
						'blogArchive': dom.find('.G-frameBodyBlogArchive'),
						'blogArticle': dom.find('.G-frameBodyBlogArticle'),
						'blogFooter' : dom.find('.G-frameBodyBlogFooter'),
					// 空白页容器
					'blank': dom.find('.G-frameBodyBlank'),
				// 全局蒙版
				'MASK'  : dom.find('.G-frameMask'),
				// 全局对话框
				'DIALOG': dom.find('.G-frameDialog'),
				// 全局弹出层
				'LAYER' : dom.find('.G-frameLayer')
			};

			// 创建子模块
			this.createTplModules();
		},

		/**
		 * 子模块创建完成
		 */
		afterBuild: function() {},

		/**
		 * 返回layout模块的子容器（$doms缓存内容）
		 * @param   {String}  name  [指定的子容器名称，不传返回整个$doms]
		 * @return  {Object}        [DOM对象]
		 */
		getContainer: function(name) {
			return name ? this.$doms[name] : this.$doms;
		},

		/**
		 * 切换显示不同场景，定义最外层容器的显示规则
		 * scene: index(主页)、blog(博客)、blank(空白页)
		 * @param   {String}  scene  [切换到的场景名称]
		 */
		switchScene: function(scene) {
			var doms = this.getContainer();

			switch (scene) {
				// 主页&空白页
				case 'index':
				case 'blank':
					doms[scene].show().siblings().hide();
				break;
				// 博客栏目页
				case 'blogArchive':
					doms.blog.show().siblings().hide();
					doms.blogArchive.show();
					doms.blogArticle.hide();
				break;
				// 博客文章页
				case 'blogArticle':
					doms.blog.show().siblings().hide();
					doms.blogArticle.show();
					doms.blogArchive.hide();
				break;
			}
		}
	});
	exports.base = Layout;
});