define(function( require, exports ){
	var WIN = window;
	var LOC = WIN.location;
	var util = require('util');
	var C = require('@core/config');
	var defaultHash = C.defaultHash;
	var Archives = C.Archives;

	function hashChanged() {
		var hash = LOC.hash.replace(/^[#\/\!]+/, '') || defaultHash;
		var idx = util.inArray( hash, Archives );
		var module = idx == -1 ? 'index' : 'archives';
		util.create( '@pages/' + module, afterRun );
	}

	function afterRun() {
		util.log('回调成功！')
	}

	// 开始执行路由
	exports.start = function() {
		if( 'onhashchange' in WIN ) {
			WIN.addEventListener( 'hashchange', hashChanged, false );
		}
		hashChanged();
	}
});