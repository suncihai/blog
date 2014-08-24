// Grunt 配置
module.exports = function( grunt ) {
	'use strict';
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
		jshint: {
			config: ['Gruntfile.js'],
            client: ['module/*.js', 'dist/core/*.js'],
            options: {
				curly: true,	// 语句必须紧随其后的代码块
				latedef: true,	// 确保变量和函数在使用之前声明
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
				files: ['resources/less/*.less'],
				tasks: ['less:compile']
			}
		}
	});

	// 加载任务
	grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// 监听的任务
	grunt.registerTask('watch-all', ['less', 'watch']);
	// grunt.registerTask('watch-client', ['jshint:client','watch:client']);

	// 默认任务
	grunt.registerTask('default', ['watch-all']);

	grunt.option('force', true);
};