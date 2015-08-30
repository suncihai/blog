/**
 * ========================================
 * 框架核心应用模块，基础模块及其拓展的实现
 * ========================================
 */
define(function(require, exports, module) {
	var UDF, WIN = window;
	var util = exports.util = require('./util');
	var jquery = require('../jquery/jquery-1.8.3.min');


	/*
	 * createProto 创建并返回一个拥有指定原型的原型对象
	 * @param  {Object} proto   [指定的原型对象]
	 * @return {Object} pointer [指向proto原型的原型对象]
	 */
	function createProto(proto) {
		// 返回的原型指针对象
		var pointer = null;
		var Obc = Object.create;
		var standard = util.isFunc(Obc);
		var Foo = !standard ? function() {} : null;

		if (standard) {
			pointer = Obc(proto);
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

		/**
		 * 超类，实现在子类中对父类的调用
		 * @param {String} method [调用父类的方法]
		 * @param {Object} args   [传入的参数数组]
		 */
		function Super(method, args) {
			var func = parent[method];
			if (util.isFunc(func)) {
				func.apply(this, args);
			}
		}

		/**
		 * 返回(继承后)的类
		 * @param {Object} config [类生成实例的配置]
		 */
		function Class(config) {};
		var classProto = Class.prototype = createProto(parent);

		// 写入自身属性或方法
		for (var property in proto) {
			if (util.has(property, proto)) {
				classProto[property] = proto[property];
			}
		}

		proto = null;
		classProto.Super = Super;
		classProto.constructor = Class;
		Class.extend = this.extend;
		return Class;
	};


	/**
	 * merge 子父模块的配置合并，子模块覆盖父模块同名配置
	 * @param  {Object} childConfig  [子类模块配置参数]
	 * @param  {Object} parentConfig [父类模块配置参数]
	 * @return {Object}              [合并后的配置参数]
	 */
	function merge(childConfig, parentConfig) {
		if (!util.isObject(childConfig)) {
			childConfig = {};
		}
		if (!util.isObject(parentConfig)) {
			parentConfig = {};
		}

		return util.extend(parentConfig, childConfig);
	}
	exports.merge = merge;


	/**
	 * appConfig 设置/读取配置对象
	 * @param  {Object} configData [配置名称, 使用/分隔层次]
	 * @param  {String} name       [配置名称, 使用/分隔层次]
	 * @param  {Mix}    value      [不设为读取配置信息, null为删除配置, 其他为设置值]
	 * @return {Mix}               [返回读取的配置值, 返回false操作失败]
	 */
	function appConfig(configData, name, value) {
		if (!configData) {
			configData = appConfig.config;
		}
		var set = (value !== UDF);
		var remove = (value === null);
		var data = configData;

		if (name) {
			var ns = name.split('/');
			while (ns.length > 1 && util.has(ns[0], data)) {
				data = data[ns.shift()];
			}
			if (ns.length > 1) {
				// 设置值, 但是父层配置不存在
				if (set) {
					return false;
				}
				// 父层已经删除
				if (remove)	{
					return true;
				}
				// 值不存在, 不能获取
				return UDF;
			}
			name = ns[0];
		}
		// 根节点不能删除
		else {
			return data;
		}

		if (set) {
			data[name] = value;
			return true;
		}
		else if (remove) {
			data[name] = null;
			delete data[name];
			return true;
		}
		else {
			return data[name];
		}
	}
	// 全局系统配置对象
	appConfig.config = {};
	// 导出作为全局系统配置函数
	exports.config = appConfig;


	/**
	 * Event 事件类（处理视图模块的事件绑定与取消）
	 * @param {Object} context [事件执行环境，暂不用到，可作为模块属性时传入]
	 */
	function Event(context) {
		this.context = context;
	};
	Event.prototype = {
		constructor: Event,

		/**
		 * 为元素添加绑定事件
		 * @param  {Object}   elm       [绑定事件的元素]
		 * @param  {String}   _event    [绑定的事件，多个事件用空格分开，或者数组形式]
		 * @param  {Mix}      data      [<可选>传递到回调函数的额外数据]
		 * @param  {Function} callback  [回调函数, 回调参数evt, elm]
		 * @return {Boolean}            [result]
		 */
		bind: function(elm, _event, data, callback) {
			var arglen = arguments.length;
			var context = this.context || this;
			var ret;

			if (!util.isJquery(elm)) {
				return false;
			}

			// 事件为数组形式
			if (util.isArray(_event)) {
				_event = _event.join(' ');
			}

			// 不传data
			if (arglen === 3) {
				callback = data;
				data = null;
			}

			// callback为属性值
			if (util.isString(callback)) {
				callback = context[callback];
			}

			// 不合法的回调函数
			if (!util.isFunc(callback)) {
				return false;
			}

			elm.bind(_event, data, function(ev) {
				ret = callback.call(context, ev, this);
				// 阻止默认事件和冒泡
				if (ret === false) {
					ev.preventDefault();
					ev.stopPropagation();
				}
			});

			return true;
		},

		/**
		 * 从元素上移除bind添加的事件处理函数
		 * @param  {Object}   elm      [取消绑定事件的元素]
		 * @param  {String}   _event   [<可选>绑定的事件，可为多个事件用空格分开、数组形式和命名空间]
		 * @param  {Function} callback [<可选>指定事件取消绑定的函数名]
		 * @return {Boolean}           [result]
		 */
		unbind: function(elm, _event, callback) {
			var args = util.argumentsToArray(arguments);

			if (!util.isJquery(elm)) {
				return false;
			}

			args.shift();

			elm.unbind.apply(elm, args);

			return true;
		},

		/**
		 * 代理事件
		 * @param  {Object}   elm      [绑定事件的元素]
		 * @param  {String}   _event   [绑定的事件，多个事件用空格分开，或者数组形式]
		 * @param  {String}   selector [<可选>选择器，可为单个元素或者元素数组]
		 * @param  {Mix}      data     [<可选>传递到回调函数的额外数据]
		 * @param  {Function} callback [回调函数，回调参数evt, elm]
		 * @return {Boolean}           [result]
		 */
		proxy: function(elm, _event, selector, data, callback) {
			var arglen = arguments.length;
			var context = this.context || this;
			var ret;

			if (!util.isJquery(elm)) {
				return false;
			}

			// 事件为数组形式
			if (util.isArray(_event)) {
				_event = _event.join(' ');
			}

			// selector和data传一个
			if (arglen === 4) {
				callback = data;
				if (!util.isString(selector)) {
					data = selector;
					selector = null;
				}
				else {
					data = null;
				}
			}
			// selector和data都不传
			else if (arglen === 3) {
				callback = selector;
				data = null;
				selector = null;
			}

			// callback为属性值
			if (util.isString(callback)) {
				callback = context[callback];
			}

			// 不合法的回调函数
			if (!util.isFunc(callback)) {
				return false;
			}

			elm.on(_event, selector, data, function(ev) {
				ret = callback.call(context, ev, this);
				// 阻止默认事件和冒泡
				if (ret === false) {
					ev.preventDefault();
					ev.stopPropagation();
				}
			});

			return true;
		},

		/**
		 * 移除proxy添加的事件处理函数
		 * @param  {Object}   elm      [取消绑定事件的元素]
		 * @param  {String}   _event   [<可选>绑定的事件，可为多个事件用空格分开、数组形式和命名空间]
		 * @param  {Function} callback [<可选>指定事件取消绑定的函数名]
		 * @return {Boolean}           [result]
		 */
		unProxy: function(elm, _event, callback) {
			var args = util.argumentsToArray(arguments);

			if (!util.isJquery(elm)) {
				return false;
			}

			args.shift();

			elm.off.apply(elm, args);

			return true;
		}
	};
	// 事件处理实例
	var events = new Event();


	/**
	 * Messager 消息类（处理模块间通信）
	 * 消息的冒泡/广播方式都先触发消息接收事件函数，再将消息逐层上/下发
	 * 默认接收消息onMessage, 默认全部发送完毕回调onMessageSendOut
	 */
	function Messager() {
		/**
		 * 是否正在发送消息
		 * @type {Bool}
		 */
		this.busy = false;
		/**
		 * 等待发送的消息队列
		 * @type {Array}
		 */
		this.queue = [];
	};
	Messager.prototype = {
		constructor: Messager,

		/**
		 * 创建一条消息
		 * @param  {Object} sender [发送消息的模块实例]
		 * @param  {String} name   [发送的消息名称]
		 * @param  {Mix}    param  [<可选>附加消息参数]
		 * @return {Object}        [消息对象]
		 */
		_create: function(sender, name, param) {
			var message = {
				// 消息发起模块
				'form'    : sender,
				// 消息目标模块
				'target'  : null,
				// 该消息被传递的次数
				'count'   : 0,
				// 消息名称
				'name'    : name,
				// 消息参数
				'param'   : param,
				// 接受消息模块的调用方法 on + 首字母大写
				'method'  : 'on' + util.ucFirst(name),
				// 接受消息模块的返回值
				'returns' : null
			};
			return message;
		},

		/**
		 * 触发接收消息模块实例的处理方法
		 * @param  {Object} receiver [接收消息的模块实例]
		 * @param  {Mix}    msg      [消息体（内容）]
		 * @param  {Mix}    returns  [返回给发送者的数据]
		 * @return {Mix}             [returns]
		 */
		_trigger: function(receiver, msg, returns) {
			// 接收者对该消息的接收方法
			var func = receiver[msg.method];
			// 标识消息的发送目标
			msg.target = receiver;

			// 触发接收者的消息处理方法，若未定义则默认为onMessage
			if (util.isFunc(func)) {
				returns = func.call(receiver, msg);
				msg.count++;
			}
			else if (util.isFunc(receiver.onMessage)) {
				returns = receiver.onMessage.call(receiver, msg);
				msg.count++;
			}

			return returns;
		},

		/**
		 * 通知发送者消息已被全部接收者接收完毕
		 * @param  {Mix}      msg      [消息体（内容）]
		 * @param  {Function} callback [通知发送者的回调函数]
		 * @param  {Object}   context  [执行环境]
		 * @return {Boolean}           [result]
		 */
		_notifySend: function(msg, callback, context) {
			// callback为null时触发默认事件
			if (!callback) {
				callback = context.onMessageSendOut;
			}

			// callback为属性值
			if (util.isString(callback)) {
				callback = context[callback];
			}

			// 合法的回调函数
			if (util.isFunc(callback)) {
				callback.call(context, msg);
			}

			// 接着发送队列中的消息
			if (this.queue.length) {
				setTimeout(this._sendQueue, 0);
			}
			else {
				this.busy = false;
			}

			return true;
		},

		/**
		 * 发送消息队列中的消息
		 */
		_sendQueue: function() {
			// 取出消息队列最前面的一条发送请求
			var request = this.queue.shift();
			this.busy = false;

			if (!request) {
				return false;
			}

			// 消息类型
			var type = request.shift();
			// 消息方法
			var func = this[type];

			if (util.isFunc(func)) {
				func.call(this, request);
			}
		},

		/**
		 * 冒泡（由下往上）方式发送消息，由子模块发出，所有父模块接收
		 * @param  {Object}   sender   [发送消息的子模块实例]
		 * @param  {String}   name     [发送的消息名称]
		 * @param  {Mix}      param    [<可选>附加消息参数]
		 * @param  {Function} callback [<可选>发送完毕的回调函数，可在回调中指定回应数据]
		 * @param  {Object}   context  [执行环境]
		 */
		fire: function(sender, name, param, callback, context) {
			// 是否处于忙碌状态
			if (this.busy) {
				this.queue.push(['fire', sender, name, param, callback, context]);
				return false;
			}
			this.busy = true;

			var senderCls = sender._collections;
			// 发送者全局实例缓存id
			var id = senderCls && senderCls.id;
			// 创建消息
			var msg = this._create(sender, name, param);
			// 消息接收者，先从自身开始接收
			var receiver = sender;
			var returns;

			// 循环触发sender的子模块接收消息方法
			while (receiver) {
				returns = this._trigger(receiver, msg);
				// 接收消息方法返回false不再继续冒泡
				if (returns === false) {
					break;
				}
				msg.form = receiver;
				receiver = receiver.getParent();
			}

			return this._notifySend(msg, callback, context);
		},

		/**
		 * 广播（由上往下）方式发送消息，由父模块发出，所有子模块接收
		 */
		broadcast: function(sender, name, param, callback, context) {
			// 是否处于忙碌状态
			if (this.busy) {
				this.queue.push(['broadcast', sender, name, param, callback, context]);
				return false;
			}
			this.busy = true;

			var senderCls = sender._collections;
			// 发送者全局实例缓存id
			var id = senderCls && senderCls.id;
			// 创建消息
			var msg = this._create(sender, name, param);
			// 消息接收者集合，先从自身开始接收
			var receivers = [sender];
			var receiver, returns;

			while (receivers.length) {
				receiver = receivers.shift();
				returns = this._trigger(receiver, msg);
				// 接收消息方法返回false不再继续广播
				if (returns === false) {
					break;
				}
				receivers.push.apply(receivers, receiver.getChilds(true));
			}

			return this._notifySend(msg, callback, context);
		}
	};
	// 模块消息通信实例
	var messager = new Messager();


	/**
	 * Ajax数据请求处理类
	 */
	function Ajax() {
		/**
		 * 最大同时请求数
		 * @type {Number}
		 */
		this.maxQuery = 5;
		/**
		 * 等待请求的缓存队列
		 * @type {Object}
		 */
		this.queue = {};
	};
	Ajax.prototype = {
		constructor: Ajax,

		/**
		 * 发送一个请求
		 * @param  {String}   type     [请求类型]
		 * @param  {String}   uri      [请求地址]
		 * @param  {Mix}      data     [请求数据]
		 * @param  {Function} callback [请求回调]
		 */
		_send: function(type, uri, data, callback) {},

		/**
		 * GET请求 @todo: 支持允许在body上带参数
		 * @param  {String}   uri      [请求地址]
		 * @param  {Json}     param    [请求参数]
		 * @param  {Function} callback [请求回调]
		 */
		get: function(uri, param, callback) {
			this._send('GET', uri + util.parse(param), null, callback);
		},

		/**
		 * POST请求
		 * @param  {String}   uri      [请求地址]
		 * @param  {Json}     param    [请求参数]
		 * @param  {Function} callback [请求回调]
		 */
		post: function(uri, param, callback) {}
	};
	// 导出数据请求处理实例
	exports.ajax = new Ajax();


	/**
	 * sysCaches 系统模块实例缓存队列
	 * 模块的唯一id对应模块的实例
	 */
	var sysCaches = {'id': 1, 'length': 0};
	exports.sysCaches = sysCaches;

	/**
	 * Module 系统模块基础类，实现所有模块的通用方法
	 * childArray Array  对应该模块下所有子模块数组字段
	 * childMap   Object 子模块名称集合映射字段
	 */
	var childArray = 'childArray', childMap = 'childMap';
	var Module = Root.extend({
		/**
		 * _collections 子模块映射集合
		 * @type {Object}
		 */
		_collections: {},

		/**
		 * 同步创建一个子模块实例
		 * @param  {String} name   [子模块名称，同一模块下创建的子模块名称不能重复]
		 * @param  {Class}  Class  [子模块的类，用于生成实例的构造函数]
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

			var collections = this._collections;
			// 建立映射表
			if (!util.has(childArray, collections)) {
				// 子模块缓存列表
				collections[childArray] = [];
				// 子模块命名索引
				collections[childMap] = {};
			}

			// 判断是否已经创建过
			if (collections[childMap][name]) {
				util.error('Module Name already exists: ', name);
				return false;
			}

			// 生成子模块的实例
			var childInstance = new Class(config);

			// 记录子模块信息和父模块的对应关系
			var childInfo = {
				// 子模块实例名称
				'name' : name,
				// 子模块实例id
				'id'   : sysCaches.id++,
				// 父模块实例id，-1为最父层模块
				'pid'  : collections.id || -1
			};
			childInstance._collections = childInfo;

			// 存入系统缓存队列
			sysCaches[childInfo.id] = childInstance;
			sysCaches.length++;

			// 缓存子模块集合
			collections[childArray].push(childInstance);
			collections[childMap][name] = childInstance;

			// 调用模块的初始化方法
			if (util.isFunc(childInstance.init)) {
				childInstance.init(config, this);
			}

			return childInstance;
		},

		/**
		 * 异步创建一个子模块实例
		 * @param  {String}   name     [子模块名称，同一模块下创建的子模块名称不能重复]
		 * @param  {String}   uri      [子模块文件路径，支持.获取文件特定实例]
		 * @param  {Object}   config   [<可选>子模块配置参数]
		 * @param  {Function} callback [<可选>子模块实例创建后的回调函数]
		 */
		createAsync: function(name, uri, config, callback) {},

		/**
		 * 获取当前模块的父模块对象
		 */
		getParent: function() {
			var cls = this._collections;
			var pid = cls && cls.pid;
			return sysCaches[pid] || null;
		},

		/**
		 * 获取指定名称的子模块对象
		 * @param  {String} name [子模块名称]
		 * @return {Object}      [目标对象，子模块不存在返回null]
		 */
		getChild: function(name) {
			var cls = this._collections;
			return cls && cls[childMap] && cls[childMap][name] || null;
		},

		/**
		 * 返回当前模块的子模块集合
		 * @param  {Boolean} returnArray [返回的集合是否为数组形式，否则返回映射结构]
		 * @return {Mix}                 [对象或者数组]
		 */
		getChilds: function(returnArray) {
			var cls = this._collections;
			returnArray = util.isBoolean(returnArray) && returnArray;
			return returnArray ? (cls[childArray] || []) : (cls[childMap] || {});
		},

		/**
		 * 删除指定子模块在当前模块的记录
		 * @param  {String}  name [子模块名称]
		 * @return {Boolean}      [result]
		 */
		_removeChild: function(name) {
			var cls = this._collections;
			var cMap = cls[childMap] || {};
			var cArray = cls[childArray] || [];
			var child = cMap[name];
			if (!child) {
				return false;
			}
			for (var i = 0; i < cArray.length; i++) {
				if (cArray[i].id === child.id) {
					delete cMap[name];
					cArray.splice(i, 1);
					break;
				}
			}
			return true;
		},

		/**
		 * 模块自身销毁函数，只删除缓存队列中的记录和子模块集合
		 * @param  {Mix}  silent [是否向父模块发送销毁消息]
		 */
		destroy: function(silent) {
			var cls = this._collections;

			// 调用销毁前函数，可用于必要的数据保存
			if (util.isFunc(this.beforeDestroy)) {
				this.beforeDestroy();
			}

			// 递归调用子模块的销毁函数
			var childs = this.getChilds(true);
			for (var i = 0; i < childs.length; i++) {
				if (util.isFunc(childs[i].destroy)) {
					childs[i].destroy(-1);
				}
			}

			// 从父模块删除（递归调用时不需要）
			var parent = this.getParent();
			if (silent !== -1 && parent) {
				parent._removeChild(cls.name);
			}

			// 从缓存队列中销毁相关记录
			var id = cls.id;
			if (util.has(id, sysCaches)) {
				delete sysCaches[id];
				sysCaches.length--;
			}

			// 调用销毁后函数，可用于销毁界面和事件
			if (util.isFunc(this.afterDestroy)) {
				this.afterDestroy();
			}
		},

		/**
		 * 修正作用域的定时器
		 * @param {Function} callback [定时器回调函数]
		 * @param {Number}   time     [回调等待时间（毫秒）]
		 * @param {Mix}      param    [<可选>回调函数的参数]
		 */
		setTimeout: function(callback, time, param) {
			var self = this;
			time = time || 0;

			// callback为属性值
			if (util.isString(callback)) {
				callback = this[callback];
			}

			// 不合法的回调函数
			if (!util.isFunc(callback)) {
				return null;
			}

			return setTimeout(function() {
				callback.call(self, param);
				self = callback = time = param = null;
			}, time);
		},

		/**
		 * 冒泡（由下往上）方式发送消息，由子模块发出，所有父模块接收
		 * @param  {String}   name     [发送的消息名称]
		 * @param  {Mix}      param    [<可选>附加消息参数]
		 * @param  {Function} callback [<可选>发送完毕的回调函数，可在回调中指定回应数据]
		 * @return {Boolean}           [result]
		 */
		fire: function(name, param, callback) {
			if (!util.isString(name)) {
				return false;
			}

			// 不传param
			if (util.isFunc(param)) {
				callback = param;
				param = null;
			}

			// callback为属性值，加上on前缀
			if (util.isString(callback)) {
				callback = 'on' + util.ucFirst(callback);
				callback = this[callback];
			}

			// 不传callback
			if (!callback) {
				callback = null;
			}

			return messager.fire(this, name, param, callback, this);
		},

		/**
		 * 广播（由上往下）方式发送消息，由父模块发出，所有子模块接收
		 */
		broadcast: function(name, param, callback) {
			if (!util.isString(name)) {
				return false;
			}

			// 不传param
			if (util.isFunc(param)) {
				callback = param;
				param = null;
			}

			// callback为属性值，加上on前缀
			if (util.isString(callback)) {
				callback = 'on' + util.ucFirst(callback);
				callback = this[callback];
			}

			// 不传callback
			if (!callback) {
				callback = null;
			}

			return messager.broadcast(this, name, param, callback, this);
		}
	});
	exports.Module = Module;


	/**
	 * Core 核心模块
	 */
	var Core = Module.extend({
		/**
		 * 获取最父层模块
		 * @param  {String} name [模块实例名称]
		 * @return {Object}      [模块实例]
		 */
		get: function(name) {
			return this.getChild(name);
		}
	});
	exports.core = new Core();


	/**
	 * Container 视图容器类，实现页面容器组件的通用方法
	 */
	var Container = Module.extend({
		/**
		 * init 模块初始化方法
		 * @param  {Object} config [模块参数配置]
		 * @param  {Object} parent [父模块对象]
		 */
		init: function(config, parent) {
			this._config = merge(config, {
				// 视图元素的目标容器
				'target' : null,
				// 视图元素的标签
				'tag'    : 'div',
				// 视图元素的class
				'class'  : '',
				// 视图元素的attr
				'attr'   : null
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
		getConfig: function(name) {
			return appConfig(this._config, name);
		},

		/**
		 * 设置配置选项
		 * @param {String} name  [配置字段名]
		 * @param {Mix}    value [值]
		 */
		setConfig: function(name, value) {
			return appConfig(this._config, name, value);
		},

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

			this._domObject = jquery('<'+ c.tag +'/>');

			if (c.class) {
				this._domObject.addClass(c.class);
			}

			if (c.attr) {
				this._domObject.attr(c.attr);
			}

			// 插入目标容器
			var target = c.target;
			if (target) {
				this._domObject.appendTo(target);
			}

			// 调用子模块的afterBuild方法
			if (util.isFunc(this.afterBuild)) {
				this.afterBuild();
			}
		},

		/**
		 * 返回/查找视图模块的DOM元素
		 * @param  {String}    selector [子元素选择器，空则返回模块容器DOM]
		 * @return {DOMObject}          [jQuery DOM对象]
		 */
		getDOM: function(selector) {
			return selector && util.isString(selector) ? this._domObject.find(selector) : this._domObject;
		},

		/**
		 * 为元素添加绑定事件
		 */
		bind: function() {
			return events.bind.apply(this, arguments);
		},

		/**
		 * 从元素上移除bind添加的事件处理函数
		 */
		unbind: function() {
			return events.unbind.apply(this, arguments);
		},

		/**
		 * 代理事件
		 */
		proxy: function() {
			return events.proxy.apply(this, arguments);
		},

		/**
		 * 移除proxy添加的事件处理函数
		 */
		unProxy: function() {
			return events.unProxy.apply(this, arguments);
		},

		/**
		 * 模块销毁后的回调函数，移除视图界面和取消所有事件的绑定
		 */
		afterDestroy: function() {
			var domObject = this._domObject;
			if (domObject) {
				// 取消所有事件
				this.unbind(domObject);
				domObject.find('*').unbind();
				// 销毁DOM对象
				domObject.remove();
				domObject = null;
			}
		}
	});
	exports.Container = Container;


	/**
	 * 初始化接口，可将全局配置文件引入
	 * @param  {Object} config [系统全局配置文件]
	 */
	exports.init = function(config) {
		appConfig.config = config;
		return this;
	}












	// ===================== old line ===========================

	var language = require('@core/language');
	var config = require('@boot/config');
	var router = require('@core/router');
	var animate = require('@core/animate');
	var eventHelper = require('@core/eventHelper');
	var dataHelper = require('@core/dataHelper');
	// var messager = require('@core/messager');
	var cookie = require('@core/cookie');

	// 应用模块导出
	exports.lang = language;
	exports.animate = animate;
	exports.data = dataHelper;
	exports.event = eventHelper;
	// exports.messager = messager;
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