/**
 * [消息交互模块]
 */
define(function( require, exports ){
	// 消息模型
	function Messager() {
		// 所有的消息事件
		this.events = {};
	}

	// 消息方法
	Messager.prototype = {
		constructor: Messager,
		/**
		 * send 发送消息
		 * @param  {String} method  [消息名]
		 * @param  {Mix} param [消息参数]
		 * @param  {Func} callback [发完后的回调]
		 */
		send: function( method, param, callback ) {
			addEventListener( method, callback );
			var _event = new CustomEvent( method, {
				'detail': param
			});
			this.events[method] = _event;
		},

		/**
		 * on 接收消息
		 * @param  {String} method  [消息名]
		 * @param  {Func} callback [发完后的回调]
		 * @param  {Object} scope [作用域]
		 */
		on: function( method, callback, scope ) {
			var _event = this.events[method];
			if( _event ) {
				dispatchEvent( _event );
			}
		}
	}
	exports.base = new Messager();
});