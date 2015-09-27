/**
 * [文章评论模块，列表+表单]
 */
define(function(require, exports) {
	var app = require('app');
	var util = app.util;

	var api = app.config('api/listcomment');

	// 评论列表基础模块
	var CommentList = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'M-comment',
				'template': 'project/template/modules/commentList.html',
				'vModel'  : {
					// 是否显示加载状态
					'isLoading': false,
					// 评论数是否为0
					'isEmpty'  : true,
					// 评论列表
					'comments' : []
				}
			});
			// 初始请求参数
			this.$param = util.clone(app.config('commentParam'));
			// 请求数据状态锁
			this.$dataReady = false;
			this.Super('init', arguments);
		},

		/**
		 * 布局视图初始化完成
		 */
		viewReady: function() {
			// 创建子模块
			this.createTplModules();
		},

		/**
		 * 显示加载状态
		 */
		showLoading: function() {
			this.vm.set('isLoading', true);
			return this;
		},

		/**
		 * 隐藏加载状态
		 */
		hideLoading: function() {
			this.vm.set('isLoading', false);
			return this;
		},

		/**
		 * 加载评论列表
		 * @param   {Number}  artid  [文章id]
		 */
		load: function(artid) {
			this.$dataReady = false;
			this.showLoading();
			var param = util.extend(this.$param, {
				'artid': artid
			});
			app.ajax.get(api, param, this.afterDataBack, this);
		},

		/**
		 * 请求数据回调
		 * @param   {Object}  err   [请求错误信息]
		 * @param   {Object}  data  [请求成功信息]
		 */
		afterDataBack: function(err, data) {
			this.$dataReady = true;
			this.hideLoading();

			if (err) {
				util.error(err);
				return false;
			}

			var result = data.result;
			var items = result.items;
			var page = result.page;
			var pages = result.pages;
			var total = result.total;

			// 评论分页参数
			var pager = this.getChild('pager');
			if (pager) {
				pager.setParam({
					'page' : page,
					'pages': pages
				});
			}

			this.vm.set('isEmpty', items.length === 0);

			// 构建列表
			this.setList(items);

		},

		/**
		 * 评论列表数据转换
		 * @param  {Array}  items  [评论数组]
		 */
		setList: function(items) {
			console.log(items);
		}
	});
	exports.list = CommentList;
});