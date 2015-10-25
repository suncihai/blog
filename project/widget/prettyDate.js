/*
 * 格式化时间插件, 返回与当前的时间差
 */
define(function(require, exports) {
	var util = require('util');

	/**
	 * 导出格式化方法
	 * @param   {String}  dateStr  [时间串，格式为 2015-05-16 16:14:30]
	 * @return  {String}           [格式化后的时间差]
	 */
	exports.format = function(dateStr) {
		if (!util.isString(dateStr)) {
			return dateStr
		}
		var date = new Date();
		// 分离年月日时分秒
		var dateArr = dateStr.split(new RegExp('[:| |-]', 'ig'));
		var year   = +dateArr[0],
			month  = +dateArr[1] - 1,
			day    = +dateArr[2],
			hour   = +dateArr[3],
			minute = +dateArr[4],
			second = +dateArr[5];
		// 时分补0
		hour = hour < 10 ? util.fixZero(hour, 1) : hour;
		minute = minute < 10 ? util.fixZero(minute, 1) : minute;
		// 计算秒数差值
		var opDate = new Date(year, month, day , hour, minute, second);
		var secondDiff = (new Date().getTime() - opDate.getTime()) / 1000;
		var retStr = '';
		if (secondDiff < 60) {
			retStr = T('刚刚');
		}
		if (!retStr && secondDiff < 60 * 30) {
			retStr = T('{1}分钟前', Math.ceil(secondDiff / 60));
		}
		if (!retStr && secondDiff < 1800) {
			retStr= T('半小时前');
		}
		if (!retStr && secondDiff < 3600) {
			retStr= T('1小时前');
		}
		if (!retStr && secondDiff < 3600 * 2) {
			retStr= T('2小时前');
		}
		if (!retStr && secondDiff < 3600 * 3) {
			retStr= T('3小时前');
		}
		if (!retStr && date.getFullYear() == year && date.getMonth() == month && date.getDate() == day) {
			retStr = T('今天') + hour + ':' + minute;
		}
		if (!retStr && date.getFullYear() == year && date.getMonth() == month && date.getDate() - 1 == day) {
			retStr = T('昨天') + hour + ':' + minute;
		}
		if (!retStr && date.getFullYear() == year && date.getMonth() == month && date.getDate() - 2 == day) {
			retStr = T('前天') + hour + ':' + minute;
		}
		if (!retStr && date.getFullYear() == year && date.getMonth() == month) {
			retStr = T('{1}月{2}日', month + 1, day);
		}
		if (!retStr && date.getFullYear() == year) {
			retStr = T('今年{1}月{2}日', month + 1, day);
		}
		if (!retStr && date.getFullYear() - 1 == year) {
			retStr = T('去年{1}月{2}日', month + 1, day);
		}
		if (!retStr && date.getFullYear() - year > 1) {
			retStr = T('{1}年{2}月{3}日', year, month + 1, day);
		}
		return retStr;
	}
});