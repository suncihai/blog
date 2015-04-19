/**
 * [路由控制模块]
 */
define(function( require, exports ){
	var WIN = window;
	var LOC = WIN.location;
	var URL = LOC.href;
	var util = require('util');
	var view = require('@core/view').base;
	var C = require('@core/config');
	var action = C.action;
	var data = {
		dom    : null, // 容器对象
		name   : null, // 模块名称
		param  : null, // 页面参数
		search : null  // url参数
	}

	function string2parts( str, pos ) {
		var p1, p2;
		p1 = str.substr( 0, pos );
		p2 = str.substr( pos + 1 );
		return [p1, p2];
	}

	function formatHash( hash ) {
		var name = '', param = null, search = null, ms, tmp;
		var ix = hash.indexOf('/'), hx = ( ix !== -1 );
		var iw = hash.indexOf('?'), hw = ( iw !== -1 );
		if( !hx && !hw ) {
			ms = [hash];
		}
		if( hx && !hw ) {
			ms = string2parts( hash, ix );
			param = ms[1] === '' ? null :
				ms[1].charAt(ms[1].length - 1) === '/' ? ms[1] = ms[1].substr(0, ms[1].length - 1) : ms[1];
		}
		if( !hx && hw ) {
			ms = string2parts( hash, iw );
			search = ms[1];
		}
		if( hx && hw ) {
			// frontends/tag?name=
			if( ix < iw ) {
				tmp = string2parts( hash, ix );
				ms = [tmp[0]].concat( string2parts( tmp[1], tmp[1].indexOf('?') ) );
				param = ms[1];
				search = ms[2];
			}
			// search?word=aa//sss
			else if( ix > iw ) {
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

	function hashChanged() {
		var hash, ms;
		hash = LOC.hash.replace(/^[#\/\!]+/, '') || C.defaultPage;
		ms = formatHash( hash );
		run( ms.name, ms.param, ms.search );
		util.scrollTo(0);
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
		if( search ) {
			data.search = util.formatSearch( search, 1, true );
		}
		require.async( '@controller/' + name, afterRun );
	}

	/**
	 * afterRun 加载模块回调
	 * @param  {type} module [模块]
	 */
	function afterRun( module ) {
		// 404
		if( !module ) {
			util.error('404 - 找不到该页面: ' + data.name);
			require.async('@controller/404', afterRun);
			return false;
		}
		else {
			if( module[action] && util.isFunc( module[action] ) ) {
				module[action]( data, view );
			}
			else {
				util.error('Method "' + action + '" is not correct in controller/' + data.name + '.js');
			}
		}

	}

	exports.start = function() {
		if( 'onhashchange' in WIN ) {
			if( WIN.addEventListener ) {
				WIN.addEventListener( 'hashchange', hashChanged, false );
			}
			else {
				WIN.onhashchange = hashChanged;
			}
		}
		else {
			setInterval(function() {
				if( URL != LOC.href ) {
					hashChanged.call( WIN );
				}
			}, 150);
		}
		hashChanged();
	}

	/**
	 * go 路由切换方法
	 * @param  {String} uri [路由地址 / 数字表示跳转的历史]
	 * @return {null}       [无返回]
	 */
	exports.go = function( uri ) {
		if ( util.isString( uri ) ){
			if ( uri.charAt(0) == '/' ){
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