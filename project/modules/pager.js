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
			var self = this;
			var config = self.$config;
			var callback = self.callback;
			var dom = config.target;  // 分页器的添加位置

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

			// dom缓存
			var doms = self.$doms = {
				'prev': $('.M-pagerPrev', dom),
				'list': $('.M-pagerList', dom),
				'next': $('.M-pagerNext', dom),
				'info': $('.M-pagerInfo', dom)
			}

			doms.prev.attr('value', '<');
			doms.next.attr('value', '>');

			// 生成页码
			self.buildPager().update();

			// 翻页点击事件
			var page = +self.$config.page;
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
			// 创建页码选项
			for( var i = 1; i < pages + 1; i++ ) {
				var item = '<input type="button" class="M-pagerItem" value="'+ i +'" data-type="'+ i +'"/>';
				$(item).appendTo( doms.list );
			}
			return this;
		},

		// 激活页码
		update: function() {
			var page = +this.$config.page;
			var pages = +this.$config.pages;
			// 激活当前页码
			$('.M-pagerItem').eq(page-1).addClass('M-pagerAct');

			if( page === 1 ) {
				$('.M-pagerPrev').addClass('M-pagerDisabled');
			}
			else if( page === pages ) {
				$('.M-pagerNext').addClass('M-pagerDisabled');
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
			var id = +$(elm).attr('data-type');
			var page = this.$config.page;
			if( id === page ) {
				return false;
			}
			$(elm).addClass('M-pagerAct').siblings('.M-pagerItem').removeClass('M-pagerAct')
			this.callback.call( this.$scope, id );
		}
	}
	exports.base = Pager;

	// 点击加载更多方式
	var LoadMore = {};
	exports.loadMore = LoadMore;
});