define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var layout = require('layout');
	var footer = require('@modules/footer');
	var C = require('@core/config');

	var dc = C.dataCenter;

	exports.onMain = function( data ) {
		var DOM = data.dom;
		var requestParam = util.mergeParam( C.articleOption, {
			'artid': data.param
		});

		// 拉取数据
		$.ajax({
			'url': dc.showarticle,
			'method': 'get',
			'dataType': 'json',
			'data': requestParam,
			'success': fnSuccess,
			'error': fnError
		});

		/**
		 * fnSuccess 请求成功
		 * @param  {JSON} res [返回数据]
		 * @return {NULL}     [无返回值]
		 */
		function fnSuccess( res ) {
			if( !res.success ) {
				DOM.html('拉取数据似乎出了点问题~');
				return;
			}
			var article = res.result;
			var html = [
				'<div class="content">',
					'<h1>'+ article.title +'</h1>',
					'<div class="info">',
						'<span class="time">时间：'+ article.publishDate.toString().slice( 0, 10 ) +'</span> | ',
						'<span class="tag">标签：性能</sapn> | ',
						'<span class="comments">评论数：'+ article.comments +'</sapn>',
					'</div>',
					'<article>'+ article.content +'</article>',
				'</div>'
			].join('');

			$(html).appendTo( DOM );

			layout.setTitle( data.name, res.result.title );
		}

		/**
		 * fnError 请求失败
		 * @param  {JSON} msg [错误信息]
		 * @return {NULL}     [无返回值]
		 */
		function fnError( msg ) {
			util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
		}
	}
});