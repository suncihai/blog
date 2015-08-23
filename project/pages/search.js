/**
 * [搜索结果页面]
 */
define(function(require, exports, module) {
	var app = require('app');
	var c = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var banner = require('@modules/banner');
	var layout = require('layout');
	var loading = require('@modules/loading').base;

	var SearchResult = {
		init: function(data) {
			this.$data = data;
			this.$dom = data.dom;
			this.$word = data.search && data.search.word;
			this.$renderWord = this.$word || '';
			layout.hideFooter().updateNav();
			this.build();
		},

		build: function() {

			// 设置标题
			layout.setTitle(T('{1}_搜索结果', (this.$word || "")));

			var bannerTxt = T('正在搜索有关「{1}」的文章记录', this.$renderWord) + ' ……';
			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt fts30">'+ bannerTxt +'</h1>'
			})
			// .setCrumbs(this.$title, '');

			this.$doms = {
				listBox: $('<div class="P-search-list"/>').appendTo(this.$dom).hide()
			}

			// 数据加载之前显示loading
			this.loading = loading.init({
			'target': this.$dom,
			'width':  this.$dom.width(),
				'size': 25,
				'class': 'center mt2',
				'autoHide': true
			});

			// 加载数据
			this.load();
		},

		hide: function() {
			this.$doms.listBox.hide();
		},

		show: function() {
			this.$doms.listBox.show();
		},

		showLoading: function() {
			this.loading.show();
			this.hide();
		},

		hideLoading: function() {
			this.loading.hide();
			this.show();
		},

		// 拉取数据
		load: function() {
			var api = c.api;
			layout.hideFooter();
			this.showLoading();
			app.data.get(api.search, {'word': this.$word}, this.onData, this);
		},

		// 拉取数据回调
		onData: function(err, res) {
			var self = this;
			var dom = self.$data.dom;
			var errCls = 'noData animated bounce';
			var dataError = T('拉取数据似乎出了点问题~');
			if (err) {
				util.error(T('拉取数据失败！状态: {1}, 错误信息: {2}', err.status, err.message));
				if (err.status === 'timeout') {
					dom.html('<div class="'+ errCls +'">'+ T('请求超时，请按F5刷新重试~') +'</div>');
				}
				return false;
			}
			if (!res.success) {
				if (res.message) {
					dataError = res.message;
				}
				dom.html('<div class="'+ errCls +'">'+ dataError +'</div>');
				return;
			}
			var info = self.$info = res.result;
			if (util.isEmpty(info)) {
				dom.html('<div class="'+ errCls +'">'+ T('无数据') +'</div>');
				return;
			}
			// 创建列表
			self.buildArchives(info);

			var bannerTxt = T("搜到与「{1}」相关的结果共{2}条：", this.$renderWord, (info.total || 0));

			// 隐藏loading
			setTimeout(function() {
				self.hideLoading();
				layout.showFooter();
				banner.setData({
					'type': 'archive',
					'content': '<h1 class="bannerTxt fts30 animated shake">'+ bannerTxt +'</h1>'
				});
			}, c.delay);
		},

		// 创建
		buildArchives: function(info) {
			// 先清空之前的列表
			this.$doms.listBox.empty();

			if (util.isEmpty(info.items)) {
				this.$doms.listBox.html('<div class="fts20 pt2 pb2 animated fadeIn">(╯_╰)'+ T('抱歉没有搜到相关内容！') +'</div>');
			}
			else {
				util.each(info.items, this.buildItems, this);
			}
		},

		// 循环生成列表
		buildItems: function(item, idx) {
			var sections = [];
			// var str = item.date.slice(0, 10);
			// var arr = str.split('-');
			// var year = arr[0];
			// var mouth = +arr[1];
			// var day = +arr[2];
			var date = util.prettyDate(item.date);
			var catName = util.getKey(item.catId, c.category);
			var anchor = catName + '/' + item.id; // 超链接地址
			var brief = item.brief === '' ? '<a class="tdef tdl" href="#'+ anchor +'">'+ T('请进入内页查看') +'</a>' : item.brief + ' ……';
			sections.push([
				'<section class="section">',
					'<a href="#'+ anchor +'" title="'+ item.tips +'" class="title">'+ item.title +'</a>',
					'<p class="brief">'+ brief + '</p>',
					'<div class="info">',
						'<span class="tag">' + T('分类：') + c.archiveTitle[catName] || T('未知分类') + '</span>',
						' / ',
						'<span class="tag">' + T('评论数：') + item.comments +'</span>',
						' / ',
						'<span class="tag">' + T('发布时间：') + date +'</span>',
					'</div>',
				'</section>'
			].join(''));
			this.$doms.listBox.append(sections.join(''));
		}
	}
	module.exports = SearchResult;
});