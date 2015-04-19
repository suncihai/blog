/**
 * [事件绑定模块,封装jQuery事件绑定]
 * 事件绑定用bind、proxy; 反操作为unbind、unproxy
 * 消息发布用fire, 消息订阅用on; 反操作为cancel
 */
define(function( require, exports ){
	var util = require('util');
	var jquery = require('jquery');
	var messager = jquery({});
	var WIN = window;

	/**
	 * bind 绑定事件
	 * @param  {Object}   $elm     [jquery对象]
	 * @param  {String}   type     [事件类型]
	 * @param  {Mix}      data     [callback中接受的数据]
	 * @param  {Function} calllback[事件函数]
	 * @param  {Object}   scope    [作用域]
	 */
	exports.bind = function( $elm, type, data, calllback, scope ) {
		// 参数检测
		if( !$elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}
		// 不传data
		if( util.isFunc( data ) ) {
			scope = calllback;
			calllback = data;
			data = null;
		}

		$elm.bind( type, function( ev ) {
			if( !scope ) {
				scope = this;
			}
			calllback.call( scope, ev, this, data );
		});
	}

	/**
	 * unbind 取消绑定事件
	 * @param  {Object}  $elm    [jquery对象]
	 * @param  {String}  type    [事件类型]
	 */
	exports.unbind = function( $elm, type ) {
		// 参数检测
		if( !$elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}
		$elm.unbind( type );
	}

	/**
	 * hover 鼠标移入移出事件
	 * @param  {Object}    $elm<必选>       [jquery对象]
	 * @param  {Function}  handleIn<必选>   [鼠标移入事件]
	 * @param  {Function}  handleOut<可选>  [鼠标移出事件]
	 * @param  {Function}  data<可选>       [回调中传递数据]
	 * @param  {Object}    scope<可选>      [作用域]
	 */
	exports.hover = function( $elm, handleIn, handleOut, data, scope ) {
		var argLen = arguments.length;
		// 参数检测
		if( !$elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}
		if( argLen === 4 ) {
			scope = data;
			data = null;
		}
		if( !util.isFunc( handleOut ) ) {
			if( argLen === 4 ) {
				scope = data;
				data = handleOut;
				handleOut = null;
			}
			if( argLen === 3 ) {
				scope = handleOut;
				handleOut = null;
				data = null;
			}
		}
		function _mouseEnter( ev ) {
			if( !scope ) {
				scope = this;
			}
			if( handleIn ) {
				handleIn.call( scope, ev, this, data );
			}
		}
		function _mouseLeave( ev ) {
			if( !scope ) {
				scope = this;
			}
			if( handleOut ) {
				handleOut.call( scope, ev, this, data );
			}
		}
		$elm.hover( _mouseEnter, _mouseLeave );
	}

	/**
	 * proxy 代理事件<封装on函数>
	 * @param  {Object}  $elm      [jquery对象]
	 * @param  {String}  type      [事件类型]
	 * @param  {Mix}     selector  [选择器,可为单个元素或者元素数组]
	 * @param  {Mix}     data      [callback中接受的数据]
	 * @param  {Function}calllback [事件函数]
	 * @param  {Object}  scope     [作用域]
	 */
	exports.proxy = function( $elm, type, selector, data, calllback, scope ) {
		// 参数检测
		if( !$elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}

		// 不传selector
		if( util.isFunc( selector ) ) {
			calllback = selector;
			scope = data;
			selector = null;
			data = null;
		}

		// 不传data
		if( util.isFunc( data ) ) {
			scope = calllback;
			calllback = data;
			data = null;
		}

		$elm.on( type, selector, function( ev ) {
			if( !scope ) {
				scope = this;
			}
			calllback.call( scope, ev, this, data );
		});
	}

	/**
	 * unproxy 取消代理事件<封装off函数>
	 * @param  {Object}   $elm      [jquery对象]
	 * @param  {String}   type      [事件类型]
	 * @param  {Mix}      selector  [选择器,可为单个元素或者元素数组]
	 * @param  {Function} calllback [事件函数]
	 */
	exports.unproxy = function( $elm, type, selector, calllback ) {
		// 参数检测
		if( !$elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}
		switch( arguments.length ) {
			case 1:
				$elm.off(); // 取消所有事件(不管是不是通过on添加的)
			break;

			case 2:
				$elm.off( type ); // 取消指定类型的事件
			break;

			case 3:
				$elm.off( type, selector ); // 取消selector上的所有代理事件
			break;

			case 4:
				$elm.off( type, selector, calllback ); // 取消selector上的callback事件
			break;

			default: return false;

		}
	},

	/**
	 * fire 发送/发布消息<封装trigger函数>
	 * @param  {String} method    [消息名]
	 * @param  {Mix}    data      [消息携带的参数]
	 * @param  {Func}   afterSend [发完后的回调]
	 * @param  {Object} scope     [上下文]
	 */
	exports.fire = function( method, data, afterSend, scope ) {
		data = data || null;
		scope = scope || WIN;
		messager.trigger.call( messager, method, data );
		if( afterSend ) {
			afterSend.call( scope );
		}
	},

	/**
	 * on 接收/订阅消息<封装on函数,只回调部分数据>
	 * @param  {String} method    [消息名]
	 * @param  {Func}   callback  [接受消息的回调]
	 * @param  {Object} scope     [上下文]
	 */
	exports.on = function( method, callback, scope ) {
		// 必须要有回调,不然接收消息干嘛
		if( !callback || !util.isFunc( callback ) ) {
			return false;
		}
		var args = null, evData = null, evt, data;
		scope = scope || WIN;
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
			callback.call( scope, evData );
		});
	},

	/**
	 * cancel 取消消息的订阅和发布<封装off函数>
	 */
	exports.cancel = function() {
		this.unproxy.apply( messager, arguments );
	}
});