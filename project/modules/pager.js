/**
 * [分页模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var app = require('app');

	// 无连接的分页方式(通过消息监听分页)
	var PagerNoLink = {
		/*
		 * config配置参数：
		 * name：分页器模块名称
		 * target：分页器创建目标DOM
		 * max：分页器初始选项最多显示个数
		 * class：额外class(用于写不同样式的CSS)
		 * showInfo：是否显示分页信息
		 */
		init: function( config ) {
			this.$config = config;
			this.$name = config.name;
			this.$param = {}, // 当前页page, 总页数pages, 总条数total
			this.$max = config.max || 7; // 最多显示选项条数
			this.$showInfo = !!config.showInfo;
			this.$class = config.class || '';
			this.build();
			return this;
		},

		setParam: function( param ) {
			this.$param = param;
			// 重新生成页码
			this.empty().buildPager();
		},

		// 创建分页器
		build: function() {
			var config = this.$config;
			var dom = config.target;  // 分页器的添加位置

			// 分页器HTML结构
			var html = [
				'<div class="M-pager '+ this.$class +'">',
					'<input class="M-pagerPN M-pagerPrev" type="button" title="'+ T('上一页') +'"/>',
					'<div class="M-pagerList"/>',
					'<input class="M-pagerPN M-pagerNext" type="button" title="'+ T('下一页') +'"/>',
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

			if ( !this.$showInfo ) {
				this.$doms.info.hide();
			}

			doms.prev.attr('value', '<');
			doms.next.attr('value', '>');

			// 翻页点击事件
			app.event.bind( doms.prev, 'click', this.eventClickPreview, this );
			app.event.bind( doms.next, 'click', this.eventClickNext, this );

			// 页码点击事件
			app.event.proxy( $('.M-pager'), 'click', 'input.M-pagerItem', this.eventClickPage, this );
		},

		// 创建页码选项
		buildPager: function() {
			var param = this.$param;
			var doms = this.$doms;

			// 分页信息
			var pages = param.pages; // 总页数
			var page = param.page; // 当前页
			var items = this.makePageArray( page, pages );

			// 构建总条数
			doms.info.html('<span class="total lsp2">['+ T('共{1}页，{2}条记录', pages, param.total) +']</span>');

			// 构建页码
			util.each( items, function( num ) {
				var item;
				if ( num === '...' ) {
					item = '<span class="M-pagerItem M-pagerOmit" title="'+ T('已隐藏部分页码') +'">···</span>';
				}
				else {
					item = '<input type="button" class="M-pagerItem" value="'+ num +'"/>';
				}
				$(item).appendTo( doms.list );
			});

			// 激活当前页码
			this.checkStatus( page, items );

			if ( pages <= 1 ) {
				doms.prev.hide();
				doms.list.hide();
				doms.next.hide();
			}
			return this;
		},

		// 生成页码数组[1,2,3,4,5,'...']
		makePageArray: function( page, all ) {
			var retArr = [], i;
			var max = this.$max; // 初始选项显示个数
			// 不需要隐藏选项
			if ( all <= max ) {
				for ( i = 1; i < all + 1; i++ ) {
					retArr.push( i );
				}
			}
			// 需要隐藏选项
			else {
				var tmpArr = this.formatPage( page );
				if ( !tmpArr ) {
					for ( i = 1; i < max + 1; i++ ) {
						retArr.push( i );
					}
					retArr.push('...');
				}
				else {
					retArr = tmpArr;
				}
			}
			return retArr;
		},

		// 更新页码展现格式,增加省略号
		formatPage: function( page ) {
			var max = this.$max; // 初始选项显示个数
			var pages = this.$param.pages; // 总页数
			var fontArr = [1,2,'...']; // 前面的页码选项(保留第1页)
			var backArr = ['...']; // 后面的页码选项
			var retArr = null;
			// 激活的页码小于max的不作处理
			if ( page < max ) {
				return false;
			}
			// 激活页码大于等于max的做截断: 12...456...
			// 非特殊情况截断：激活页前后有两页
			var diff = pages - page; // 当前页与总页的差值
			switch( diff ) {
				// 最后一页
				case 0:
					backArr = [page - 3, page - 2, page - 1, page];
				break;
				// 倒数第一页
				case 1:
					backArr = [page - 2, page - 1, page, page + 1];
				break;
				// 倒数第二页
				case 2:
					backArr = [page - 2, page - 1, page, page + 1, page + 2];
				break;
				default:
					backArr = [page - 2, page - 1, page, page + 1, page + 2].concat( backArr );
			}
			retArr = fontArr.concat( backArr );
			return retArr;
		},

		// 激活页码
		checkStatus: function( page, items ) {
			var self = this;
			// 激活当前页码
			util.each( items, function( item, idx ) {
				if ( item === page ) {
					$('.M-pagerItem', self.$doms.list).eq(idx).addClass('M-pagerAct');
					return false;
				}
			});

			// 第一页和最后一页隐藏上下切换按钮
			// var pages = +self.$config.pages;
			// page === 1 && self.$doms.prev.hide();
			// page === pages && self.$doms.next.hide();
		},

		// 清空DOM
		empty: function() {
			this.$doms.list.empty();
			return this;
		},

		// 点击下一页
		eventClickNext: function( evt, elm ) {
			var id = this.$param.page + 1;
			var pages = this.$param.pages;
			if ( id <= 0 || id > pages ) {
				return false;
			}
			app.messager.fire('pagerSelected', {
				'page': id,
				'name': this.$name
			});
		},

		// 点击上一页
		eventClickPreview: function( evt, elm ) {
			var id = this.$param.page - 1;
			var pages = this.$param.pages;
			if ( id <= 0 || id > pages ) {
				return false;
			}
			app.messager.fire('pagerSelected', {
				'page': id,
				'name': this.$name
			});
		},

		// 点击页码
		eventClickPage: function( evt, elm ) {
			var id = +$(elm).val();
			var page = this.$param.page;
			if ( id === page ) {
				return false;
			}
			$(elm).addClass('M-pagerAct').siblings('.M-pagerItem').removeClass('M-pagerAct');
			app.messager.fire('pagerSelected', {
				'page': id,
				'name': this.$name
			});
		}
	}
	exports.pagerNoLink = $.extend(true, {}, PagerNoLink);


	// 有链接的分页方式(通过url参数分页)
	var PagerHasLink = $.extend(true, PagerNoLink, {
		// 创建分页器
		build: function() {
			var config = this.$config;
			var dom = config.target;  // 分页器的添加位置

			// 分页器HTML结构
			var html = [
				'<div class="M-pager '+ this.$class +'">',
					'<input class="M-pagerPN M-pagerPrev" type="button" title="'+ T('上一页') +'"/>',
					'<div class="M-pagerList"/>',
					'<input class="M-pagerPN M-pagerNext" type="button" title="'+ T('下一页') +'"/>',
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

			if ( !this.$showInfo ) {
				this.$doms.info.hide();
			}

			doms.prev.attr('value', '<');
			doms.next.attr('value', '>');

			// 翻页点击事件
			app.event.bind( doms.prev, 'click', this.eventClickPreview, this );
			app.event.bind( doms.next, 'click', this.eventClickNext, this );
		},

		// 创建页码选项
		buildPager: function() {
			var param = this.$param;
			var doms = this.$doms;
			var link = this.$param.link;

			// 分页信息
			var pages = param.pages; // 总页数
			var page = param.page; // 当前页
			var items = this.makePageArray( page, pages );

			// 构建总条数
			doms.info.html('<span class="total lsp2">['+ T('共{1}页，{2}条记录', pages, param.total) +']</span>');


			// 构建页码
			util.each( items, function( num ) {
				var item, href;
				if ( num === '...' ) {
					item = '<span class="M-pagerItem M-pagerOmit" title="'+ T('已隐藏部分页码') +'">···</span>';
				}
				else {
					href = page === num ? '' : 'href=#'+ link +'?page=' + num;
					item = '<a '+ href +' class="M-pagerItem">'+ num +'</a>';
				}
				$(item).appendTo( doms.list );
			});

			// 激活当前页码
			this.checkStatus( page, items );

			if ( pages <= 1 ) {
				doms.prev.hide();
				doms.list.hide();
				doms.next.hide();
			}
			return this;
		},

		// 点击下一页
		eventClickNext: function( evt, elm ) {
			var id = this.$param.page + 1;
			var pages = this.$param.pages;
			if ( id <= 0 || id > pages ) {
				return false;
			}
			app.controller.go(this.$param.link + '?page=' + id);
		},

		// 点击上一页
		eventClickPreview: function( evt, elm ) {
			var id = this.$param.page - 1;
			var pages = this.$param.pages;
			if ( id <= 0 || id > pages ) {
				return false;
			}
			app.controller.go(this.$param.link + '?page=' + id);
		}
	});
	exports.pagerHasLink = $.extend(true, {}, PagerHasLink);
});