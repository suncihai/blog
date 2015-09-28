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
				'@common' : 'project/common',
				'@pages'  : 'project/pages',
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


	// 配置文件中的语言标记
	function _T(text) {
		return text;
	}
	win._T = _T;


	/**
	 * appInit 初始化配置
	 */
	var i = 0;
	var appInit = function() {
		var cb = stepFunc[i++];
		if (cb) {
			cb.apply(win, arguments);
		}
	};

	var lang = null;
	var stepFunc = [
		function() {
			// 配置以及语言包
			sea.config(config);
			sea.use(['@common/language'], appInit);
		},
		function(language) {
			// 多语言模块回调
			lang = language;
			lang.load(appInit);
		},
		function() {
			// 加载基础模块
			sea.use([
				'app',
				'@boot/config',
				'@common/cookie',
				'@common/animate',
				'@plugins/router',
				'@project/layout'
			], appInit);
		},
		function(app, config, cookie, animate, router, layout) {
			// 将系统配置和基础模块挂载到app下
			app.init(config, {
				'lang'      : lang,
				'cookie'    : cookie,
				'animate'   : animate,
				'controller': router
			});

			// app是否作为全局变量调试
			if (app.config('debug')) {
				win.app = app;
			}

			// 创建整体布局layout模块
			app.core.create('layout', layout.base, {
				'target': app.jquery('body').empty()
			});

			// 启动路由监听
			router.start();
		}
	];


	// 浏览器特性判断
	sea.use('/blog/project/common/character', function(b) {
		if (b.j()) {
			return false;
		}
		// 初始化开始
		appInit();
	});

})(seajs, window);