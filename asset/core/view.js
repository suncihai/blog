/**
 * [视图控制模块]
 */
define(function( require, exports ){
	var $ = require('jquery');

	/**
	 * [createContainer 创建容器并配置参数]
	 * @param  {[JSON]} config   [容器配置参数]
	 * @return {[Object]}        [返回容器对象]
	 */
	exports.createContainer = function( config ) {
		if( $.type( config ) === 'object' ) {
			var cont = $('<div/>'), contName = config.container;
			require.async('layout', function( layout ) {
				var DomC = layout.doms.content;
				var sons = DomC.children();
				var i = 0, len = sons.size();
				// 判断是否已经创建
				for( ; i < len; i++ ) {
					if( sons.eq(i).attr('container-name') === contName ) {
						return;
					}
				}
				cont.attr({
					'class': 'P-archives',
					'container-name': contName
				});
				DomC.append( cont );
			});
			return cont;
		}
	}
});