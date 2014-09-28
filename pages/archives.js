define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var layout = require('layout');
	var C = require('@core/config');
	var footer = require('@pages/footer');

	var dc = C.dataCenter;

	exports.onMain = function( data ) {
		var DOM = data.dom;
		var requestParam = util.mergeParam( C.archiveOption, {
			'catid': 2,
			'limit': 40
		});

		// 设置标题
		layout.setTitle( C.archiveTitle[data.name] );

		// 拉取数据
		$.ajax({
			'url': dc.listarchives,
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
			var sections = [];
			util.log( res );
			$.each( res.result.items, function( idx, item ) {
				sections.push([
					'<section list-id="'+ idx +'">',
						'<h2><a href="#'+ data.name +'/'+ item.id +'" title="'+ item.title +'">'+ item.title +'</a></h2>',
						'<div class="info">',
							'<span class="time">'+ item.publishDate +'</span>',
						'</div>',
						'<article>'+ item.content +' ……</article>',
					'</section>'
				].join(''));
			});
			DOM.append( sections.join('') );
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