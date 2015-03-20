/**
 * [消息交互模块]
 */
define(function( require, exports ){
	var util = require('util');

	// 消息模型
	var Messager = {

		// 消息映射
		msgMap: {},

		// 消息数据缓存映射
		cacheMap: {},

		/**
		 * fire 发送消息
		 * @param  {String} method    [消息名]
		 * @param  {Mix}    data      [消息携带的参数]
		 * @param  {Func}   afterSend [发完后的回调]
		 * @param  {Object} scope     [上下文]
		 */
		fire: function( method, data, afterSend, scope ) {
			// 没有传data的情况
			if( util.isFunc( data ) ) {
				afterSend = data;
				scope = afterSend;
				data = null;
			}
			if( this.msgMap[method] ) {
				this._update( method, data, scope );
				return true;
			}
			// 注册消息
			var self = this;
			var guid = util.guid('_msg_');
			setTimeout(function() {
				self.msgMap[method] = guid;
				self.cacheMap[guid] = {
					'param': data || null,
					'scope': scope || window
				}
				// 有回调, 执行回调
				if( afterSend ) {
					afterSend.call( scope );
				}
			}, 0);
		},

		/**
		 * _update 更新消息参数
		 * @param  {String} method  [消息名]
		 * @param  {Mix}    data    [消息携带的参数]
		 * @param  {Object} scope   [上下文]
		 */
		_update: function( method, data, scope ) {
			var methodId = this.msgMap[method];
			this.cacheMap[methodId].param = data;
			if( scope ) {
				this.cacheMap[methodId].scope = scope;
			}
		},

		/**
		 * on 接收消息
		 * @param  {String} method  [消息名]
		 * @param  {Func} callback [发完后的回调]
		 * @param  {Object} scope [作用域]
		 */
		on: function( method, callback, scope ) {
			// 还未注册
			if( !this.msgMap[method] ) {
				return false;
			}
			var methodId = this.msgMap[method];
			var cachce = this.cacheMap[methodId];
			callback.call( cachce.scope, cachce.param );
		},

		/**
		 * cancel 取消消息注册
		 * @param  {String} method  [消息名]
		 */
		cancel: function( method ) {
			var methodId = this.msgMap[method];
			var cachce = this.cacheMap[methodId];
			delete this.msgMap[method];
			delete this.cacheMap[methodId];
		}
	}
	exports.base = Messager;
});