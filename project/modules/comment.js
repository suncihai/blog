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
									'支持(<i class="likes">0</i>)',
								'</span>',
								'<span data-id="'+ item.id +'" class="op dislike">',
									'反对(<i class="dislikes">0</i>)',
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
			data.postid = this.$param.artid;
			switch( op ) {
				case 'like':
				break;
				case 'dislike':
				break;
				case 'reply':
					popwin.init({'title': '回复评论：'}).setData( data );
				break;
			}
			return false;
		}
	}
	exports.base = CommentList;

	// 评论弹出层
	var popwin = {
		// config配置参数：{title: 对话框标题}
		init: function( config ) {
			this.$data = null;
			this.$dailogBody = dailog
				.init()
				.setTitle( config.title )
				.show()
				.getBody();
			return this;
		},

		setData: function( data ) {
			this.$data = data;
			// TODO: 不要每次重新创建
			this.$dailogBody.empty();
			this.buildComment();
		},

		buildComment: function() {
			var holderTxt = '回复“'+ util.htmlEncode(this.$data.content) + '”' || '在这里输入评论内容~';
			var holderNick = '在这输入昵称，不能为纯数字，不能包含特殊字符';
			var holderCode = '输入验证码';
			var dom = $([
				'<div class="M-commentForm">',
					'<textarea class="M-commentFormText"  placeholder="'+ holderTxt +'"/>',
					'<input type="text" class="M-commentFormNick" placeholder="'+ holderNick +'">',
					'<div class="M-commentFormFooter">',
						// '<input class="M-commentFormFooterCode"  placeholder="'+ holderCode +'">',
						// '<img class="M-commentFormFooterPic" src="/blog/sprint/api/verify_image.php"/>',
						'<button class="M-commentFormFooterSubmit">发表评论</button>',
						'<button class="M-commentFormFooterReset">重置</button>',
					'</div>',
				'</div>'
			].join(''));
			dom.appendTo( this.$dailogBody );

			this.$doms = {
				'text'   : $('.M-commentFormText', dom).focus(),
				'nick'   : $('.M-commentFormNick', dom),
				'code'   : $('.M-commentFormFooterCode', dom),
				'image'  : $('.M-commentFormFooterPic', dom),
				'reset'  : $('.M-commentFormFooterReset', dom),
				'submit' : $('.M-commentFormFooterSubmit', dom)
			}

			// 绑定重置
			app.event.bind( this.$doms.reset, 'click.reset', this.eventClickReset, this );
			// 绑定提交
			app.event.bind( this.$doms.submit, 'click.submit', this.eventClickSubmit, this );
			// 绑定更换验证码
			app.event.bind( this.$doms.image, 'click.image', this.eventClickImage, this );
			// 对话框关闭 解除绑定
			app.event.on('dailogClosed', this.onDailogClosed, this);
		},

		// 对话框关闭事件
		onDailogClosed: function() {
			app.event.unbind(this.$doms.reset, 'click.reset');
			app.event.unbind(this.$doms.submit, 'click.submit');
			app.event.unbind(this.$doms.image, 'click.image');
			return false;
		},

		// 获取提交数据
		getData: function() {
			return {
				'content' : this.$doms.text.val(),
				'author'  : this.$doms.nick.val(),
				'postid'  : this.$data.postid
			}
		},

		// 点击重置
		eventClickReset: function() {
			this.$doms.text.val('').focus();
			this.$doms.nick.val('');
			this.$doms.code.val('');
			return false;
		},

		// 点击提交
		eventClickSubmit: function() {
			var data = this.getData();
			app.data.post( dc.addcomment, data, this.onData, this );
			return false;
		},

		onData: function( err, data ) {
			console.log( err, data );
		},

		// 点击更换验证码
		eventClickImage: function() {
			console.log('change verify code')
			return false;
		}
	}
});