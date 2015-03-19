/**
 * [事件绑定模块,封装jQuery事件绑定]
 */
define(function( require, exports ){
	var util = require('util');

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
	 * @param  {Object}  $elm  [jquery对象]
	 * @param  {String}  type  [事件类型]
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
	 * proxy 代理事件
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
	 * unproxy 取消代理事件
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

	}
});