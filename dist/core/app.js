/**
 * =======================
 * 核心应用模块
 * =======================
 */
define(function(require, exports, module) {
	var util = require('./util');
	var jquery = require('jquery');


	/*
	 * createProto 创建并返回一个拥有指定原型的原型对象
	 * @param  {Object} proto   [指定的原型对象]
	 * @return {Object} pointer [指向proto原型的原型对象]
	 */
	function createProto(proto) {
		// 返回的原型指针对象
		var pointer = null;
		var standard = util.isFunc(Object.create);
		var Foo = !standard ? function() {} : null;

		if (standard) {
			pointer = Object.create(proto);
		}
		else {
			Foo.prototype = proto;
			pointer = new Foo();
		}

		return pointer;
	}


	/*
	 * Root 根函数，实现类式继承
	 * @param  {Object} proto [新原型对象]
	 * @return {Object} Class [继承后的类]
	 */
	function Root() {};
	Root.extend = function(proto) {
		// 父原型对象，相当于proto要从parent继承
		var parent = this.prototype;

		// 返回(继承后)的类
		function Class() {};
		var classProto = Class.prototype = createProto(parent);

		for (var property in proto) {
			if (util.has(property, proto)) {
				classProto[property] = proto[property];
			}
		}

		proto = null;
		classProto.constructor = Class;
		Class.extend = this.extend;
		return Class;
	};


	/**
	 * sysCaches 系统模块实例缓存队列
	 */
	var sysCaches = {'id': 0, 'length': 0};

	/**
	 * Module 系统核心模块类，所有模块都继承于Module
	 * childs    Array  对应该模块下所有子模块数组的key
	 * childName Object 子模块名称集合映射
	 * childId   Number 子模块id
	 */
	var childs = 'childs', childName = 'childName', childId = 'childId';
	var Module = Root.extend({
		/**
		 * [_collections_ 子模块映射集合]
		 * @type {Object}
		 */
		_collections_: {},

		/**
		 * create 同步创建一个子模块实例
		 * @param  {String} name   [子模块名称，同一模块下创建的子模块名称不能重复]
		 * @param  {Object} Class  [子模块的类，用于生成实例的构造函数]
		 * @param  {Object} config [<可选>子模块配置参数]
		 * @return {Object}        [返回子模块实例，失败返回false]
		 */
		create: function(name, Class, config) {
			if (!util.isString(name)) {
				util.error('Module name must be a String: ', name);
				return false;
			}
			if (!util.isFunc(Class)) {
				util.error('Module Class must be a Function: ', Class);
				return false;
			}
			if (config && !util.isObject(config)) {
				util.error('Module config must be an Object: ', config);
				return false;
			}

			var collections = this._collections_;
			// 建立映射表
			if (!util.has(childs, collections)) {
				// 子模块缓存列表
				collections[childs] = [];
				// 子模块命名索引,在实例中可通过childs遍历子模块
				collections[childName] = this.childs = {};
				// 子模块计数id
				collections[childId] = 0;
			}

			// 判断是否已经创建过
			if (collections[childName][name]) {
				util.error('Module Name already exists: ', name);
				return false;
			}

			// 计数
			collections[childId]++;

			// 生成子模块的实例
			var childInstance = new Class();

			// 记录子模块信息
			var childInfo = {
				// 子模块实路径
				'uri'  : collections.uri + '/' + name,
				// 子模块实例名称
				'name' : name,
				// 子模块实例id
				'cid'  : sysCaches.id++,
				// 父模块实例id
				'pid'  : collections.guid
			};
			childInstance._collections_ = childInfo;

			// 存入系统缓存队列
			sysCaches[childInfo.cid] = childInstance;
			sysCaches.length++;

			// 记录子模块与父模块的对应关系
			collections[childs].push(childInstance);
			collections[childName][name] = childInstance;

			// 调用模块的初始化方法，传入配置config父模块this
			if (util.isFunc(childInstance.init)) {
				childInstance.init(config, this);
			}

			return childInstance;
		}
	});
	exports.Module = Module;


	/**
	 * Container 视图容器类，实现页面容器和组件的通用方法
	 */
	var Container = Module.extend({
		/**
		 * init 初始化方法
		 * @param  {Object} config [模块参数配置]
		 * @param  {Object} parent [父模块对象]
		 */
		init: function(config, parent) {
			this.$config = util.extend(config, {
				// 视图容器DOM元素
				'dom'    : null,
				// DOM元素的目标容器
				'target' : parent,
				// DOM元素的标签
				'tag'    : 'div',
				// DOM元素的class
				'class'  : '',
				// DOM元素的attr
				'attr'   : ''
			});
			// 模块是否已经创建完成
			this.$ready = false;
			// 调用构建方法
			this.build();
		},

		/**
		 * 获取配置选项
		 * @param  {String} name [description]
		 */
		getConfig: function(name) {},

		/**
		 * 设置配置选项
		 * @param {String} name  [配置字段名]
		 * @param {Mix}    value [值]
		 */
		setConfig: function(name, value) {},

		/**
		 * 构建一个空的DOM元素
		 */
		build: function() {
			// 判断是否已创建过
			if (this.$ready) {
				return this;
			}
			this.$ready = true;

			var c = this.getConfig();

			this._domElement = jquery('<'+ c.tag +'>');

			if (c.class) {
				this._domElement.addClass(c.class);
			}

			if (c.attr) {
				this._domElement.attr(c.attr);
			}

			// 插入目标容器
			var target = c.target;
			if (target) {
				this._domElement.appendTo(target);
			}
			// 调用子模块的已创建方法(如果定义了)
			if (util.isFunc(this.afterBuild)) {
				this.afterBuild();
			}
		},

		/**
		 * 返回模块的DOM元素
		 */
		getDOM: function() {
			return this._domElement;
		}
	});
	exports.Container = Container;
















	// ===================== old line ===========================

	var language = require('@core/language');
	var config = require('@boot/config');
	var router = require('@core/router');
	var animate = require('@core/animate');
	var eventHelper = require('@core/eventHelper');
	var dataHelper = require('@core/dataHelper');
	var messager = require('@core/messager');
	var cookie = require('@core/cookie');

	// 应用模块导出
	exports.lang = language;
	exports.animate = animate;
	exports.data = dataHelper;
	exports.event = eventHelper;
	exports.messager = messager;
	exports.cookie = cookie;
	exports.controller = router;

	// 读取系统配置信息(暂支持两层)
	exports.getConfig = function(field) {
		var ret, cArr;
		if (field) {
			cArr = field.toString().split('/');
			if (cArr.length === 2) {
				ret = config[cArr[0]] && config[cArr[0]][cArr[1]];
			} else {
				ret = config[field];
			}
		} else {
			ret = config;
		}
		return ret;
	}
});