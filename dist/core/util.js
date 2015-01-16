/**
 * [工具方法模块]
 */
define(function( require, util ){
	var WIN = window;
	var DOC = document;
	var OP = Object.prototype;
	var SP = String.prototype;
	var AP = Array.prototype;

	/**
	 * isObject 是否是对象自变量, {}或new Object()的形式
	 */
	function isObject( obj ) {
		return OP.toString.call( obj ) === '[object Object]';
	}

	/**
	 * isArray 是否是真数组, []或new Array()的形式
	 */
	function isArray( obj ) {
		return OP.toString.call( obj ) === '[object Array]';
	}

	/**
	 * isFunc 是否是函数
	 */
	function isFunc( fn ) {
		return ( fn instanceof Function );
	}

	/**
	 * isString 是否是字符串
	 */
	function isString( str ) {
		return ( typeof( str ) === 'string' );
	}

	/**
	 * inArray 数组中是否存在某元素
	 * @param  {Mix}   ele [目标元素]
	 * @param  {Array} arr [查询数组]
	 * @return {Number}    [数组下标]
	 */
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
	 */
	util.isObject = isObject;
	util.isArray = isArray;
	util.isFunc = isFunc;
	util.isString = isString;
	util.inArray = inArray;

	/**
	 * 系统日志函数
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

	/**
	 * mergeParam AJAX请求参数的合并/更新/格式化
	 * @param  {JSON} Jold [默认参数]
	 * @param  {JSON} Jnew [指定参数]
	 * @return {JSON}      [最新参数]
	 */
	util.mergeParam = function( Jold, Jnew ) {
		Jnew = arguments.length === 1 ? {} : Jnew;
		if( !isObject( Jold ) || !isObject( Jnew ) ) {
			return false;
		}
		for( var pro in Jold ) {
			Jold[pro] = Jnew.hasOwnProperty( pro ) ? Jnew[pro] : Jold[pro];
		}
		return Jold;
	}

	/**
	 * scrollTo 自定义滚动条位置(用于hash改变时纠正滚动条位置) 
	 * @param  {Number} x [横位置]
	 * @param  {Number} y [纵位置]
	 */
	 util.scrollTo = function( x, y ) {
	 	var a = x || 0;
	 	var b = y || 0;
	 	window.scrollTo( a, b );
	 }

	/**
	 * argsToArray 参数转数组
	 * @param  {Object} args [参数]
	 * @return {Array}       [数组]
	 */
	util.argsToArray = function( args ) {
		if ( args instanceof arguments.constructor ) {
			return AP.slice.call( args );
		}
		else {
			return args;
		}
	}

	/**
	 * getKeyName 获取JSON对象键值名
	 * @param  {String} val  [值]
	 * @param  {Object} obj  [值所在的对象]
	 * @return {String}      [键值名称]
	 */
	util.getKeyName = function( val, obj ) {
		var key = '';
		if( ( !val || !obj ) && !isObject( obj ) ) {
			return false;
		}
		for( key in obj ) {
			if( obj[key] == val ) {
				return key;
			}
		}
	}

});