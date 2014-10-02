define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var layout = require('layout');
	var C = require('@core/config');
	var pager = require('@pages/pager');

	var dc = C.dataCenter;

	exports.onMain = function( data ) {
		var dom = data.dom;
		$([
			'<div class="P-archive-list"/>',
			'<div class="P-archive-pager"/>'
		].join('')).appendTo( dom );
		var listBox = $('.P-archive-list', dom);
		var pagerBox = $('.P-archive-pager', dom);
		var url = dc.listarchives;
		var requestParam = util.mergeParam( C.archiveOption, {
			'catid': C.cat[data.name]
		});

		// 设置标题
		layout.setTitle( C.archiveTitle[data.name] );

		// 拉取数据
		$.ajax({
			'url': url,
			'method': 'get',
			'dataType': 'json',
			'data': requestParam,
			'success': fnSuccess,
			'error': fnError
		});

		/**
		 * fnSuccess 请求成功
		 * @param  {JSON} res [返回数据]
		 * @return {NULL}     [无返回值]
		 */
		function fnSuccess( res ) {
			if( !res.success ) {
				dom.html('拉取数据似乎出了点问题~');
				return;
			}
			// 循环生成列表
			listBox.empty();
			pagerBox.empty();
			$.each( res.result.items, createSections );
			this.page = res.result.page;
			// 分页器
			pager.buildPager({
				'target': pagerBox,
				'page': res.result.page,
				'pages': res.result.pages,
				'total': res.result.total
			}, afterPagerSelect);
		}

		/**
		 * createSections 循环生成列表
		 * @param  {Number} idx  [序号]
		 * @param  {Object} item [选项对象]
		 * @return {NULL}        [无返回值]
		 */
		function createSections( idx, item ) {
			var sections = [];
			sections.push([
				'<section list-id="'+ idx +'">',
					'<h2><a href="#'+ data.name +'/'+ item.id +'" title="'+ item.title +'">'+ item.title +'</a></h2>',
					'<div class="info">',
						'<span class="time">'+ item.publishDate +'</span>',
					'</div>',
					'<article>'+ item.content +' ……</article>',
				'</section>'
			].join(''));
			listBox.append( sections.join('') );
		}

		/**
		 * afterPagerSelect 页码激活事件
		 * @param  {Number} page [激活的页码]
		 * @return {NULL}        [无返回值]
		 */
		function afterPagerSelect( page ) {
			var newParam = util.mergeParam( requestParam, {
				'page': page
			});
			// 重新拉取数据
			$.ajax({
				'url': url,
				'method': 'get',
				'dataType': 'json',
				'data': newParam,
				'success': fnSuccess,
				'error': fnError
			});
		}

		/**
		 * fnError 请求失败
		 * @param  {JSON} msg [错误信息]
		 * @return {NULL}     [无返回值]
		 */
		function fnError( msg ) {
			util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
		}
	}
});