/**
 * [消息交互模块]
 */
define(function( require, exports ){
	var util = require('util');

	// 消息模型
	var Messager = {

		// 消息映射
		msgMap: {},

		/**
		 * fire 发送消息
		 * @param  {String} method    [消息名]
		 * @param  {Mix}    data      [消息携带的参数]
		 * @param  {Func}   afterSend [发完后的回调]
		 * @param  {Object} scope     [上下文]
		 */
		fire: function( method, data, afterSend, scope ) {
			var self = this;
			// 没有传data的情况
			if( util.isFunc( data ) ) {
				afterSend = data;
				scope = afterSend;
				data = null;
			}

			// 注册消息
			setTimeout(function() {
				self.msgMap[method] = {
					'param': data || null
				}

				// 触发消息
				self._trigger( method );

				// 有回调, 执行回调
				if( afterSend ) {
					afterSend.call( scope );
				}

			}, 0);
		},

		/**
		 * _trigger 触发消息
		 * @param  {String} method  [消息名]
		 */
		_trigger: function( method ) {
			var scope = this.msgMap[method].scope;
			var param = this.msgMap[method].param;
			this.msgMap[method].callback.call( scope, param );
		},

		/**
		 * on 接收消息
		 * @param  {String} method    [消息名]
		 * @param  {Func}   callback  [发完后的回调]
		 * @param  {Object} scope     [上下文]
		 */
		on: function( method, callback, scope ) {
			if( !this.msgMap[method] ) {
				this.msgMap[method] = {};
			}
			this.msgMap[method].callback = callback;
			this.msgMap[method].scope = scope;
		},

		/**
		 * cancel 取消消息注册
		 * @param  {String} method  [消息名]
		 */
		cancel: function( method ) {
			delete this.msgMap[method];
		}
	}
	exports.base = Messager;
});