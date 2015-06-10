/**
 * [前端那些事-栏目页面]
 */
define(function( require, exports ){
	var app = require('app');
	var c = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var pager = require('@modules/pager').pagerHasLink;
	var banner = require('@modules/banner').base;
	var layout = require('layout').base;
	var loading = require('@modules/loading').base;

	var Archives = {
		init: function( data ) {
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
			var quotations = c.quotations;
			var num = quotations.length - 1;

			// 设置标题
			layout.setTitle( this.$title );

			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt animated fadeIn">'+ quotations[util.random(0, num)] +'</h1>'
			})
			// .setCrumbs( this.$title, '' );

			this.$doms = {
				listBox: $('<div class="P-archive-list"/>').appendTo( dom ).hide(),
				pagerBox: $('<div class="P-archive-pager"/>').appendTo( dom ).hide()
			}

			// 创建分页模块
			pager.init({
				'name': 'achivePager',
				'target': this.$doms.pagerBox,
				'showInfo': true,
				'max': 7
			});

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
			this.$doms.pagerBox.hide();
		},

		show: function() {
			this.$doms.listBox.show();
			this.$doms.pagerBox.show();
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
		load: function( param ) {
			var dc = c.dataCenter;
			param = param || this.getParam();
			layout.hideFooter();
			this.showLoading();
			app.data.get( dc.listarchives, param, this.onData, this );
		},

		// 获取/更新请求参数<>
		getParam: function() {
			var data = this.$data;
			var param = $.extend({}, this.$param, {
				'catid': c.cat[data.name]
			});
			return param;
		},

		// 拉取数据回调
		onData: function( err, res ) {
			var self = this;
			var dom = self.$data.dom;
			var dataError = '拉取数据似乎出了点问题~';
			if ( err ) {
				util.error('拉取数据失败！状态: ' + err.status + ', 错误信息: ' + err.message);
				if ( err.status === 'timeout' ) {
					dom.html('<div class="noData animated bounce">请求超时，请按F5刷新重试~</div>');
				}
				return false;
			}
			if ( !res.success ) {
				if ( res.message ) {
					dataError = res.message;
				}
				dom.html('<div class="noData animated bounce">'+ dataError +'</div>');
				return;
			}
			var info = self.$info = res.result;
			if ( util.isEmpty( info && info.items ) ) {
				dom.html('<div class="noData animated bounce">该页无数据:-)</div>');
				return false;
			}
			// 创建列表
			self.buildArchives( info );
			// 更新页码
			pager.setParam({
				'link': self.$data.name,
				'page': info.page,
				'pages': info.pages,
				'total': info.total
			});

			// 隐藏loading
			setTimeout(function() {
				self.hideLoading();
				layout.showFooter();
			}, c.delay);

		},

		// 创建
		buildArchives: function( info ) {
			// 先清空之前的列表
			this.$doms.listBox.empty();

			// 循环创建列表
			util.each( info.items, this.buildItems, this );

			// 创建完显示缩略图
			this.showThumb();

			// 设置标题
			layout.setTitle( this.$title + ' - 第' + info.page + '页' );
		},

		// * buildItems 循环生成列表. idx->序号, item->选项对象
		buildItems: function( item, idx ) {
			var data = this.$data;
			var sections = [];
			var str = item.date.slice( 0, 10 );
			var arr = str.split('-');
			var year = arr[0];
			var mouth = +arr[1];
			var day = +arr[2];
			var date = year + '年' + mouth + '月' + day + '日';
			var anchor = data.name + '/' + item.id; // 超链接地址
			var cover = item.cover ? '<img class="cover" data-src="'+ item.cover +'"/>' : "";
			sections.push([
				'<section list-id="'+ idx +'">',
					'<div class="P-archive-list-title">',
						'<h2><a href="#'+ anchor +'" title="'+ item.title +'" class="title">▪ '+ item.title +'</a></h2>',
					'</div>',
					// '<a href="#'+ anchor +'" class="abstract">',
						'<article>',
							'<p class="abstract">' + item.content +' ……</p>',
							cover,
						'</article>',
					// '</a>',
					'<div class="P-archive-list-info">',
						'<span class="tag">分类：'+ this.$title || data.name +'</span>',
						' | ',
						'<span class="tag">评论：'+ item.comments +'</span>',
						' | ',
						'<span class="tag">日期：'+ date +'</span>',
					'</div>',
				'</section>'
			].join(''));
			this.$doms.listBox.append( sections.join('') );
		},

		// 显示缩略图
		showThumb: function() {
			var listBox = this.$doms.listBox;
			var oImgs = null;
			$(document).ready(function() {
				oImgs = listBox.find('img.cover');
				$.each( oImgs, function( i, item ) {
					$(item).attr( 'src', $(item).attr('data-src') );
				});
			});
		}
	}
	exports.base = Archives;
});