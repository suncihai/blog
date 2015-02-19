define(function( require, exports ){
	var $ = require('jquery');
	var util = require('util');
	var dataHelper = require('@core/dataHelper').base;
	var layout = require('layout').base;
	var C = require('@core/config');
	var pager = require('@modules/pager');

	var Main = {
		init: function( data ) {
			this.$data = data;
			this.$dataReady = true;
			this.build();
		},

		build: function() {
			var data = this.$data;
			var dom = data.dom;
			$([
				'<div class="P-archive-list"/>',
				'<div class="P-archive-pager"/>'
			].join('')).appendTo( dom );
			this.$doms = {
				listBox: $('.P-archive-list', dom),
				pagerBox: $('.P-archive-pager', dom)
			}

			// 加载数据
			this.load();
		},

		// 拉取数据
		load: function( param ) {
			var param = param || this.getParam();
			var dc = C.dataCenter;
			dataHelper.get( dc.listarchives, param, this.onData, this );
		},

		// 获取参数
		getParam: function() {
			var ret = null;
			var data = this.$data;
			ret = util.mergeParam( C.archiveOption, {
				'catid': C.cat[data.name]
			});
			return ret;
		},

		// 拉取数据回调
		onData: function( err, res ) {
			if( err ) {
				util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
				return false;
			}
			var dom = this.$data.dom;
			if( !res.success ) {
				dom.html('拉取数据似乎出了点问题~');
				return;
			}
			var info = this.$info = res.result;
			if( util.isEmpty( info ) ) {
				dom.html('无数据');
				return;
			}
			this.buildArchives( info );
		},

		// 创建
		buildArchives: function( info ) {
			var data = this.$data;
			
			// 循环创建列表
			util.each( info.items, this.buildItems, this );

			// 创建分页
			pager.buildPager({
				'target': this.$doms.pagerBox,
				'page': info.page,
				'pages': info.pages,
				'total': info.total
			}, this.pagerSelected, this);

			// 设置标题
			layout.setTitle( C.archiveTitle[data.name] );
		},

		// * buildItems 循环生成列表. idx->序号, item->选项对象
		buildItems: function( item, idx ) {
			var data = this.$data;
			var sections = [];
			var str = item.publishDate.slice( 0, 10 );
			var arr = str.split('-');
			var year = arr[0];
			var mouth = +arr[1];
			var day = +arr[2];
			sections.push([
				'<section list-id="'+ idx +'">',
					'<div class="P-archive-list-head">',
						'<div class="P-archive-list-date">',
							'<div class="day">'+ day +'号</div>',
							'<div class="year">'+ year +'年-'+ mouth +'月</div>',
						'</div>',
						'<div class="P-archive-list-title">',
							'<h2><a href="#'+ data.name +'/'+ item.id +'" title="'+ item.title +'">'+ item.title +'</a></h2>',
							'<div class="P-archive-list-info">',
								'<span class="tag">分类：'+ data.name +'</span>',
								' | ',
								'<span class="tag">评论：'+ item.comments +'</span>',
							'</div>',
						'</div>',
					'</div>',
					'<article>'+ item.content +' ……</article>',
					'<a href="#'+ data.name +'/'+ item.id +'" class="all">阅读全文>></a>',
				'</section>'
			].join(''));
			this.$doms.listBox.append( sections.join('') );
		},

		// pagerSelected 页码激活事件
		pagerSelected: function( page ) {
			var oldParam = this.getParam();
			var newParam = util.mergeParam( oldParam, {
				'page': page
			});
			this.empty();
			this.load( newParam );
		},

		// 清空列表数据和分页信息
		empty: function() {
			var doms = this.$doms;
			doms.listBox.empty();
			doms.pagerBox.empty();
		} 
	}
	exports.base = Main;
});