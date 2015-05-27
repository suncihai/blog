/**
 * [Animate CSS3动画处理模块]
 */
define(function( require, exports ){
	var util = require('util');
	var c = require('@data/config');

	/**
	 * play 应用CSS3 keframe
	 * @param  {Object}   $elm<必选>      [jquery对象]
	 * @param  {String}   keyframes<必选> [CSS3动画库的帧名,数组时则随机播放]
	 * @param  {Number}   type<可选>      [循环类型/动画时长, 0无限循环 1快 2中 3慢]
	 * @param  {Boolean}  remove<可选>    [运动结束移除className]
	 * @param  {Function} callback<可选>  [结束后的回调函数,返回type和keyframe名]
	 * @param  {Mix}      context<可选>   [回调上下文]
	 */
	exports.play = function( $elm, keyframes, type, remove, callback, context ) {
		// 参数检测
		if ( !$elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}
		if ( util.isFunc( type ) ) {
			callback = type;
			context = remove;
			type = null;
			remove = false;
		}
		if ( util.isBoolean( type ) ) {
			callback = remove;
			context = callback;
			remove = type;
		}
		if ( util.isNumber( type ) && util.isFunc( remove ) ) {
			callback = remove;
			context = callback;
			remove = false;
		}

		// 是否为随机播放
		var keframe = util.isArray( keyframes ) ?
			keyframes.length === 1 ? keyframes[0] : keyframes[util.random( 0, keyframes.length -1 )]
			: keyframes;

		// TODO：改成字符串键值
		var typeMap = {
			0: 'animated infinite', // 无限循环动画
			1: 'animated fast',     // 单次动画(快速)
			2: 'animated',          // 单次动画(中速/默认)
			3: 'animated slow'      // 单次动画(慢速)
		}
		var animateType = typeMap[type] || typeMap[2];
		var animateCls = animateType + ' ' + keframe;
		$elm.addClass( animateCls ).removeAttr('ended').one(
			c.animationdEnd,
			function() {
				// 默认结束后移除class
				if ( !remove ) {
					jQuery(this).attr('ended', keframe).removeClass( keframe );
				}
				if ( callback ) {
					if ( !context ) {
						context = window;
					}
					callback.call( context, type, keframe );
				}
			}
		);
	}

	/**
	 * hasPlaying 判断$elm是否有未结束的动画正在进行
	 * 有未结束的动画返回true, 没有返回false
	 * @param  {Object}   $elm<必选>  [jquery对象]
	 */
	exports.hasPlaying = function( $elm ) {
		$elm.one( c.animationdEnd, function() {
			return false;
		});
		return true;
	}
});