define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var layout = require('layout');
	var C = require('@core/config');

	exports.onMain = function( data ) {
		var DOM = data.dom;
		// 数据拉取地址
		var requestUrl = C.backPath + '/listarchives/fade.json';
		// 请求参数
		var requestParam = $.extend(C.archiveOption, {
			catid: 2
		});

		// 拉取数据
		$.ajax({
			url: requestUrl,
			dataType: 'json',
			data: requestParam,
			success: fnSuccess,
			error: fnError
		});

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
			var sections = [];
			$.each( res.result.items, function( idx, item ) {
				sections.push([
					'<section list-id="'+ idx +'">',
						'<h2><a href="#'+ data.name +'/'+ item.artid +'" title="'+ item.title +'">'+ item.title +'</a></h2>',
						'<div class="info">',
							'<span class="time">'+ item.publishDate +'</span>',
							'<article>'+ item.abstract +'</article>',
							'<a href="#'+ data.name +'/'+ item.artid +'" class="readAll">阅读全文</a>',
						'</div>',
					'</section>'
				].join(''));
			});

			DOM.append( sections.join('') );
		}

		/**
		 * [fnError 请求失败]
		 * @param  {[JSON]} msg [错误信息]
		 * @return {[NULL]}     [无返回值]
		 */
		function fnError( msg ) {
			util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
		}		

		/**
		 * 设置网站标题
		 */
		$(document).attr( 'title', C.archiveTitle[data.name] );
	}
});