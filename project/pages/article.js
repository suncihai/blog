define(function( require, exports ){
	var app = require('app');
	var C = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var layout = require('@modules/layout').base;
	var banner = require('@modules/banner').base;
	var loading = require('@modules/loading').base;
	var prism = require('@plugins/prism/prism').base;

	var Article = {
		// 初始化
		init: function( data ) {
			this.$data = data;
			layout.hideFooter();
			this.load();
		},

		// 隐藏loading
		hideLoading: function() {
			this.loading.hide();
			this.$dom.show();
		},

		// 拉取数据
		load: function( param ) {
			var dc = C.dataCenter;
			param = param || this.getParam();
			// 数据加载之前显示loading
			this.loading = loading.init({
				'target': this.$data.dom,
				'width':  this.$data.dom.width(),
				'size': 25,
				'class': 'center'
			});

			app.data.get( dc.showarticle, param, this.onData, this );
		},

		// 获取Ajax请求参数
		getParam: function() {
			var ret = null;
			var data = this.$data;
			ret = util.mergeParam( C.articleOption, {
				'artid': data.param
			});
			return ret;
		},

		// 请求回调
		onData: function( err, res ) {
			if( err ) {
				util.error('数据拉取失败！错误码:' + err.status + ', 错误信息:' + err.statusText);
				return false;
			}
			var dom = this.$data.dom;
			if( !res.success ) {
				dom.html('拉取数据似乎出了点问题~');
				return;
			}
			var info = this.$info = res.result;
			if( res.total === 0 ) {
				var noText = '数据库无该文章记录：' + this.$data.param;
				dom.html('<div class="noRecord animated bounce">'+ noText +'</div>');
				layout.setTitle( noText );
				banner.setData({
					'type': 'article',
					'title': '******************',
					'time': '时间：0000-00-00 | ',
					'tag': '标签：* | ',
					'comments': '评论数：0'
				}).setCrumbs( C.archiveTitle[this.$data.name], this.$data.param );
				return;
			}
			this.build( info );
		},

		// 创建
		build: function( info ) {
			var dom = this.$data.dom;
			var html = this.$dom = $([
				'<div class="content">',
					'<article class="article">'+ info.content +'</article>',
				'</div>'
			].join(''));
			html.appendTo( dom ).hide();

			// 代码高亮渲染
			this.renderHighLighter();

			// 标题
			layout.setTitle( this.$data.name, info.title );

			// 设置banner内容
			banner.setData({
				'type': 'article',
				'title': info.title,
				'time': '时间：'+ info.publishDate.toString().slice( 0, 10 ) + ' | ',
				'tag': '标签：' + (info.tag || '无')  + ' | ',
				'comments': '评论数：'+ info.comments
			}).setCrumbs( C.archiveTitle[this.$data.name], this.$data.param );

			// 隐藏loading
			this.hideLoading();
			layout.showFooter();
		},

		// 代码高亮渲染
		renderHighLighter: function() {
			var self = this;
			var preDOM = self.$dom.find('pre');
			var num = preDOM.size(), i = 0;
			var pre, cls, b, e, type, tmp;
			for( ; i < num; i++ ) {
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