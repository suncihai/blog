/**
 * [Animate CSS3动画处理模块]
 */
define(function( require, exports ){
	var util = require('util');
	var c = require('@boot/config');

	/**
	 * play 应用CSS3 keyframe
	 * @param  {Object}   $elm<必选>      [jquery对象]
	 * @param  {String}   keyframes<必选> [CSS3动画库的帧名,数组时则随机播放]
	 * @param  {Number}   type<可选>      [循环类型/动画时长]
	 * @param  {Boolean}  remove<可选>    [运动结束移除className]
	 * @param  {Function} callback<可选>  [结束后的回调函数,返回type和keyframe名]
	 * @param  {Mix}      context<可选>   [回调上下文]
	 */
	exports.play = function( $elm, keyframes, type, remove, callback, context ) {
		// 参数检测
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
		if ( util.isString( type ) && util.isFunc( remove ) ) {
			callback = remove;
			context = callback;
			remove = false;
		}

		// 是否为随机播放
		var keyframe = util.isArray( keyframes ) ?
			keyframes.length === 1 ? keyframes[0] : keyframes[util.random( 0, keyframes.length -1 )]
			: keyframes;

		// 动画类型
		var typeMap = {
			'infinite' : 'animated infinite', // 无限循环动画
			'fast'     : 'animated fast',     // 单次动画(快速)
			'middle'   : 'animated',          // 单次动画(中速/默认)
			'slow'     : 'animated slow'      // 单次动画(慢速)
		}
		var animateType = typeMap[type] || typeMap['middle'];
		var animateCls = animateType + ' ' + keyframe;

		$elm.addClass( animateCls ).one(
			c.animationdEnd,
			function( evt ) {
				if ( evt.srcElement !== $elm.get(0) ) {
					return false;
				}
				// 默认结束后移除class
				if ( !remove ) {
					$elm.removeClass( animateCls );
				}
				if ( callback ) {
					if ( !context ) {
						context = window;
					}
					callback.call( context, type, keyframe );
				}
			}
		);
	}
});