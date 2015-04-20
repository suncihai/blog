/**
 * [搜索结果页面]
 */
define(function( require, exports ){
	var app = require('app');
	var C = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var banner = require('@modules/banner').base;
	var layout = require('@modules/layout').base;
	var loading = require('@modules/loading').base;

	var SearchResult = {
		init: function( data ) {
			this.$data = data;
			this.$dom = data.dom;
			this.$word = data.search && data.search.word;
			this.$renderWord = this.$word || '';
			this.build();
		},

		build: function() {

			// 设置标题
			layout.setTitle( (this.$word || '') + '_搜索结果' );

			var bannerTxt = '正在搜索有关“' + this.$renderWord +'”的文章记录 ……';
			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt fts30">'+ bannerTxt +'</h1>'
			})
			// .setCrumbs( this.$title, '' );

			this.$doms = {
				listBox: $('<div class="P-search-list"/>').appendTo( this.$dom ).hide()
			}

			// 数据加载之前显示loading
			this.loading = loading.init({
			'target': this.$dom,
			'width':  this.$dom.width(),
				'size': 25,
				'class': 'center mt20',
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
			var dc = C.dataCenter;
			layout.hideFooter();
			this.showLoading();
			app.data.get( dc.search, {'word': this.$word}, this.onData, this );
		},

		// 拉取数据回调
		onData: function( err, res ) {
			var self = this;
			var dom = self.$data.dom;
			var dataError = '拉取数据似乎出了点问题~';
			if( err ) {
				util.error('数据拉取失败！错误码:' + err.status + ', 错误信息:' + err.statusText);
				if( err.timeout ) {
					dom.html('<div class="noData animated bounce">请求超时，请按F5刷新重试~</div>');
				}
				return false;
			}
			if( !res.success ) {
				if( res.message ) {
					dataError = res.message;
				}
				dom.html('<div class="noData animated bounce">'+ dataError +'</div>');
				return;
			}
			var info = self.$info = res.result;
			if( util.isEmpty( info ) ) {
				dom.html('<div class="noData animated bounce">无数据</div>');
				return;
			}
			// 创建列表
			self.buildArchives( info );

			var bannerTxt = "搜到与“"+ this.$renderWord +"”相关的结果共" + (info.total || 0) + "条：";

			// 隐藏loading
			setTimeout(function() {
				self.hideLoading();
				layout.showFooter();
				banner.setData({
					'type': 'archive',
					'content': '<h1 class="bannerTxt fts30 animated shake">'+ bannerTxt +'</h1>'
				});
			}, C.delay);
		},

		// 创建
		buildArchives: function( info ) {
			// 先清空之前的列表
			this.$doms.listBox.empty();

			if( util.isEmpty( info.items ) ) {
				this.$doms.listBox.html('<div class="pt20 pb20">抱歉没有搜到相关内容！</div>');
			}
			else {
				util.each( info.items, this.buildItems, this );
			}
		},

		// 循环生成列表
		buildItems: function( item, idx ) {
			var sections = [];
			var str = item.publishDate.slice( 0, 10 );
			var arr = str.split('-');
			var year = arr[0];
			var mouth = +arr[1];
			var day = +arr[2];
			var date = year + '年' + mouth + '月' + day + '日';
			var catName = util.getKeyName( item.catId, C.cat );
			var anchor = catName + '/' + item.id; // 超链接地址
			var brief = item.brief === "" ? "(请进入内页查看)" : item.brief + " ……";
			sections.push([
				'<section class="section">',
					'<a href="#'+ anchor +'" title="'+ item.tips +'" class="title">'+ item.title +'</a>',
					'<p class="brief">'+ brief + '</p>',
					'<div class="info">',
						'<span class="tag">分类：'+ C.archiveTitle[catName] || '未知分类' +'</span>',
						' | ',
						'<span class="tag">评论：'+ item.comments +'</span>',
						' | ',
						'<span class="tag">日期：'+ date +'</span>',
					'</div>',
				'</section>'
			].join(''));
			this.$doms.listBox.append( sections.join('') );
		}
	}
	exports.base = SearchResult;
});