define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var dataHelper = require('@core/dataHelper').base;
	var layout = require('layout').base;
	var banner = require('@modules/banner').base;
	var C = require('@core/config');

	var Article = {
		// 初始化
		init: function( data ) {
			this.$data = data;
			this.load();
		},

		// 拉取数据
		load: function( param ) {
			var param = param || this.getParam();
			var dc = C.dataCenter;
			dataHelper.get( dc.showarticle, param, this.onData, this );
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
				util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
				return false;
			}
			var dom = this.$data.dom;
			if( !res.success ) {
				dom.html('拉取数据似乎出了点问题~');
				return;
			}
			var info = res.result;
			if( util.isEmpty( info ) ) {
				dom.html('无数据');
				return;
			}
			this.build( info );
		},

		// 创建
		build: function( info ) {
			var dom = this.$data.dom;
			var html = $([
				'<div class="content">',
					'<article class="article">'+ info.content +'</article>',
				'</div>'
			].join(''));
			html.appendTo( dom );

			// 标题
			layout.setTitle( this.$data.name, info.title );

			// 设置banner内容
			banner.setData({
				'type': 'article',
				'title': info.title,
				'time': '时间：'+ info.publishDate.toString().slice( 0, 10 ) + ' | ',
				'tag': '标签：' + (info.tag || '无')  + ' | ',
				'comments': '评论数：'+ info.comments
			});
		}
	}
	exports.base = Article;
});