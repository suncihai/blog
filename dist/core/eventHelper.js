/**
 * [事件处理模块]
 */
define(function( require, exports ){
	var util = require('util');

	/**
	 * bind 绑定事件
	 * @param  {Object}   	elm 		[jquery对象]
	 * @param  {String} 	type 		[事件类型]
	 * @param  {Mix} 		data 		[callback中接受的数据]
	 * @param  {Function} 	calllback 	[事件函数]
	 * @param  {Object} 	scope 		[作用域]
	 */
	exports.bind = function( elm, type, data, calllback, scope ) {
		// 参数检测
		if( !elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}
		// 不传data
		if( util.isFunc( data ) ) {
			scope = calllback;
			calllback = data;
			data = null;
		}
		
		elm.bind( type, function() {
			calllback.call( scope, this, data );
		});
	}

	/**
	 * proxy 代理事件
	 * @param  {Object}   	elm 		[jquery对象]
	 * @param  {String} 	type 		[事件类型]
	 * @param  {Mix} 		selector 	[选择器,可为单个元素或者元素数组]
	 * @param  {Mix} 		data 		[callback中接受的数据]
	 * @param  {Function} 	calllback 	[事件函数]
	 * @param  {Object} 	scope 		[作用域]
	 */
	exports.proxy = function( elm, type, selector, data, calllback, scope ) {
		// 参数检测
		if( !elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}

		// 不传data
		if( util.isFunc( data ) ) {
			scope = calllback;
			calllback = data;
			data = null;
		}

		elm.on( type, selector, function() {
			calllback.call( scope, this, data );
		});
	}
});