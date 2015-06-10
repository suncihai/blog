/**
 * [路由控制模块]
 */
define(function( require, exports ){
	var WIN = window;
	var LOC = WIN.location;
	var util = require('util');
	var view = require('view').base;
	var c = require('@boot/config');
	var action = c.action;
	var controller = c.controllerPath || '@controller';
	var data = {
		dom    : null, // 容器对象
		name   : null, // 模块名称
		param  : null, // 页面参数
		search : null  // url参数
	}

	function hashChanged() {
		var hash, ms;
		hash = LOC.hash.replace(/^[#\/\!]+/, '') || c.defaultPage;
		ms = formatHash( hash );
		run( ms.name, ms.param, ms.search );
		util.scrollTo(0);
	}

	function string2parts( str, pos ) {
		return [str.substr( 0, pos ), str.substr( pos + 1 )];
	}

	/**
	 * formatHash 格式化hash, 分离出模块名、页面参数和url参数
	 * @param  {String}  hash    [hash值]
	 */
	function formatHash( hash ) {
		var name = '', param = null, search = null, ms, tmp;
		var ix = hash.indexOf('/'), hx = ( ix !== -1 );
		var iw = hash.indexOf('?'), hw = ( iw !== -1 );
		if ( !hx && !hw ) {
			ms = [hash];
		}
		if ( hx && !hw ) {
			ms = string2parts( hash, ix );
			param = ms[1] === '' ? null :
				ms[1].charAt(ms[1].length - 1) === '/' ? ms[1] = ms[1].substr(0, ms[1].length - 1) : ms[1];
		}
		if ( !hx && hw ) {
			ms = string2parts( hash, iw );
			search = ms[1];
		}
		if ( hx && hw ) {
			// frontends/tag?name=
			if ( ix < iw ) {
				tmp = string2parts( hash, ix );
				ms = [tmp[0]].concat( string2parts( tmp[1], tmp[1].indexOf('?') ) );
				param = ms[1];
				search = ms[2];
			}
			// search?word=aa//sss
			else if ( ix > iw ) {
				ms = string2parts( hash, iw );
				search = ms[1];
			}
		}
		name = ms[0];
		return {
			'ms'     : ms,
			'name'   : name,
			'param'  : param,
			'search' : search
		}
	}

	/**
	 * formatSearch 格式化url参数为JSON
	 * @param  {String}  str    [字符]
	 * @param  {Number}  limit  [参数限制个数]
	 * @param  {Boolean} strict [进行转义]
	 */
	function formatSearch( str, limit, strict ) {
		var arr = str.split('&'), retJSON = {};
		util.each( arr, function( item, idx ) {
			var ts = item.split('=');
			if ( ts.length === 2 ) {
				retJSON[ts[0]] = strict ? util.htmlEncode( ts[1] ) : ts[1];
			}
			if ( idx + 1 === limit ) {
				return false;
			}
		});
		return retJSON;
	}

	/**
	 * run 启用模块
	 * @param  {type} name   [模块名]
	 * @param  {type} param  [页面参数]
	 * @param  {type} search [url参数]
	 */
	function run( name, param, search ) {
		data.name = name;
		data.param = isNaN( param ) ? util.htmlEncode( param ) : param;
		data.search = search ? formatSearch( search, 1, true ) : null;
		require.async( controller + name, afterRun );
	}

	/**
	 * afterRun 加载模块回调
	 * @param  {type} module [模块]
	 */
	function afterRun( module ) {
		// 404
		if ( !module ) {
			util.error('404 - 找不到该页面: ' + data.name);
			require.async( controller + '404', afterRun );
			return false;
		}
		else {
			if ( module[action] && util.isFunc( module[action] ) ) {
				module[action]( data, view );
			}
			else {
				util.error('路由控制文件' + controller + data.name + '.js' + '的' + action + '方法调用错误！');
			}
		}
	}

	exports.start = function() {
		if ( 'onhashchange' in WIN ) {
			WIN.addEventListener('hashchange', hashChanged, false);
		}
		else {
			WIN.onhashchange = hashChanged;
		}
		hashChanged();
	}

	/**
	 * go 手动切换路由
	 * @param  {Mix} uri [路由地址/-1返回上一页]
	 */
	exports.go = function( uri ) {
		if ( util.isString( uri ) ){
			if ( uri.charAt(0) == '/' ) {
				LOC.href = uri;
			}
			else {
				LOC.hash = "#" + uri;
			}
		}
		else {
			WIN.history.go( uri );
		}
	}
});