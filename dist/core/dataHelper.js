/**
 * [Ajax数据处理模块]
 */
define(function( require, exports ){
	var jquery = require('jquery');
	var util = require('util');
	var win = window;

	var DataHelper = {

		/**
		 * _send 发送Ajax请求, 回调形式：err, data
		 * @param  {String}    type      [请求类型get,post]
		 * @param  {String}    url       [请求地址]
		 * @param  {JSON}      data      [请求数据]
		 * @param  {Function}  callback  [成功或者错误的回调函数]
		 * @param  {Object}    context   [作用域]
		 * @return {NULL}                [无返回值]
		 */
		_send: function( type, url, data, callback, context ) {
			// 参数检测
			if ( !util.isString( url ) ) {
				util.error('错误的请求URL');
				return false;
			}

			if ( !util.isFunc( callback ) ) {
				util.error('错误的回调函数');
				return false;
			}

			if ( type === 'POST' && data ) {
				data = JSON.stringify( data );
			}

			// 请求成功
			function _fnSuccess( res ) {
				if ( !context ) {
					context = win;
				}
				callback.call( context, false, res );
			}

			// 请求失败, 错误信息回调对象: {status: 状态, message: 信息}
			// status可能值为：timeout, error, notmodified 和 parsererror
			function _fnError( xhr, status, error ) {
				var msg;
				if ( !context ) {
					context = win;
				}
				switch( status ) {
					// 超时需要返回错误信息
					case 'timeout':
						xhr.abort();
						msg = {
							'status': status,
							'message': '请求超时'
						}
						callback.call( context, msg, null );
					break;
					// 服务器返回不严格的JSON数据
					case 'parsererror':
						msg = {
							'status': status,
							'message': 'JSON解析失败'
						}
						callback.call( context, msg, null );
					break;
					// 其他直接log错误信息
					default: util.error('请求失败', 'status: ' + status + ', error: ' + error );
				}
			}

			// 拉取数据
			jquery.ajax({
				'url': url,
				'type': type,
				'dataType': 'json',
				'contentType': 'application/json; charset=UTF-8',
				'data': data,
				'timeout': 8888,
				'success': _fnSuccess,
				'error': _fnError
			});
		},

		// get方式
		get: function( url, param, callback, context ) {
			// 解析参数
			var uri = util.parse( param );
			this._send( 'GET', url + uri, null, callback, context );
		},

		// post方式
		post: function( url, data, callback, context ) {
			this._send( 'POST', url, data, callback, context );
		}
	}
	exports.base = DataHelper;
});