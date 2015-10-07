(function(sea, win) {

	var config = {
		'base': '/blog/',
		'paths': {
			// sugar框架目录
			'@sugar'     : 'sugar',
			// 控制器目录
			'@controller':	'controller',
			// 项目目录
			'@project'   : 'project',
				'@pages'  : 'project/pages',
				'@widget' : 'project/widget',
				'@modules': 'project/modules',
			// 其他目录
			'@boot'      : 'boot',
			'@plugins'   : 'plugins'
		},
		'alias': {
			'app'   : '@sugar/core/app.js',
			'util'  : '@sugar/core/util.js',
			'jquery': '@sugar/jquery/jquery.min.js'
		},
		'map': [
			// [/^(.*\.(?:css|js))(.*)$/i, '$1?v=2.0']
		],
		'preload': [
			'resources/css/app.min.css',
			'resources/css/font-awesome.min.css',
			'@plugins/prism/prism.min.css',
			'@plugins/animate/animate.min.css'
		],
		'debug': 0
	};


	/**
	 * 配置文件中的语言标记
	 */
	win._T = function(text) {
		return text;
	};


	/**
	 * APPINIT 初始化配置
	 */
	var i = 0;
	var APPINIT = function() {
		var cb = stepFunc[i++];
		if (cb) {
			cb.apply(win, arguments);
		}
	};

	var lang = null, controller = null;
	var stepFunc = [
		function() {
			// 配置以及加载语言包模块
			sea.config(config);
			sea.use(['@widget/language'], APPINIT);
		},
		function(language) {
			// 多语言模块回调
			lang = language;
			lang.load(APPINIT);
		},
		function() {
			// 加载基础模块
			sea.use([
				'app',
				'@boot/config',
				'@widget/cookie',
				'@widget/animate',
				'@plugins/router'
			], APPINIT);
		},
		function(app, sysConfig, cookie, animate, router) {
			// 将系统配置和基础模块挂载到app下
			var common = {
				'lang'      : lang,
				'cookie'    : cookie,
				'animate'   : animate,
				'controller': router
			};
			app.init({
				// 系统配置数据
				'data'   : sysConfig,
				// ajax最大同时请求数
				'maxQuery': 7,
				// ajax响应超时时间
				'timeout' : 9288,
				// 视图模板文件的子模块标记名称
				'mName'   : 'm-name',
				// 视图模块文件的子模块标记路径
				'mModule' : 'm-module'
			}, common);

			// app是否作为全局变量调试
			if (app.config('debug')) {
				win.app = app;
			}

			controller = router;

			// 创建整体布局layout模块
			app.core.createAsync('layout', '@project/layout.base', {
				'target': app.jquery('body').empty()
			}, APPINIT);
		},
		function() {
			// 启动路由监听
			controller.start();

			// 系统悬浮提示模块
			sea.use('@modules/tooltip', function(tp) {
				if (!app.tooltip) {
					app.tooltip = tp;
				}
			});
		}
	];

	// 浏览器特性判断
	sea.use('/blog/project/widget/character', function(b) {
		if (b.j()) {
			return false;
		}

		// 初始化开始
		APPINIT();
	});

})(seajs, window);