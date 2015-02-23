/**
 * [Ajax数据处理模块]
 */
define(function( require, exports ){
	var jquery = require('jquery');
	var util = require('util');

	var DataHelper = {
		/**
		 * _send 发送Ajax请求
		 * @param  {String} 	type 		[请求类型get,post]
		 * @param  {String} 	url 		[请求地址]
		 * @param  {JSON} 		param 		[请求参数]
		 * @param  {Function} 	callback 	[成功或者错误的回调函数]
		 * @param  {Object} 	scope 		[作用域]
		 * @return {NULL}     				[无返回值]
		 */
		_send: function( type, url, param, callback, scope ) {
			// 参数检测
			if( !util.isString( url ) ) {
				util.error('错误的请求URL');
				return false;
			}

			if( !util.isObject( param ) ) {
				util.error('错误的请求参数');
				return false;
			}

			if( !util.isFunc( callback ) ) {
				util.error('错误的回调函数');
				return false;
			}

			// 拉取数据
			jquery.ajax({
				'url': url,
				'method': type,
				'dataType': 'json',
				'data': param,
				'success': _fnSuccess,
				'error': _fnError
			});

			// 请求成功, 回调形式：err, data
			function _fnSuccess( res ) {
				if( !scope ) {
					scope = this;
				}
				callback.call( scope, false, res );
			}

			function _fnError( msg ) {
				if( !scope ) {
					scope = this;
				}
				callback.call( scope, msg, null );
			}

		},

		// get方式
		get: function( url, param, callback, scope ) {
			this._send( 'get', url, param, callback, scope );
		},

		// pos方式
		post: function( url, param, callback, scope ) {
			this._send( 'post', url, param, callback, scope );
		}
	}
	exports.base = DataHelper;
});