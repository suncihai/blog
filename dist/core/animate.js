/**
 * [Animate CSS3动画处理模块]
 */
define(function( require, exports ){
	var util = require('util');

	/**
	 * going 应用CSS3 keframe
	 * @param  {Object}   $elm<必选>      [jquery对象]
	 * @param  {String}   keyframe<必选>  [CSS3动画库的帧名]
	 * @param  {Number}   type<可选>      [循环类型/动画时长]
	 * @param  {Boolean}  notRemove<可选> [运动结束后不移除className]
	 * @param  {Function} callback<可选>  [结束后的回调函数]
	 * @param  {Mix}      scope<可选>     [回调上下文]
	 */
	exports.going = function( $elm, keyframe, type, notRemove, callback, scope ) {
		// 参数检测
		if( !$elm instanceof jQuery ) {
			util.error('绑定的元素必须为jQuery对象');
			return false;
		}
		if( util.isFunc( type ) ) {
			callback = type;
			scope = notRemove;
			type = null;
			notRemove = false;
		}
		if( util.isBoolean( type ) ) {
			callback = notRemove;
			scope = callback;
			notRemove = type;
		}
		if( util.isNumber( type ) && util.isFunc( notRemove ) ) {
			callback = notRemove;
			scope = callback;
			notRemove = false;
		}
		var typeMap = {
			0: 'animated infinite', // 无限循环动画
			1: 'animated',          // 1s的单次动画
			2: 'animated hinge'     // 2s的单次动画
		}
		var animateType = typeMap[type] || typeMap[1];
		var animateCls = keyframe + ' ' + animateType;
		$elm.addClass( animateCls ).one(
			'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
			function() {
				if( !notRemove ) {
					jQuery(this).removeClass( animateCls );
				}
				if( callback ) {
					callback.call( scope, type, animateCls );
				}
			}
		);
	}
});