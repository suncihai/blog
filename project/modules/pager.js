/**
 * [分页模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var eventHelper = require('@core/eventHelper');

	// 传统的的分页方式
	var Pager = {
		init: function( config, callback, scope ) {
			if( !util.isObject( config ) || !util.isFunc( callback ) ) {
				util.error('参数错误!');
				return false;
			}
			this.$config = config || {};
			this.callback = callback;
			this.$scope = scope || window;
			this.build();
		},

		// 创建分页器
		build: function() {
			var config = this.$config;
			var dom = config.target;  // 分页器的添加位置

			// 分页器HTML结构
			var html = [
				'<div class="M-pager">',
					'<input class="M-pagerPN M-pagerPrev" type="button" title="上一页"/>',
					'<div class="M-pagerList"/>',
					'<input class="M-pagerPN M-pagerNext" type="button" title="下一页"/>',
					'<div class="M-pagerInfo"/>',
				'</div>'
			].join('');
			$(html).appendTo( dom );

			// dom缓存
			var doms = this.$doms = {
				'prev': $('.M-pagerPrev', dom),
				'list': $('.M-pagerList', dom),
				'next': $('.M-pagerNext', dom),
				'info': $('.M-pagerInfo', dom)
			}

			doms.prev.attr('value', '<');
			doms.next.attr('value', '>');

			// 生成页码并激活
			this.buildPager().checkStatus();

			// 翻页点击事件
			var page = +this.$config.page;
			eventHelper.bind( $('.M-pagerPrev'), 'click', page, this.eventClickPreview, this );
			eventHelper.bind( $('.M-pagerNext'), 'click', page, this.eventClickNext, this );

			// 页码点击事件
			eventHelper.proxy( $('.M-pager'), 'click', 'input.M-pagerItem', this.eventClickPage, this );
		},

		// 创建页码选项
		buildPager: function() {
			var config = this.$config;
			var doms = this.$doms;

			// 分页信息
			var pages = +config.pages; // 总页数
			var items = this.makePageArray( pages );

			// 构建总条数
			doms.info.html('<span class="total">[共 '+ pages +' 页]</span>');

			// 构建页码
			util.each( items, function( item ) {
				var item;
				if( item === '---' ) {
					item = '<span class="M-pagerOmit" title="部分页码已隐藏">···</span>';
				}
				else {
					item = '<input type="button" class="M-pagerItem" value="'+ item +'"/>';
				}
				$(item).appendTo( doms.list );
			});
			return this;
		},

		// 生成页码数组[1,2,3,4,5,'...']
		makePageArray: function( pages ) {
			var max = 5; // 显示选项的最多个数
			var retArr = [], i;
			// 不需要隐藏选项
			if( pages <= max ) {
				for( i = 1; i < pages.length + 1; i++ ) {
					retArr.push( i );
				}
			}
			// 需要隐藏选项
			else {
				for( i = 1; i < max + 1; i++ ) {
					retArr.push( i );
				}
				retArr.push('---');
			}
			return retArr;
		},

		// 激活页码
		checkStatus: function() {
			var page = +this.$config.page;
			var pages = +this.$config.pages;
			// 激活当前页码
			$('.M-pagerItem', this.$doms.list).eq(page-1).addClass('M-pagerAct');

			// 第一页和最后一页隐藏上下切换按钮
			if( page === 1 ) {
				// this.$doms.prev.hide();
			}
			else if( page === pages ) {
				// this.$doms.next.hide();
			}
			return this;
		},

		// 点击下一页
		eventClickNext: function( elm, page ) {
			var id = page + 1;
			var pages = this.$config.pages;
			if( id === 0 || id > pages ) {
				return false;
			}
			this.callback.call( this.$scope, id );
		},

		// 点击上一页
		eventClickPreview: function( elm, page ) {
			var id = page - 1;
			var pages = this.$config.pages;
			if( id === 0 || id > pages ) {
				return false;
			}
			this.callback.call( this.$scope, id );
		},

		// 点击页码
		eventClickPage: function( elm ) {
			var id = +$(elm).val();
			var page = this.$config.page;
			if( id === page ) {
				return false;
			}
			$(elm).addClass('M-pagerAct').siblings('.M-pagerItem').removeClass('M-pagerAct')
			this.callback.call( this.$scope, id );
		},

		// 更新页码数据展现
		update: function() {
			//
		}
	}
	exports.base = Pager;

	// 点击加载更多方式
	var LoadMore = {};
	exports.loadMore = LoadMore;
});