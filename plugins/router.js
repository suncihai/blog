/**
 * [路由控制模块]
 */
define(function(require, exports) {
	var WIN = window;
	var LOC = WIN.location;
	var util = require('util');
	var c = require('@boot/config');
	var cookie = require('@widget/cookie');

	// 控制器调用方法
	var action = c.action;
	// 默认路由
	var controller = c.controllerPath;
	// 合法路由
	var validRouter = c.validRouter;


	/**
	 * hash变化响应函数
	 * @param   {Object}  hashEvt  [hashChange事件对象]
	 */
	function hashChanged(hashEvt) {
		var hash = LOC.hash.replace(/^[#\/\!]+/, '') || c.defaultRouter;

		// 分离hash值
		var ms = formatHash(hash);
		var name = ms.name;
		var param = ms.param;
		var search = ms.search;

		// 路由参数检测
		if (!validateHashParam(name, param, search)) {
			name = 404;
		}

		// 记录cookie
		// cookie.set('newUrl', hashEvt.newUrl);
		// cookie.set('oldUrl', hashEvt.oldUrl);
		cookie.set('hash', [name, param, JSON.stringify(search)].join(c.hashString));

		run(name, param, search);
		util.scrollTo(0);
	}


	/**
	 * 按指定位置分割字符串为数组
	 * @param   {Sting}   str  [分割的字符串]
	 * @param   {Number}  pos  [分割位置]
	 * @return  {Array}        [结果数组]
	 */
	function string2parts(str, pos) {
		return [str.substr(0, pos), str.substr(pos + 1)];
	}


	/**
	 * formatHash 格式化hash, 分离出模块名name、页面参数param和url参数
	 * @param  {String}  hash    [hash值]
	 */
	function formatHash(hash) {
		var name = '', param = null, search = null, ms, tmp;
		var ix = hash.indexOf('/'), hx = (ix !== -1);
		var iw = hash.indexOf('?'), hw = (iw !== -1);
		if (!hx && !hw) {
			ms = [hash];
		}
		if (hx && !hw) {
			ms = string2parts(hash, ix);
			param = ms[1] === '' ? null : ms[1].charAt(ms[1].length - 1) === '/' ? ms[1] = ms[1].substr(0, ms[1].length - 1) : ms[1];
		}
		if (!hx && hw) {
			ms = string2parts(hash, iw);
			search = ms[1];
		}
		if (hx && hw) {
			// frontends/tag?name=
			if (ix < iw) {
				tmp = string2parts(hash, ix);
				ms = [tmp[0]].concat(string2parts(tmp[1], tmp[1].indexOf('?')));
				param = ms[1];
				search = ms[2];
			}
			// search?word=aa//sss
			else if (ix > iw) {
				ms = string2parts(hash, iw);
				search = ms[1];
			}
		}
		name = ms[0];

		return {
			'ms'    : ms,
			'name'  : name,
			'param' : param,
			'search': search
		}
	}


	/**
	 * formatSearch 格式化url参数为JSON
	 * @param  {String}  str    [字符]
	 * @param  {Number}  limit  [参数限制个数]
	 * @param  {Boolean} strict [进行转义]
	 */
	function formatSearch(str, limit, strict) {
		var arr = str.split('&'), retJSON = {};
		util.each(arr, function(item, idx) {
			var ts = item.split('=');
			if (ts.length === 2) {
				retJSON[ts[0]] = strict ? util.htmlEncode(ts[1]) : ts[1];
			}
			if (idx + 1 === limit) {
				return false;
			}
		});
		return retJSON;
	}


	/**
	 * 路由检测（页面参数param必须是数字）
	 * @param   {String}   name   [路由模块]
	 * @param   {String}   param  [页面参数]
	 * @param   {String}   search [查询参数]
	 * @return  {Boolean}         [是否合法]
	 */
	function validateHashParam(name, param, search) {
		var valid = false;
		var searchs = null;

		// 路由模块是否合法
		var router = validRouter[name];
		if (!router) {
			return false;
		}

		// 合法的查询参数
		var vSearchs = router || [];

		// 检测路由参数
		if (param) {
			valid = !isNaN(+param);
		}
		else {
			// 检测查询参数
			if (search) {
				searchs = search.split('=');
				valid = vSearchs.indexOf(searchs[0]) !== -1;
			}
			else {
				valid = true;
			}
		}

		return valid;
	}


	// 传递到响应路由控制模块的参数数据
	var data = {
		// 页面名称，对应主hash值
		'name'  : null,
		// 页面参数
		'param' : null,
		// url参数
		'search': null
	}

	/**
	 * run 启用模块
	 * @param  {String} name   [模块名]
	 * @param  {Number} param  [页面参数]
	 * @param  {Object} search [url参数]
	 */
	function run(name, param, search) {
		data.name = name;
		data.param = isNaN(param) ? util.htmlEncode(param) : param;
		data.search = search ? formatSearch(search, 1, true) : null;
		require.async(controller + name, afterRun);
	}


	/**
	 * afterRun 加载模块回调
	 * @param  {Object} _module [模块]
	 */
	function afterRun(_module) {
		// 404
		if (!_module) {
			util.error('404 - Module Not Found: [' + data.name + '] in ' + controller);
			require.async(controller + '404', afterRun);
			return false;
		}
		else {
			if (_module[action] && util.isFunc(_module[action])) {
				// 传递路由参数数据
				_module[action](data);
			}
			else {
				util.error('The controller file: ' + controller + data.name + '.js' + ' has no function exports of [' + action + ']');
			}
		}
	}

	/**
	 * 启用路由监听事件
	 */
	exports.start = function() {
		if ('onhashchange' in WIN) {
			WIN.addEventListener('hashchange', hashChanged, false);
		}
		else {
			util.error('Your fucking-browser is Out!');
		}

		hashChanged();
	}


	/**
	 * go 切换路由
	 * @param  {Mix} uri [路由地址/-1返回上一页]
	 */
	exports.go = function(uri) {
		if (util.isString(uri)){
			if (uri.charAt(0) == '/') {
				LOC.href = uri;
			}
			else {
				LOC.hash = "#" + uri;
			}
		}
		else {
			WIN.history.go(uri);
		}
	}
});