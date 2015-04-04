/**
 * [应用模块(通用模块集合)]
 */
define(function( require, exports ) {
	var view = require('view');
	var layout = require('layout');
	var router = require('router');
	var config = require('@core/config');
	var animate = require('@core/animate');
	var eventHelper = require('@core/eventHelper');
	var dataHelper = require('@core/dataHelper').base;

	exports.view = view;
	exports.layout = layout;
	exports.config = config;
	exports.animate = animate;
	exports.data = dataHelper;
	exports.event = eventHelper;
	exports.controller = router;
});