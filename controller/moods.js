/**
 * 路由响应模块：随便写写，与栏目页一致
 */
define(function(require, exports) {
	var routerArchive = require('@controller/frontends');

	exports.onRun = function(data) {
		routerArchive.onRun(data);
	}
});