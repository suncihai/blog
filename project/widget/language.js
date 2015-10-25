/**
 * [多语言处理模块]
 * 多语言cookie名称为lang, 有三种值：zhCN、zhHK、enUS
 */
define(function(require, exports, module) {
	var WIN = window;
	var util = require('util');
	var jquery = require('jquery');
	var config = require('@boot/config');
	var cookie = require('@widget/cookie');

	// 语言包路径
	var basePath = 'lang';
	var loc = WIN.location;

	function Language() {
		var self = this;
		var cLang = cookie.get('lang');
		var dLang = config.defaultLang || 'zhCN';

		// 默认语言
		this.defaultLang = dLang;
		// 正在加载的语言
		this.loadLang = null;

		// 当前的语言
		if (cLang) {
			this.currentLang = cLang;
		}
		else {
			cookie.set('lang', dLang);
			this.currentLang = dLang;
		}

		// 语言翻译对象(语言包)
		this.langPackage = null;
		// 语言转换模块路径
		this.langPackagePath = '_translate_module_path_';
		// 语言转换模块方法
		this.langPackageFunc = '_translate_module_func_';
		// 加载语言包后的回调函数
		this.callback = null;

		/**
		 * 全局多语言标记函数，支持模板替换
		 * @param  {String}  text  [需要翻译的文字]
		 */
		this.T = WIN.T = function(text /*, replaceN ... */) {
			var langPackage = self.langPackage;
			// 对非默认语言进行转换
			if (!self.isDefault()) {
				// 方法转换
				if (langPackage && util.isFunc(langPackage.func)) {
					text = langPackage.func.call(self, text);
				}
				// 语言包装换
				else if (langPackage && langPackage.hasOwnProperty(text)) {
					text = langPackage[text];
				}
			}

			// 模板替换
			if (arguments.length > 1) {
				text = util.templateReplace.apply(self, arguments);
			}

			return text;
		};

		/**
		 * 设置显示语言
		 * @param  {String}   lang    [语言字段]
		 * @param  {Boolean}  reload  [是否立即刷新页面]
		 */
		this.setLang = function(lang, reload) {
			cookie.set('lang', lang);

			if (reload) {
				loc.reload();
			}
		};

		/**
		 * load 加载语言包
		 * @param  {String}  lang  [需要加载的语言类型]
		 */
		this.load = function(lang) {
			if (util.isFunc(lang)) {
				this.callback = lang;
				lang = this.currentLang;
			}

			if (lang === this.defaultLang) {
				this.langPackage = null;
				this.callback(null);
				return false;
			}

			this.loadLang = lang;

			if (!this.isDefault()) {
				jquery.ajax({
					'url'        : basePath + '/' + lang + '/translate.json',
					'type'       : 'GET',
					'dataType'   : 'json',
					'contentType': 'application/json; charset=UTF-8',
					'success'    : this.fnPackageSuccess,
					'error'      : this.fnPackageError,
					'context'    : this
				});
			}
		};

		/**
		 * 语言包加载成功
		 * @param   {Object}  data  [语言包数据]
		 */
		this.fnPackageSuccess = function(data) {
			// 数据格式化
			var result = null, error = null;
			if (data && data.success) {
				result = data;
			}
			else {
				error = util.extend({
					'message': 'Language package load failure!',
					'code'   : 200,
					'success': false
				}, data);
			}

			this.afterLoad(error, result);
		};

		/**
		 * 语言包加载失败
		 * @param  {Object} xhr        [XMLRequest对象]
		 * @param  {String} textStatus [错误文本信息]
		 * @param  {Object} err        [错误对象]
		 */
		this.fnPackageError = function(xhr, textStatus, err) {
			var error = {
				'status' : textStatus,
				'message': err,
				'code'   : xhr.status
			};
			this.afterLoad(error, null);
		};

		/**
		 * 语言包加载完成后的回调
		 * @param   {Object}  err   [错误信息]
		 * @param   {Object}  data  [成功数据]
		 */
		this.afterLoad = function(err, data) {
			var self = this;

			// 先执行回调
			if (util.isFunc(this.callback)) {
				this.callback();
			}

			if (err) {
				util.error(err);
				return false;
			}

			var result = this.langPackage = data.result;

			// 加载失败
			if (!result) {
				util.error('Language package load failure: ' + this.loadLang);
				this.currentLang = this.defaultLang;
				cookie.set('lang', this.defaultLang);
				jquery('body').addClass(this.defaultLang);
				return false;
			}

			var transPath = result[this.langPackagePath];
			var transFunc = result[this.langPackageFunc];

			this.currentLang = this.loadLang;
			jquery('body').addClass(this.currentLang);

			var cssPath = basePath + '/' + this.currentLang;
			// 缓存转换方法
			if (transPath && transFunc) {
				require.async(transPath, function(translate) {
					var func =  translate[transFunc];
					if (func && util.isFunc(func)) {
						self.langPackage.func = func;
					}
				});
			}
			// 加载语言适应的CSS文件
			else {
				jquery('<link/>').attr({
					'charset': 'utf-8',
					'rel'    : 'stylesheet',
					'id'     : 'language_style',
					'href'   : cssPath + '/' + this.currentLang + '.css'
				}).appendTo(jquery('head'));
			}
		};

		/**
		 * 是否是默认语言
		 * @return  {Boolean}  [结果]
		 */
		this.isDefault = function() {
			return this.currentLang === this.defaultLang;
		};

		/**
		 * 翻译JSON对象
		 * @param   {Object}  json  [翻译的对象]
		 * @return  {Object}        [翻译结果]
		 */
		this.translateJSON = function(json) {
			var self = this;
			if (!util.isObject(json)) {
				return json;
			}

			util.each(json, function(value, key) {
				// 字段值类型为字符串，直接翻译
				if (util.isString(value)) {
					json[key] = self.T(value);
				}
				// 字段值类型为数组
				else if (util.isArray(value)) {
					json[key] = self.translateArrary(value);
				}
				// 字段值类型为对象
				else if (util.isObject(value)) {
					json[key] = self.translateJSON(value);
				}
			});

			return json;
		}

		/**
		 * 翻译数组元素
		 * @param   {Array}  array  [数组]
		 * @return  {Array}         [翻译结果]
		 */
		this.translateArrary = function(array) {
			var self = this, rets = [];

			util.each(array, function(item) {
				// 字段为字符串，直接翻译
				if (util.isString(item)) {
					rets.push(self.T(item));
				}
				// 字段为数组
				else if (util.isArray(item)) {
					rets.push(self.translateArrary(item));
				}
				else if (util.isObject(item)) {
					rets.push(self.translateJSON(item));
				}
				// 其他类型
				else {
					rets.push(item);
				}
			});

			return rets;
		}
	}

	module.exports = new Language();
});