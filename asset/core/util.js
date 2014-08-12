define(function( require, util ){
	var WIN = window;
	var OP = Object.prototype;

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

	util.isObject = isObject;
	util.isArray = isArray;
	util.isFunc = isFunc;
	util.isString = isString;
	util.inArray = inArray;
	
	// 系统日志函数
	util.log = function() {
		var cons = WIN.console || {};
		cons.log.apply( cons, arguments );
	}

	// 异步创建模块
	util.create = function( uri, callback ) {
		if( isString( uri ) && isFunc( callback ) ) {
			require.async( uri, function( mod ) {
				callback.call( mod );
			});
		}
	}
});