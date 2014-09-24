define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var layout = require('layout');
	var footer = require('@pages/footer');
	var C = require('@core/config');

	var DC = C.dataCenter;

	exports.onMain = function( data ) {
		var DOM = data.dom;
		var requestUrl = DC.path + DC.showarticle + DC.file;
		var requestParam = util.mergeParam( C.articleOption, {
			'artid': data.param
		});

		setTimeout(function(){
			// 拉取数据
			$.ajax({
				'url': requestUrl,
				'method': 'get',
				'dataType': 'json',
				'data': requestParam,
				'success': fnSuccess,
				'error': fnError
			});
		}, 0);

		/**
		 * [fnSuccess 请求成功]
		 * @param  {[JSON]} res [返回数据]
		 * @return {[NULL]}     [无返回值]
		 */
		function fnSuccess( res ) {
			if( !res.success ) {
				DOM.html('拉取数据似乎出了点问题~');
				return;
			}
			var html = [
				'<div class="content">',
					'<h1>'+ res.result.title +'</h1>',
					'<div class="info">',
						'<span class="time">'+ res.result.publishDate +'</span>',
					'</div>',
					'<article>'+ res.result.content +'</article>',
				'</div>'
			].join('');

			$(html).appendTo( DOM );

			layout.setTitle( data.name, res.result.title );
			// 加载syntaxhighlighter插件
			// footer.loadHighLighter();
		}

		/**
		 * [fnError 请求失败]
		 * @param  {[JSON]} msg [错误信息]
		 * @return {[NULL]}     [无返回值]
		 */
		function fnError( msg ) {
			util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
		}
	}
});