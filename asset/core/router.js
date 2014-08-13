define(function( require, exports ){
	var WIN = window;
	var LOC = WIN.location;
	var util = require('util');
	var view = require('view');
	var C = require('@core/config');
	var action = C.action;
	var data = {
		module: null,
		param: null
	}

	function hashChanged() {
		var hash = LOC.hash.replace(/^[#\/\!]+/, '') || C.defaultPage;
		var pos = hash.indexOf('/');
		var param = pos == -1 ? '' : hash.substr( pos + 1 );
		run( hash, param );
	}

	function run( module, param ) {
		data.module = module;
		data.param = param;
		require.async( '@controller/' + module, afterRun );
	}

	function afterRun( module ) {
		if( module[action] && util.isFunc( module[action] ) ) {
			module[action]( data, view );
		}
		else {
			util.error('Action method "' + action + '" is not correct in controller/' + data.module + '.js');
		}
	}

	// 开始执行路由
	exports.start = function() {
		if( 'onhashchange' in WIN ) {
			WIN.addEventListener( 'hashchange', hashChanged, false );
		}
		hashChanged();
	}
});