/**
 * [应用模块(通用模块集合)]
 */
define(function( require, app ) {
	var language = require('@core/language');
	var config = require('@boot/config');
	var router = require('@core/router');
	var animate = require('@core/animate');
	var eventHelper = require('@core/eventHelper');
	var dataHelper = require('@core/dataHelper');
	var messager = require('@core/messager');
	var cookie = require('@core/cookie');

	// 应用模块导出
	app.lang = language;
	app.animate = animate;
	app.data = dataHelper;
	app.event = eventHelper;
	app.messager = messager;
	app.cookie = cookie;
	app.controller = router;

	// 读取系统配置信息(暂支持两层)
	app.getConfig = function( field ) {
		var ret, cArr;
		if ( field ) {
			cArr = field.toString().split('/');
			if ( cArr.length === 2 ) {
				ret = config[cArr[0]] && config[cArr[0]][cArr[1]];
			}
			else {
				ret = config[field];
			}
		}
		else {
			ret = config;
		}
		return ret;
	}
});