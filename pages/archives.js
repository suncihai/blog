define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var layout = require('layout');
	var C = require('@core/config');

	exports.onMain = function( data ) {
		var DOM = data.dom;
		// 数据拉取地址
		var pullRequest = C.backPath + '/listarchives/fade.json';
		// 请求参数
		var param = {
			catid: 1,
			limit: C.requestOption.pageSize,
			brief: C.requestOption.briefSize,
			order: C.requestOption.orderBy[0]
		};

		// 拉取数据
		$.ajax({
			url: pullRequest,
			dataType: 'json',
			data: param,
			success: fnSuccess,
			error: fnError
		});

		/**
		 * [fnSuccess 请求成功]
		 * @param  {[JSON]} res [返回数据]
		 * @return {[NULL]}     [无返回值]
		 */
		function fnSuccess( res ) {
			if( res.success ) {
				DOM.html('拉取错误')
			}
		}

		/**
		 * [fnError 请求失败]
		 * @param  {[JSON]} msg [错误信息]
		 * @return {[NULL]}     [无返回值]
		 */
		function fnError( msg ) {
			util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
		}

		

		// 设置网站标题
		$(document).attr( 'title', C.archiveTitle[data.name] );
	}
});