// Grunt 配置
module.exports = function( grunt ) {
	'use strict';
	// 语法检测的js文件
	var jsFiles = [
		'boot/*.js',
		'controller/*.js',
		'project/modules/*.js',
		'project/pages/*.js',
		'view/*.js'
	]

	// 配置项目：
	grunt.initConfig({
		// 配置任务
		pkg: grunt.file.readJSON('package.json'),
		less: {
			compile: {
				files: {
					'resources/css/app.css': 'resources/less/app.less'
				}
			}
		},
		cssmin: {
			app: {
				src : 'resources/css/app.css',
				dest: 'resources/css/app.min.css'
            }
		},
		jshint: {
			config: ['Gruntfile.js'],
			client: jsFiles,
			options: {
				asi: true,
				curly: true,
				latedef: true,
				forin: false,
				noarg: false,
				sub: true,
				undef: true,
				unused: 'vars',
				boss: true,
				eqnull: true,
				browser: true,
				laxcomma: true,
				devel: true,
				smarttabs: true,
				predef: [
					'T',
					'_T',
					'module',
					'require',
					'define',
					'console',
					'seajs'
				],
				globals: {
					jQuery: true,
					browser:true
				}
            }
		},
		watch: {
			less: {
				files: ['resources/less/**/*.less', 'resources/less/*/*.less'],
				tasks: ['less:compile']
			},
			client: {
				files: jsFiles,
				tasks: ['jshint:client']
			}
		}
	});

	// 加载任务
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-css');

	// 监听的任务
	grunt.registerTask('watch-all', ['less', 'watch']);
	grunt.registerTask('watch-client', ['jshint:client','watch:client']);

	// 默认任务
	grunt.registerTask('default', ['watch-all']);

	grunt.option('force', true);
};