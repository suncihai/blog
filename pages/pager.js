/**
 * [分页模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');

	/**
	 * buildPager 生成分页器
	 * @param  {JSON} opt      [设置选项]
	 * @param  {JSON} callback [回调函数]
	 * @return {Number}        [选中的页码]
	 */
	exports.buildPager = function( opt, callback ) {
		if( !util.isObject( opt ) || !util.isFunc( callback ) ) {
			util.error('param type error!');
			return false;
		}
		// 分页信息
		var dom = opt.target;  // 分页器的添加位置
		var page = opt.page;   // 当前页码
		var pages = opt.pages; // 总页数
		var total = opt.total; // 总条数
		// 分页器HTML结构
		var html = [
			'<div class="M-pager">',
				'<input class="M-pagerPN M-pagerPrev" type="button"/>',
				'<div class="M-pagerList"/>',
				'<input class="M-pagerPN M-pagerNext" type="button"/>',
				'<div class="M-pagerInfo"/>',
			'</div>'
		].join('');
		$(html).appendTo( dom );
		var doms = {
			'prev': $('.M-pagerPrev', dom),
			'list': $('.M-pagerList', dom),
			'next': $('.M-pagerNext', dom),
			'info': $('.M-pagerInfo', dom)
		}
		doms.prev.attr('value', '<');
		doms.next.attr('value', '>');

		// 生成页码
		for( var i = 1; i < pages + 1; i++ ) {
			var item = '<input type="button" class="M-pagerItem" value="'+ i +'" data-type="'+ i +'"/>';
			$(item).appendTo( doms.list );
		}

		// 激活当前页码
		$('.M-pagerItem').eq(page-1).addClass('M-pagerAct');

		// 翻页点击事件
		$('.M-pagerPN').on( 'click', function() {
			var id = 'next';
			if( $(this).hasClass('M-pagerPrev') ) {
				id = 'prev';
			}
			callback.call( this, id );
			return false;
		});

		// 页码点击事件
		$('.M-pager').on( 'click', 'input', function() {
			var id = $(this).attr('data-type');
			if( id === page ) {
				return false;
			}
			$(this).addClass('M-pagerAct').siblings('.M-pagerItem').removeClass('M-pagerAct')
			callback.call( this, id );
		});
	}
});