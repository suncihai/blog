/**
 * [搜索结果页面]
 */
define(function(require, exports) {
	var app = require('app');
	var util = app.util;
	var prettyDate = require('@widget/prettyDate');

	var Search = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'P-search',
				'template': 'template/pages/search.html',
				'vModel'  : {
					// 是否显示加载状态
					'isLoading': true,
					// 搜索结构vm数据
					'searchs'  : [],
					// 是否显示分页
					'showPager': false,
					// 是否显示错误信息
					'showError': false,
					// 错误提示信息
					'errorMsg' : ''
				}
			});
			// 搜索关键词
			this.$word = '';
			// 数据状态锁
			this.$dateReady = false;
			this.Super('init', arguments);
		},

		/**
		 * 视图渲染完毕
		 */
		viewReady: function() {
			// 创建子模块 分页器
			this.createTplModules();
		},

		/**
		 * 显示加载状态并隐藏页脚
		 */
		showLoading: function() {
			this.vm.set('isLoading', true);
			this.notify('layout.blogFooter', 'switchFooter', false);
			return this;
		},

		/**
		 * 隐藏加载状态并显示页脚
		 */
		hideLoading: function() {
			this.vm.set('isLoading', false);
			this.notify('layout.blogFooter', 'switchFooter', true);
			return this;
		},

		/**
		 * 保存路由参数
		 */
		saveRouter: function(data) {
			this.$router = data;
			this.$word = data.search && data.search.word;
			this.updateBanner().load();
			return this;
		},

		/**
		 * 设置搜索参数
		 * @param  {Object}  search  [搜索参数]
		 */
		setParam: function(search) {
			this.$word = search && search.word;
			this.updateBanner();
			return this;
		},

		/**
		 * 更新banner
		 */
		updateBanner: function(text) {
			var word = this.$word;
			text = text || T('正在搜索有关「{1}」的文章记录', word) + ' ……';

			// 更新标题
			this.notify('layout', 'changeTitle', T('{1}_搜索结果', word));

			// 向banner模块发消息
			this.notify('layout.blogBanner', 'updateQuotations', text);
			return this;
		},

		/**
		 * 拉取搜索结果数据
		 */
		load: function() {
			var word = this.$word;

			this.$dateReady = false;
			this.showLoading();

			if (word) {
				app.ajax.get(app.config('api/search'), {
					'word': word
				}, this.delayData, this);
			}
		},

		/**
		 * 延迟展现
		 */
		delayData: function() {
			this.setTimeout('afterDataBack', 2000, arguments);
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
				app.tooltip.setTip({
					'arrow'  : false,
					'type'   : 'warning',
					'content': err.message
				});
				this.vm.set({
					'showPager': false,
					'showError': true,
					'errorMsg' : err.message
				});
				return false;
			}

			var result = data.result;

			// 构建列表
			this.setSearchList(result.items);

			// 更新分页信息
			var pager = this.getChild('pager');
			var pages = result.pages;
			if (pager && pages > 1) {
				this.vm.set('showPager', true);
				pager.setParam({
					'page' : result.page,
					'pages': pages
				});
			}

			var text = T("搜到与「{1}」相关的结果共{2}条：", this.$word, result.total);
			this.updateBanner(text);
		},

		/**
		 * 构建搜索结果列表
		 * @param  {Array}  items  [搜索结果数据]
		 */
		setSearchList: function(items) {
			var searchs = [];
			var achive;
			var category = app.config('category');

			util.each(items, function(item, index) {
				// 栏目
				achive = util.getKey(item.catId, category);

				searchs.push({
					'index'   : '#' + (index + 1),
					'anchor'  : '#' + achive + '/' + item.id,
					'title'   : item.title,
					'brief'   : item.brief,
					'achive'  : achive,
					'comments': item.comments,
					'date'    : prettyDate.format(item.date)
				});
			});

			this.vm.set('searchs', searchs);
		},

		/**
		 * 重置模块为初始状态
		 */
		reset: function() {
			var chs = this.getChilds(true);
			util.each(chs, function(child) {
				if (util.isFunc(child.reset)) {
					child.reset();
				}
			});

			this.$word = '';
			this.$dateReady = false;

			this.vm.reset();
			return this;
		}
	});
	exports.base = Search;
});