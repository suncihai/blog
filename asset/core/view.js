define(function( require, exports ){
	var $ = require('jquery');

	/**
	 * [getContainer 页面容器操作并配置参数]
	 * @param  {[JSON]} config   [容器配置参数]
	 * @return {[Object]}        [返回容器对象]
	 */
	exports.getContainer = function( config ) {
		var container = $('<section/>');
		var type = $.type( config );
		switch( type ) {
			// config是JSON时，创建容器
			case 'object': {
				require.async('layout', function( layout ) {
					container.attr({
						'class': 'P-archives',
						'container-name': config.container
					});
					layout.doms.content.append( container );
				});
				return container;
			}; break;
			// config是字符串时，获取容器
			case 'string': {}; break;
		}		
	}
});