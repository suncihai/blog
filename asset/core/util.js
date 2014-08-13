define(function( require, util ){
	var WIN = window;
	var DOC = document;
	var OP = Object.prototype;
	var SP = String.prototype;

	// 是否是对象自变量, {}或new Object()的形式
	function isObject( obj ) {
		return OP.toString.call( obj ) === '[object Object]';
	}

	// 是否是真数组, []或new Array()的形式
	function isArray( obj ) {
		return OP.toString.call( obj ) === '[object Array]';
	}

	// 是否是函数
	function isFunc( fn ) {
		return ( fn instanceof Function );
	}

	// 是否是字符串
	function isString( str ) {
		return ( typeof( str ) === 'string' );
	}

	// 数组中是否存在某元素
	function inArray( ele, arr ) {
		if( isArray( arr ) ) {
			var leng = arr.length, i = 0;
			for( ; i < leng; i++ ) {
				if( arr[i] === ele ) {
					return i;
				}
			}
		}
		return -1;
	}

	/**
	 * 工具方法导出
	 * @type {Boolean}
	 */
	util.isObject = isObject;
	util.isArray = isArray;
	util.isFunc = isFunc;
	util.isString = isString;
	util.inArray = inArray;

	/**
	 * 系统日志函数
	 * @type {[type]}
	 */
	var cons = WIN.console || {};
	util.log = function() {
		cons.log.apply( cons, arguments );
	}
	util.error = function() {
		if( cons.error.apply ) {
			cons.error.apply( cons, arguments );
		}
		else {
			cons.error( arguments[0] );
		}
	}
	// 去掉字符串首位空格
	util.trim = function( str ) {
		if( isString( str ) ) {
			return SP.trim.call( str );
		}
		return str;
	}

});