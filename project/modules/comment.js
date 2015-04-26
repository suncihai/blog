/**
 * [文章评论模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var app = require('app');
	var util = require('util');
	var dailog = require('@modules/dailog').base;
	var c = app.getConfig();
	var dc = c.dataCenter;

	// 评论列表
	var CommentList = {
		init: function( config ) {
			this.$target = config.target;
			this.$param = util.merge( c.commentParam, {
				'artid': +config.artid
			});
			this.build();
		},

		// 创建评论列表
		build: function() {
			var html = $([
				'<div class="M-comment">',
					'<header class="M-commentHead">',
						'<h2 class="M-commentHeadTitle">评论</h2>',
						'<div class="M-commentHeadLine"/>',
					'</header>',
					'<article class="M-commentList"/>',
				'</div>'
			].join('')).appendTo( this.$target );

			this.$doms = {
				'list': $('.M-commentList', html)
			}

			// 拉取评论列表
			this.load();
		},

		load: function() {
			app.data.get( dc.listcomment, this.$param, this.onData, this );
		},

		onData: function( err, res ) {
			var dataError = '评论列表拉取失败~';
			if( err ) {
				util.error('拉取数据失败！状态: ' + err.status + ', 错误信息: ' + err.message);
				return false;
			}
			if( !res.success ) {
				if( res.message ) {
					dataError = res.message;
				}
				return false;
			}
			this.buildList( res.result.items );
		},

		buildList: function( items ) {
			var list = [];
			this.$items = items;
			util.each( items, function( item, idx ) {
				var date = item.date.toString().slice( 0, 10 );
				list.push([
					'<section class="M-commentIssuse">',
						'<header class="M-commentIssuseHead">',
							'<b class="M-commentIssuseHeadNick">'+ item.author +'</b>',
							'<span class="M-commentIssuseHeadTime">'+ '发表于 ' + date +'</span>',
							'<div class="M-commentIssuseHeadOp">',
								'<span data-id="'+ item.id +'" class="op like">',
									'支持(<i class="likes">123</i>)',
								'</span>',
								'<span data-id="'+ item.id +'" class="op dislike">',
									'反对(<i class="dislikes">3</i>)',
								'</span>',
								'<span data-id="'+ item.id +'" class="op reply">'+ '回复TA' +'</span>',
							'</div>',
						'</header>',
						'<article class="M-commentIssuseContent">'+ item.content +'</article>',
					'</section>'
				].join(''));
			});

			$(list.join('')).appendTo( this.$doms.list );

			var op = $('.M-commentIssuseHeadOp', this.$doms.list);

			app.event.proxy( op, 'click', 'span', this.eventClickOp, this );
		},

		eventClickOp: function( evt, elm ) {
			var op = $(elm).attr('class').substr(3);
			var id = +$(elm).attr('data-id');
			var data = util.find( this.$items, id, 'id' );
			switch( op ) {
				case 'like':
				break;
				case 'dislike':
				break;
				case 'reply':
					popwin.init( data );
				break;
			}
			return false;
		}
	}
	exports.base = CommentList;

	// 评论弹出层
	var popwin = {
		init: function( data ) {
			this.$dailog = dailog
				.init()
				.setTitle('添加评论')
				.show()
				.getBody();
			// 缓存评论数据
			this.setData( data );
		},

		setData: function( data ) {
			this.$data = data;
			this.buildComment();
		},

		buildComment: function() {
			//
		}
	}
});