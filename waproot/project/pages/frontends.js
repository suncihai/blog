/**
 * [前端那些事-栏目页面]
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
			this.$ = {};
			this.$data = data;
			this.$title = c.archiveTitle[data.name];
			this.$param = $.extend({}, c.archiveParam, {
				'page': data.search && +data.search.page || 1
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
				listBox: $('<div class="P-archiveList"/>').appendTo(dom).hide(),
				loadBox: $('<div class="P-archiveLoad"/>').appendTo(dom).hide()
			}

			// 数据加载之前显示loading
			this.$.loading = loading.init({
				'target': dom,
				'width':  dom.width(),
				'size': 25,
				'class': 'center mt2',
				'autoHide': true
			});

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

		// 拉取数据
		load: function(param) {
			var api = c.api;
			param = param || this.getParam();
			layout.hideFooter();
			this.showLoading();
			app.data.get(api.listarchives, param, this.onData, this);
		},

		// 获取/更新请求参数<>
		getParam: function() {
			var data = this.$data;
			var param = $.extend({}, this.$param, {
				'catid': c.category[data.name]
			});
			return param;
		},

		// 拉取数据回调
		onData: function(err, res) {
			var self = this;
			var dom = self.$data.dom;
			var dataError = T('拉取数据似乎出了点问题~');
			if (err) {
				util.error(T('拉取数据失败！状态: {1}, 错误信息: {2}', err.status, err.message));
				if (err.status === 'timeout') {
					dom.html('<div class="noData animated bounce">'+ T('请求超时，请按F5刷新重试~') +'</div>');
				}
				return false;
			}
			if (!res.success) {
				if (res.message) {
					dataError = res.message;
				}
				dom.html('<div class="noData animated bounce">'+ dataError +'</div>');
				return;
			}
			var info = self.$info = res.result;
			if (util.isEmpty(info && info.items)) {
				dom.html('<div class="noData animated bounce">'+ T('该页无数据') +':-)</div>');
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
			// 先清空之前的列表
			this.$doms.listBox.empty();

			// 循环创建列表
			util.each(info.items, this.buildItems, this);

			// 创建完显示缩略图
			this.showThumb();

			// 设置标题
			layout.setTitle(T('{1} - 第{2}页', this.$title, info.page));
		},

		// * buildItems 循环生成列表. idx->序号, item->选项对象
		buildItems: function(item, idx) {
			var data = this.$data;
			var sections = [];
			var date = util.prettyDate(item.date);
			// 超链接地址
			var anchor = data.name + '/' + item.id; 
			var cover = item.cover ? '<img class="cover" data-src="'+ item.cover +'"/>' : "";
			sections.push([
				'<section class="sectionItem" list-id="'+ idx +'">',
					'<div class="P-archiveListTitle">',
						'<h2><a href="#'+ anchor +'" title="'+ item.title +'" class="title">'+ item.title +'</a></h2>',
					'</div>',
					// '<a href="#'+ anchor +'" class="abstract">',
						'<article>',
							'<p class="abstract">' + item.content +' ……</p>',
							cover,
						'</article>',
					// '</a>',
					'<div class="P-archiveListInfo">',
						'<span class="tag"><i class="fa fa-calendar mr3"></i>'+ date +'</span>',
						'<span class="tag mr2 ml2"><i class="fa fa-comments mr3"></i>'+ item.comments +'</span>',
					'</div>',
				'</section>'
			].join(''));
			this.$doms.listBox.append(sections.join(''));
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