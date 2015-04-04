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
		dom: null,   // 容器对象
		name: null,  // 模块名称
		param: null  // 请求参数
	}

	/**
	 * hashChanged 监听hash变化
	 */
	function hashChanged() {
		var hash, arr, len, name, param;
		hash = LOC.hash.replace(/^[#\/\!]+/, '') || C.defaultPage;
		arr = hash.split('/');
		len = arr.length;
		name = arr[0];
		switch( len ) {
			case 1:
				param = null;
			break;
			case 2:
				param = arr[1];
			break;
			default: param = arr[2] === '' ? arr[1] : null;
		}
		run( name, param );
		util.scrollTo(0);
	}

	/**
	 * run 启用模块
	 * @param  {type} name  [模块名]
	 * @param  {type} param [请求参数]
	 */
	function run( name, param ) {
		data.name = name;
		data.param = param;
		require.async( '@controller/' + name, afterRun );
	}

	/**
	 * afterRun 启用后执行相应的操作
	 * @param  {type} module [启用的模块]
	 */
	function afterRun( module ) {
		// 404
		if( !module ) {
			util.error('404 - 找不到该页面: ' + data.name);
			require.async( '@controller/404', afterRun );
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

	/**
	 * start 开始执行路由控制
	 */
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