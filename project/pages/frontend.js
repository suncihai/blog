/**
 * [文章页面]
 */
define(function( require, exports ){
	var app = require('app');
	var c = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var layout = require('layout').base;
	var banner = require('@modules/banner').base;
	var loading = require('@modules/loading').base;
	var prism = require('@plugins/prism/prism').base;
	var comment = require('@modules/comment').base;

	var Article = {
		// 初始化
		init: function( data ) {
			this.$ = {};
			this.$reach = false;
			this.$data = data;
			layout.hideFooter();
			this.load();
		},

		// 隐藏loading
		hideLoading: function() {
			this.$.loading.hide();
			this.$doms.content.show();
		},

		// 拉取数据
		load: function( id ) {
			var dc = c.dataCenter;
			var param = {
				'artid': id || this.$data.param
			}
			// 数据加载之前显示loading
			this.$.loading = loading.init({
				'target': this.$data.dom,
				'width':  this.$data.dom.width(),
				'size': 25,
				'class': 'center mt2'
			});

			app.data.get( dc.showarticle, param, this.onData, this );
		},

		// 请求回调
		onData: function( err, res ) {
			var dom = this.$data.dom;
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
			var info = this.$info = res.result;
			if ( res.total === 0 ) {
				var noText = '数据库无该文章记录：' + this.$data.param;
				dom.html('<div class="noData animated bounce">'+ noText +'</div>');
				layout.setTitle( noText );
				banner.setData({
					'type': 'article',
					'title': '******************',
					'time': '时间：0000-00-00 | ',
					// 'tag': '标签：* | ',
					'comments': '评论数：0'
				})
				// .setCrumbs( c.archiveTitle[this.$data.name], this.$data.param );
				return;
			}
			this.build( info );
		},

		// 创建
		build: function( info ) {
			var self = this;
			var dom = self.$data.dom;
			var cont = $([
				'<div class="content">',
					'<article class="article">'+ info.content +'</article>',
				'</div>'
			].join('')).appendTo( dom ).hide();

			self.$doms = {
				'content' : cont,
				'article' : $('.article', cont),
				'comment' : $('<div class="comments"/>').appendTo( dom )
			}

			// 代码高亮渲染
			self.renderHighLighter();

			// 标题
			layout.setTitle( self.$data.name, info.title );

			// 创建评论模块
			this.$.comment = comment.init({
				'target': self.$doms.comment,
				'artid': this.$data.param
			}).hideAll();

			// 设置banner内容
			banner.setData({
				'type': 'article',
				'title': info.title,
				'time': '时间：'+ info.date.toString().slice( 0, 10 ) + ' | ',
				// 'tag': '标签：' + (info.tag || '无')  + ' | ',
				'comments': '评论数：'+ info.comments
			})
			// .setCrumbs( c.archiveTitle[self.$data.name], self.$data.param );

			// 监听评论列表数据加载完成消息
			app.messager.on('commentDataLoaded', this.onCommentDataLoaded, this);

			// 数据加载完成的后续处理
			setTimeout(function() {
				self.hideLoading();
				layout.showFooter();
				self.$.comment.showAll();
				// 判断页面是否出现滚动条
				var doc = document;
				var docHeight = $(doc).height();
				var cHeight = util.getClientHeight();
				if ( docHeight <= cHeight ) {
					this.$reach = true;
					this.$.comment.showLoading().load();
				}
				else {
					// 绑定鼠标滚动事件
					app.event.bind( $(doc), 'scroll.loadComment', self.eventScrolling, self );
				}
			}, c.delay);
		},

		// 监测滚动距离, 加载评论列表
		eventScrolling: function( evt, doc ) {
			var sTop = $(doc).scrollTop();
			var oTop = this.$doms.comment.offset().top;
			var cHeight = util.getClientHeight();
			var dTop = Math.floor( ( oTop - sTop ) * 1.15 );
			// 滚动条到达评论区域
			if ( dTop < cHeight && !this.$reach && this.$.comment ) {
				this.$reach = true;
				this.$.comment.showLoading().load();
			}
		},

		// 评论数据拉取完毕解除scroll事件
		onCommentDataLoaded: function() {
			app.event.unbind($(document), 'scroll.loadComment');
			return false;
		},

		// 代码高亮渲染
		renderHighLighter: function() {
			var self = this;
			var preDOM = self.$doms.article.find('pre');
			var num = preDOM.size(), i = 0;
			var pre, cls, b, e, type, tmp;
			for ( ; i < num; i++ ) {
				pre = preDOM.eq(i);
				cls = pre.attr('class');
				b = cls.indexOf(':') + 1;
				e = cls.indexOf(';');
				type = cls.slice( b, e ).trim();
				tmp = pre.html();
				pre.empty().html('<code class="language-'+ type +'">' + tmp + '</code>');
			}
			prism.highlightAll();
		}
	}
	exports.base = Article;
});