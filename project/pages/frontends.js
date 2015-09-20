/**
 * [栏目页面]
 */
define(function(require, exports, module) {
	var app = require('app');
	var util = app.util;
	var $ = app.jquery;

	// 请求地址
	var api = app.config('api/listarchives');
	// 初始请求参数
	var param = app.config('archiveParam');
	// 语录集合
	var quotations = app.config('quotations');


	var Achives = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'P-archive',
				'template': 'project/template/pages/archive.html',
				'vModel'  : {
					// 显示加载
					'isLoading': true,
					// 列表数组
					'archives' : []
				}
			});
			// 动态请求参数，随着分页数据变化
			this.$param = util.clone(param);
			// 请求数据状态锁
			this.$dataReady = false;
			this.Super('init', arguments);
		},

		/**
		 * 布局视图初始化完成
		 */
		viewReady: function() {
			var c = this.getConfig();

			// 创建子模块
			this.createTplModules();

			// 向banner模块发消息
			var n = quotations.length - 1;
			var qts = quotations[util.random(0, n)];
			this.send('layout.blogBanner', 'updateQuotations', qts);
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
		 * 在路由调用之后，保存路由参数
		 * @param  {Object}  data  [路由参数]
		 */
		saveRouter: function(data) {
			this.$router = data;
			// 加载列表数据
			this.load();
			return this;
		},

		/**
		 * 更新请求参数
		 * @param  {Object}   param    [新参数]
		 * @param  {Boolean}  replace  [是否替换当前参数]
		 */
		setParam: function(param, replace) {
			this.$param = replace ? param : util.extend(this.$param, param);
			return this;
		},

		/**
		 * 拉取列表数据
		 * @param   {Object}  param  [请求参数]
		 */
		load: function(param) {
			// 检查路由参数
			var search = this.$router && this.$router.search;
			if (search) {
				this.$param = util.extend(this.$param, {
					'page': +search.page
				});
			}

			this.$dataReady = false;
			param = param || this.$param;

			this.showLoading();
			app.ajax.get(api, param, this.dataListRequested, this);
		},

		/**
		 * 请求数据回调
		 * @param   {Object}  err   [请求错误信息]
		 * @param   {Object}  data  [请求成功信息]
		 */
		dataListRequested: function(err, data) {
			if (err) {
				util.error(err);
				return false;
			}
			// 创建列表
			this.setList(data.items);

			// 更新分页信息
			var pager = this.getChild('pager');
			if (pager) {
				pager.setParam({
					'page' : data.page,
					'pages': data.pages,
					'path' : this.$router && this.$router.name
				});
			}

			this.setTimeout('hideLoading', app.config('delay') || 500);
		},

		/**
		 * 创建文章列表
		 * @param  {Array}  items  [列表数据]
		 */
		setList: function(items) {
			var archives = [];
			// 路由名称
			var routerName = this.$router && this.$router.name;

			// 数据结构转化
			util.each(items, function(item) {
				archives.push({
					'id'      : item.id,
					'href'    : '#' + routerName + '/' + item.id,
					'title'   : item.title,
					'content' : item.content,
					'cover'   : item.cover ? '<img class="lazy-image" data-src="'+ item.cover +'"/>' : '',
					'date'    : util.prettyDate(item.date),
					'comments': item.comments
				});
			});

			this.vm.set('archives', archives);

			this.showThumb();
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
		}
	});
	exports.base = Achives;
});