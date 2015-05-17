/**
 * [消息发布/订阅模块]
 */
define(function( require, exports ){
	var util = require('util');
	var jquery = require('jquery');
	var messager = jquery({});
	var WIN = window;

	/**
	 * fire 发送/发布消息<封装trigger函数>
	 * @param  {String} method    [消息名]
	 * @param  {Mix}    data      [消息携带的参数]
	 * @param  {Func}   afterSend [发完后的回调]
	 * @param  {Object} context   [上下文]
	 */
	exports.fire = function( method, data, afterSend, context ) {
		data = data || null;
		context = context || WIN;
		messager.trigger.call( messager, method, data );
		if ( afterSend ) {
			afterSend.call( context );
		}
	}

	/**
	 * on 接收/订阅消息<封装on函数,只回调部分数据>
	 * @param  {String} method    [消息名]
	 * @param  {Func}   callback  [接受消息的回调]
	 * @param  {Object} context   [上下文]
	 */
	exports.on = function( method, callback, context ) {
		// 必须要有回调, 不然接收消息干嘛
		if ( !callback || !util.isFunc( callback ) ) {
			return false;
		}
		// 先取消再发布, 避免重复触发
		this.cancel( method );

		var args = null, evData = null, evt, data;
		context = context || WIN;
		messager.on.call( messager, method, function() {
			args = util.argumentsToArray( arguments );
			evt = args[0]; // event源数据
			data = args[1]; // 事件传递数据
			evData = {
				'param': data,
				'type':evt.type,
				'target': evt.target,
				'timeStamp': evt.timeStamp,
				'nameSpace': evt.namespace
			};
			callback.call( context, evData );
		});
	}

	/**
	 * cancel 取消消息的订阅和发布
	 * @param  {String} method    [消息名]
	 */
	exports.cancel = function( method ) {
		messager.off( method );
	}
});