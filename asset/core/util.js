define(function( require, util ){
	var WIN = window;
	
	// 系统日志函数
	util.log = function() {
		var cons = WIN.console || {};
		cons.log.apply( cons, arguments );
	}

	// 异步创建模块
	util.create = function( uri, callback ) {
		require.async( uri, function( mod ) {
			callback.call( mod );
		});
	}
});