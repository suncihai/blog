/**
 * [栏目页面]
 */
define(function(require, exports, module) {
	var sugar = require('sugar');
	var util = sugar.util;
	var $ = sugar.jquery;
	var prettyDate = require('@widget/prettyDate');

	// 语录集合
	var quotations = sugar.config('quotations');
	// 更改标题
	var catNameMap = sugar.config('archiveTitle');

	var Achives = sugar.Container.extend({
		init: function(config) {
			config = sugar.cover(config, {
				'class'   : 'P-archive',
				'template': 'template/pages/archive.html',
				'vModel'  : {
					// 显示加载
					'isLoading': true,
					// 是否显示分页
					'showPager': true,
					// 是否显示错误提示
					'showError': false,
					// 错误提示信息
					'errorMsg' : '',
					// 列表数组
					'archives' : []
				}
			});
			// 动态请求参数，随着分页数据变化
			this.$param = util.copy(sugar.config('archiveParam'));
			// 请求数据状态锁
			this.$dataReady = false;
			this.Super('init', arguments);
		},

		/**
		 * 布局视图渲染完成
		 */
		viewReady: function() {
			// 创建子模块
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
		 * @param  {Object}  data  [路由参数]
		 */
		saveRouter: function(data) {
			// 栏目数据库id
			var category = sugar.config('category');

			// 路由数据
			this.$router = data;
			// 路由名称
			this.$routerName = data && data.name;

			// 列表请求参数
			this.setParam({
				'page' : data && data.search && +data.search.page || 1,
				'catid': category[this.$routerName]
			});

			// 更新banner内容
			this.updateBanner();

			// 加载列表数据
			this.load();
			return this;
		},

		/**
		 * 更新banner
		 */
		updateBanner: function() {
			console.log(this.$param, this.$routerName);
			// 向banner模块发消息
			var n = quotations.length - 1;
			var qts = quotations[util.random(0, n)];
			this.notify('layout.blogBanner', 'updateQuotations', qts);
		},

		/**
		 * 设置请求参数
		 * @param  {Object}   param    [新参数]
		 * @param  {Boolean}  replace  [是否替换当前参数]
		 */
		setParam: function(param, replace) {
			this.$param = replace ? param : util.extend(this.$param, param);
			return this;
		},

		/**
		 * 获取请求参数
		 */
		getParam: function() {
			return this.$param;
		},

		/**
		 * 拉取列表数据
		 */
		load: function() {
			var router = this.$router;
			// 检查路由参数
			var search = router && router.search;

			// 获取请求参数
			var param = this.getParam();

			if (search) {
				param = util.extend(param, {
					'page': +search.page
				});
			}

			this.$dataReady = false;
			this.showLoading();

			sugar.ajax.get(sugar.config('api/listarchives'), param, this.delayData, this);
			return this;
		},

		/**
		 * 延迟展现
		 */
		delayData: function() {
			this.setTimeout('afterDataBack', sugar.config('delay'), arguments);
		},

		/**
		 * 请求数据回调
		 * @param   {Object}  err   [请求错误信息]
		 * @param   {Object}  data  [请求成功信息]
		 */
		afterDataBack: function(err, data) {
			this.$dataReady = true;
			this.hideLoading();

			// 路由名称
			var routerName = this.$routerName;

			if (err) {
				util.error(err);
				sugar.tooltip.setTip({
					'arrow'  : false,
					'type'   : 'warning',
					'content': T(err.message)
				});
				this.vm.set({
					'showPager': false,
					'showError': true,
					'errorMsg' : T(err.message)
				});
				return false;
			}

			var result = data.result;

			// 构建列表
			this.setList(result.items);

			// 更新分页信息
			var pager = this.getChild('pager');
			var page = result.page;
			if (pager) {
				pager.setParam({
					'page' : page,
					'pages': result.pages,
					'path' : routerName
				});
			}

			// 更新标题
			var title = catNameMap[routerName] + ' - ' + T('第{1}页', page);
			this.notify('layout', 'changeTitle', title);
		},

		/**
		 * 构建文章列表
		 * @param  {Array}  items  [列表数据]
		 */
		setList: function(items) {
			var archives = [];
			// 路由名称
			var routerName = this.$routerName;

			// 数据结构转化
			util.each(items, function(item) {
				archives.push({
					'id'      : item.id,
					'href'    : '#' + routerName + '/' + item.id,
					'title'   : item.title,
					'content' : item.content,
					'cover'   : item.cover ? '<img class="lazy-image" data-src="'+ item.cover +'"/>' : '',
					'date'    : prettyDate.format(item.date),
					'comments': item.comments
				});
			});

			this.vm.set('archives', archives);

			this.setTimeout('showThumb');
		},

		/**
		 * 显示缩略图
		 */
		showThumb: function() {
			var list = this.getDOM('.P-archiveList');
			var lazys = list.find('.lazy-image');
			$(document).ready(function() {
				lazys.each(function() {
					$(this).attr('src', $(this).attr('data-src'));
				});
			});
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

			this.$dataReady = false;
			this.vm.reset();
			return this;
		}
	});
	exports.base = Achives;
});