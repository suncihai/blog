/**
 * [容器视图控制模块]
 */
define(function( require, exports ){
	var $ = require('jquery');

	/**
	 * [createArchive 创建栏目容器并配置参数]
	 * @param  {[JSON]} config   [容器配置参数]
	 * @return {[Object]}        [返回容器对象]
	 */
	function createArchive( config ) {
		if( $.type( config ) === 'object' ) {
			var tag = 'div',
				cont = $('<'+ tag +'/>'),
				contName = config.container;

			require.async('layout', function( layout ) {
				var DomC = layout.doms.content,
					Sons = DomC.children(),
					i = 0,
					len = Sons.size();

				// 防止重复创建
				for( ; i < len; i++ ) {
					if( Sons.eq(i).attr('archive-name') === contName ) {
						Sons.eq(i).show().siblings().hide();
						return;
					}
				}

				// 添加标识属性
				cont.attr({
					'class': 'P-archives',
					'archive-name': contName
				}).html(contName);

				// 隐藏其他栏目
				Sons.hide();
				DomC.append( cont );
			});
			return cont;
		}
	}
	exports.createArchive = createArchive;
});