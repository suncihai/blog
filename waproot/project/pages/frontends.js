/**
 * [栏目页面]
 */
define(function(require, exports, module) {
	var app = require('app');
	var c = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var layout = require('layout');
	var loading = require('@modules/loading').base;

	var Archives = {
		init: function(data) {
			// 子模块对象
			this.$ = {};
			// 数据加载状态
			this.$dataReady = false;
			// 请求的页码
			this.$page = (data.search && +data.search.page);
			// 页面参数缓存
			this.$data = data;
			// 页面标题
			this.$title = c.archiveTitle[data.name];
			this.$param = $.extend({}, c.archiveParam, {
				'page': this.$page || 1
			});
			layout.hideFooter();
			this.build();
		},

		build: function() {
			var data = this.$data;
			var dom = data.dom;

			// 设置标题
			layout.setTitle(this.$title);

			this.$doms = {
				'listBox': $('<div class="P-archiveList"/>').appendTo(dom).hide(),
				'loadBox': $([
					'<div class="P-archiveLoad load-more">',
						T('加载更多'),
					'</div>'
				].join('')).appendTo(dom).hide()
			}

			// 数据加载之前显示loading
			this.$.loading = loading.init({
				'target': dom,
				'width':  dom.width(),
				'size': 25,
				'class': 'center mt2',
				'autoHide': true
			});

			// 触摸加载更多
			app.event.bind(this.$doms.loadBox, 'touchend', this.eventTouchLoad, this);

			// 加载数据
			this.load();
		},

		hide: function() {
			this.$doms.listBox.hide();
			this.$doms.loadBox.hide();
		},

		show: function() {
			this.$doms.listBox.show();
			this.$doms.loadBox.show();
		},

		showLoading: function() {
			this.$.loading.show();
			this.hide();
		},

		hideLoading: function() {
			this.$.loading.hide();
			this.show();
		},

		// 触摸加载更多
		eventTouchLoad: function() {
			// 未加载完数据不重复加载
			if (!this.$dataReady) {
				return false;
			}
			var api = c.api;
			var param = $.extend(this.getParam(), {
				'page': this.$page + 1
			});
			this.$doms.loadBox.html('<i class="fa fa-spinner mr3 spinnerRotate"></i>正在加载');
			app.data.get(api.listarchives, param, this.afterLoadMore, this);
		},

		// 加载更多数据回调
		afterLoadMore: function(err, data) {
			if (err) {
				this.$doms.loadBox.html(err.status + '加载失败！请重试');
				return false;
			}
			var self = this;
			var result = data.result;
			// 延迟展现
			setTimeout(function() {
				self.$page = result.page;
				if (result && result.items) {
					self.$dataReady = true;
					// 返回不为空数组
					if (result.items.length) {
						var moreList = self.buildItems(result.items);
						$(moreList.join('')).appendTo(self.$doms.listBox);
						self.$doms.loadBox.html('加载更多');
					}
					else {
						self.$doms.loadBox.html('没有了');
					}
				}
				else {
					self.$doms.loadBox.html('加载失败！请重试');
				}
			}, c.delay);
		},

		// 拉取数据
		load: function(param) {
			var api = c.api;
			this.$dataReady = false;
			// 请求参数
			param = param || this.getParam();
			layout.hideFooter();
			this.showLoading();
			app.data.get(api.listarchives, param, this.afterLoad, this);
		},

		// 获取/更新请求参数<>
		getParam: function() {
			var data = this.$data;
			var param = $.extend({}, this.$param, {
				'catid': c.category[data.name]
			});
			return param;
		},

		// 页面初始化拉取数据回调
		afterLoad: function(err, res) {
			var self = this;
			var dom = self.$data.dom;
			var dataError = T('拉取数据似乎出了点问题~');
			this.$dataReady = true;
			if (err) {
				util.error(T('拉取数据失败！状态: {1}, 错误信息: {2}', err.status, err.message));
				if (err.status === 'timeout') {
					dom.html('<div class="noData">'+ T('请求超时，请按F5刷新重试~') +'</div>');
				}
				return false;
			}
			if (!res.success) {
				if (res.message) {
					dataError = res.message;
				}
				dom.html('<div class="noData">'+ dataError +'</div>');
				return;
			}
			var info = res.result;
			if (util.isEmpty(info && info.items)) {
				dom.html('<div class="noData">'+ T('该页无数据') +':-)</div>');
				return false;
			}

			// 创建列表
			self.buildArchives(info);

			// 隐藏loading
			setTimeout(function() {
				self.hideLoading();
				layout.showFooter();
			}, c.delay);
		},

		// 创建
		buildArchives: function(info) {
			// 循环创建列表
			var list = this.buildItems(info.items);
			$(list.join('')).appendTo(this.$doms.listBox);

			// 创建完显示缩略图
			this.showThumb();
		},

		// 创建文章列表
		buildItems: function(items) {
			var self = this;
			// 存放列表html结构
			var sections = [];

			// 循环创建列表结构
			util.each(items, function(item, idx) {
				var data = self.$data;
				var date = util.prettyDate(item.date);
				// 超链接地址
				var anchor = data.name + '/' + item.id; 
				// 缩略图
				var cover = item.cover ? '<img class="cover" data-src="'+ item.cover +'"/>' : "";
				// 一条列表记录
				var section = [
					'<section class="sectionItem" list-id="'+ idx +'">',
						'<div class="P-archiveListTitle">',
							'<h2><a href="#'+ anchor +'" title="'+ item.title +'" class="title">'+ item.title +'</a></h2>',
						'</div>',
						'<article>',
							'<p class="abstract">' + item.content +' ……</p>',
							cover,
						'</article>',
						'<div class="P-archiveListInfo">',
							'<span class="tag"><i class="fa fa-calendar mr3"></i>'+ date +'</span>',
							'<span class="tag mr2 ml2"><i class="fa fa-comments mr3"></i>'+ item.comments +'</span>',
						'</div>',
					'</section>'
				].join('');

				// 记录集合
				sections.push(section);
			});
			
			return sections;
		},

		// 显示缩略图
		showThumb: function() {
			var listBox = this.$doms.listBox;
			var oImgs = null;
			$(document).ready(function() {
				oImgs = listBox.find('img.cover');
				$.each(oImgs, function(i, item) {
					$(item).attr('src', $(item).attr('data-src'));
				});
			});
		}
	}
	module.exports = Archives;
});