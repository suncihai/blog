/**
 * [事件绑定模块,封装jQuery事件绑定]
 * 事件绑定用bind、proxy; 反操作为unbind、unproxy
 */
define(function(require, exports) {
	var util = require('util');
	var jquery = require('jquery');

	/**
	 * bind 绑定事件
	 * @param  {Object}   $elm     [jquery对象]
	 * @param  {String}   type     [事件类型]
	 * @param  {Mix}      data     [callback中接受的数据]
	 * @param  {Function} calllback[事件函数]
	 * @param  {Object}   context  [作用域]
	 */
	exports.bind = function($elm, type, data, calllback, context) {
		// 参数检测
		if (!($elm instanceof jQuery)) {
			$elm = jquery($elm);
		}
		// 不传data
		if (util.isFunc(data)) {
			context = calllback;
			calllback = data;
			data = null;
		}

		$elm.bind(type, function(ev) {
			if (!context) {
				context = this;
			}
			calllback.call(context, ev, this, data);
		});
	}

	/**
	 * unbind 取消绑定事件
	 * @param  {Object}  $elm    [jquery对象]
	 * @param  {String}  type    [事件类型]
	 */
	exports.unbind = function($elm, type) {
		// 参数检测
		if (!($elm instanceof jQuery)) {
			$elm = jquery($elm);
		}
		$elm.unbind(type);
	}

	/**
	 * hover 鼠标移入移出事件
	 * @param  {Object}    $elm<必选>       [jquery对象]
	 * @param  {Function}  handleIn<必选>   [鼠标移入事件]
	 * @param  {Function}  handleOut<可选>  [鼠标移出事件]
	 * @param  {Function}  data<可选>       [回调中传递数据]
	 * @param  {Object}    context<可选>    [作用域]
	 */
	exports.hover = function($elm, handleIn, handleOut, data, context) {
		var argLen = arguments.length;
		// 参数检测
		if (!($elm instanceof jQuery)) {
			$elm = jquery($elm);
			return false;
		}
		if (argLen === 4) {
			context = data;
			data = null;
		}
		if (!util.isFunc(handleOut)) {
			if (argLen === 4) {
				context = data;
				data = handleOut;
				handleOut = null;
			}
			if (argLen === 3) {
				context = handleOut;
				handleOut = null;
				data = null;
			}
		}
		function _mouseEnter(ev) {
			if (!context) {
				context = this;
			}
			if (handleIn) {
				handleIn.call(context, ev, this, data);
			}
		}
		function _mouseLeave(ev) {
			if (!context) {
				context = this;
			}
			if (handleOut) {
				handleOut.call(context, ev, this, data);
			}
		}
		$elm.hover(_mouseEnter, _mouseLeave);
	}

	/**
	 * proxy 代理事件<封装on函数>
	 * @param  {Object}  $elm      [jquery对象]
	 * @param  {String}  type      [事件类型]
	 * @param  {Mix}     selector  [选择器,可为单个元素或者元素数组]
	 * @param  {Mix}     data      [callback中接受的数据]
	 * @param  {Function}calllback [事件函数]
	 * @param  {Object}  context   [作用域]
	 */
	exports.proxy = function($elm, type, selector, data, calllback, context) {
		// 参数检测
		if (!($elm instanceof jQuery)) {
			$elm = jquery($elm);
		}

		// 不传selector
		if (util.isFunc(selector)) {
			calllback = selector;
			context = data;
			selector = null;
			data = null;
		}

		// 不传data
		if (util.isFunc(data)) {
			context = calllback;
			calllback = data;
			data = null;
		}

		$elm.on(type, selector, function(ev) {
			if (!context) {
				context = this;
			}
			calllback.call(context, ev, this, data);
		});
	}

	/**
	 * unproxy 取消代理事件<封装off函数>
	 * @param  {Object}   $elm      [jquery对象]
	 * @param  {String}   type      [事件类型]
	 * @param  {Mix}      selector  [选择器,可为单个元素或者元素数组]
	 * @param  {Function} calllback [事件函数]
	 */
	exports.unproxy = function($elm, type, selector, calllback) {
		// 参数检测
		if (!($elm instanceof jQuery)) {
			$elm = jquery($elm);
		}
		switch(arguments.length) {
			case 1:
				$elm.off(); // 取消所有事件(不管是不是通过on添加的)
			break;

			case 2:
				$elm.off(type); // 取消指定类型的事件
			break;

			case 3:
				$elm.off(type, selector); // 取消selector上的所有代理事件
			break;

			case 4:
				$elm.off(type, selector, calllback); // 取消selector上的callback事件
			break;

			default: return false;
		}
	}
});