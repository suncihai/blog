/**
 * [应用模块(通用模块集合)]
 */
define(function( require, exports ) {
	var router = require('@core/router'),
		config = require('@boot/config'),
		animate = require('@core/animate'),
		eventHelper = require('@core/eventHelper'),
		dataHelper = require('@core/dataHelper'),
		messager = require('@core/messager'),
		cookie = require('@core/cookie');

	// 应用模块导出
	exports.animate = animate;
	exports.data = dataHelper;
	exports.event = eventHelper;
	exports.messager = messager;
	exports.cookie = cookie;
	exports.controller = router;

	// 方法导出
	// 读取系统配置信息
	exports.getConfig = function( field ) {
		return field ? config[field] : config;
	}
});