/**
 * [工具方法模块]
 */
define(function( require, util ){
	var WIN = window;
	var OP = Object.prototype;
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
	 * isBoolean 是否是布尔值
	 */
	function isBoolean( bool ) {
		return ( typeof( bool ) === 'boolean' );
	}

	/**
	 * isNumber 是否是数字
	 */
	function isNumber( num ) {
		return ( typeof( num ) === 'number' && !isNaN( num ) );
	}

	/**
	 * inArray 数组中是否存在某元素
	 * @param  {Mix}   ele [目标元素]
	 * @param  {Array} arr [查询数组]
	 * @return {Number}    [数组下标]
	 */
	function inArray( ele, arr ) {
		if ( isArray( arr ) ) {
			var leng = arr.length, i = 0;
			for ( ; i < leng; i++ ) {
				if ( arr[i] === ele ) {
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
	util.isBoolean = isBoolean;
	util.isNumber = isNumber;

	/**
	 * 系统日志函数
	 */
	var cons = WIN.console || {};
	util.log = function() {
		cons.log.apply( cons, arguments );
	}
	util.error = function() {
		if ( cons.error.apply ) {
			cons.error.apply( cons, arguments );
		}
		else {
			cons.error( arguments[0] );
		}
	}

	/**
	 * merge AJAX请求参数的合并/更新/格式化
	 * @param  {JSON} Jold [默认参数]
	 * @param  {JSON} Jnew [指定参数]
	 * @return {JSON}      [最新参数]
	 */
	util.merge = function( Jold, Jnew ) {
		Jnew = arguments.length === 1 ? {} : Jnew;
		if ( !isObject( Jold ) || !isObject( Jnew ) ) {
			return false;
		}
		for ( var pro in Jold ) {
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
		var _x = x || 0;
		var _y = y || 0;
		window.scrollTo( _x, _y );
	}

	/**
	 * argumentsToArray 参数转数组
	 * @param  {Object} args [参数]
	 * @return {Array}       [数组]
	 */
	util.argumentsToArray = function( args ) {
		if  ( args instanceof arguments.constructor ) {
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
		if ( ( !val || !obj ) && !isObject( obj ) ) {
			return false;
		}
		for ( key in obj ) {
			if ( obj[key] == val ) {
				return key;
			}
		}
		return false;
	}

	/**
	 * isEmpty 检测是否为空对象或者空数组
	 * @param  {String} val  [值]
	 * @return {Boolean}     [空为真,非空为假]
	 */
	util.isEmpty = function( val ) {
		if ( isObject( val ) ) {
			for ( var property in val ) {
				if ( val.hasOwnProperty( property ) ) {
					return false;
				}
				return true;
			}
		}
		else if ( isArray( val ) ) {
			return ( val.length === 0 );
		}
	}

	/**
	 * each 遍历数组 (TODO:遍历对象)
	 * @param  {Array}     items     [数组]
	 * @param  {Fuction}   callback  [回调函数]
	 * @param  {Object}    context   [作用域]
	 */
	util.each = function( items, callback, context ) {
		if ( !isArray( items ) || !isFunc( callback ) ) {
			return false;
		}
		if ( !context ) {
			context = WIN;
		}
		var ret;
		for ( var i = 0; i < items.length; i++ ) {
			ret = callback.call( context, items[i], i );
			// 回调返回false退出循环
			if ( ret === false ) {
				break;
			}
			// 回调返回null删除当前选项
			if ( ret === null ) {
				items.splice( i, 1 );
				i--;
			}
		}
	}

	/**
	 * guid 获取一个唯一的ID
	 * @param  {String} fix [前缀]
	 * @return {Mix} 返回唯一的ID号
	 */
	var _guid = 1;
	util.guid = function( fix ) {
		if ( fix ) {
			return '' + fix + ( _guid++ );
		}
		else {
			return _guid++;
		}
	}

	/**
	 * random 生成指定范围的随机整数
	 * @param  {Number} begin  [开始]
	 * @param  {Number} end    [结束]
	 */
	util.random = function( begin, end ) {
		return parseInt( Math.random() * ( end - begin + 1 ) + begin, 10 );
	}

	/**
	 * htmlEncode 将html标签转义
	 * @param  {String} html  [字符]
	 */
	util.htmlEncode = function( html ) {
		var tag = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;'
		}
		function esc_rp( m ) {
			return tag[m];
		}
		return ( typeof( html ) != 'string' ) ? html : html.replace(/[&<>"]/g, esc_rp );
	}

	/**
	 * formatSearch 格式化url参数为JSON
	 * @param  {String}  str    [字符]
	 * @param  {Number}  limit  [参数限制个数]
	 * @param  {Boolean} strict [进行转义]
	 */
	util.formatSearch = function( str, limit, strict ) {
		var arr = str.split('&'), retJSON = {};
		var self = this;
		this.each( arr, function( item, idx ) {
			var ts = item.split('=');
			if ( ts.length === 2 ) {
				retJSON[ts[0]] = strict ? self.htmlEncode( ts[1] ) : ts[1];
			}
			if ( idx + 1 === limit ) {
				return false;
			}
		});
		return retJSON;
	}

	/**
	 * find 根据字段和值查找数组中的元素
	 * @param  {Array}   arr    [数组]
	 * @param  {Mix}     value  [查询值]
	 * @param  {String}  field  [对应的字段名]
	 */
	util.find = function( arr, value, field ) {
		var ret;
		this.each( arr, function( item ) {
			if ( item[field] === value ) {
				ret = item;
				return false;
			}
		});
		return ret;
	}

	/**
	 * parse 解析get请求参数
	 * @param   {Object}  param  [参数JSON]
	 * @return  {String}         [解析的字符创]
	 */
	util.parse = function( param ) {
		var arr = [];
		for ( var pro in param ) {
			arr.push( pro + '=' + param[pro] );
		}
		return '?' + arr.join('&');
	},

	/**
	 * getClientHeight 获取页面可视区高度
	 */
	util.getClientHeight = function() {
		var docElem = document.documentElement;
		var docBody = document.body;
		return document.compatMode === "CSS1Compat" ? docElem.clientHeight : docBody.clientHeight;
	}

});