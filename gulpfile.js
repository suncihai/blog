var gulp = require('gulp');
// 编译less文件
var less = require('gulp-less');
// js语法检测
var jshint = require('gulp-jshint');
// 文件重命名
var rename = require('gulp-rename');
// css压缩
var minify = require('gulp-minify-css');


// 监听的less文件
var lessFiles = [
	'resources/less/*.less',
	'resources/less/**/*.less'
];
// 监听的js文件
var jsFiles = [
	'boot/*.js',
	'controller/*.js',
	'project/*.js',
	'project/**/*.js',
	'sugar/core/*.js',
	'plugins/router.js',
	'project/**/*.js',
	'project/*.js'
];
// js语法检测配置
var jshintConfig = {
	'asi'       : true,
	'curly'     : true,
	'latedef'   : true,
	'forin'     : false,
	'noarg'     : false,
	'sub'       : true,
	'undef'     : true,
	'unused'    : 'vars',
	'boss'      : true,
	'eqnull'    : true,
	'browser'   : true,
	'laxcomma'  : true,
	'devel'     : true,
	'smarttabs' : true,
	'predef'    : [
		'T',
		'_T',
		'module',
		'require',
		'define',
		'console',
		'seajs'
	],
	'globals'   : {
		'jQuery'  : true,
		'browser' : true
	}
}


// 编译less并压缩
gulp.task('compile', function() {
	gulp.src('resources/less/app.less')
		.pipe(less())
		.pipe(minify())
		.pipe(rename({'suffix': '.min'}))
		.pipe(gulp.dest('resources/css/'));
});


// js代码语法检测
gulp.task('jshint', function() {
	gulp.src(jsFiles)
		.pipe(jshint(jshintConfig))
		.pipe(jshint.reporter('default'));
});


// gulp start 开启任务监听
gulp.task('start', function() {
	// 初始化时开启一次
	gulp.run('compile', 'jshint');
	gulp.run('compile');

	// 监听js文件变化
	gulp.watch(jsFiles, function() {
		gulp.run('jshint');
	});

	// 监听less文件变化
	gulp.watch(lessFiles, function() {
		gulp.run('compile');
	});
});
