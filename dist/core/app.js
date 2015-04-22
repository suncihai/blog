/**
 * [应用模块(通用模块集合)]
 * 包括：
		view      : 视图控制模块
		animate   : CSS3动画模块
		data      : Ajax数据处理模块
		event     : 事件/消息处理模块
		controller: 路由控制模块
		config    : 系统配置模块
 */
define(function( require, exports ) {
	var view = require('@core/view').base,
		router = require('@core/router'),
		config = require('@data/config'),
		animate = require('@core/animate'),
		eventHelper = require('@core/eventHelper'),
		dataHelper = require('@core/dataHelper').base;

	// 应用模块导出
	exports.view = view;
	exports.animate = animate;
	exports.data = dataHelper;
	exports.event = eventHelper;
	exports.controller = router;

	// 方法导出
	exports.getConfig = function( field ) {
		return field ? config[field] : config;
	}
});