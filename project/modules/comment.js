/**
 * [文章评论模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var app = require('app');
	var util = require('util');
	var c = app.getConfig();
	var dc = c.dataCenter;

	var pager = require('@modules/pager').base;
	var dailog = require('@modules/dailog').base;
	// var header = require('@modules/header').base;
	var loading = require('@modules/loading').chrysanthemum;

	// 评论列表
	var CommentList = {
		init: function( config ) {
			this.$ = {};
			this.$target = config.target;
			this.$param = util.merge( c.commentParam, {
				'artid': +config.artid
			});
			this.build();
			return this;
		},

		// 隐藏整个评论模块
		showAll: function() {
			this.$doms.body.show();
			return this;
		},

		// 显示评论模块
		hideAll: function() {
			this.$doms.body.hide();
			return this;
		},

		// 显示评论列表及分页模块
		show: function() {
			this.$doms.list.show();
			this.$doms.pager.show();
			return this;
		},

		// 隐藏列表及分页模块
		hide: function() {
			this.$doms.list.hide();
			this.$doms.pager.hide();
			return this;
		},

		// 显示加载动画
		showLoading: function() {
			this.$doms.loading.show();
			this.$.loading.show();
			return this;
		},

		// 隐藏加载动画
		hideLoading: function() {
			this.$doms.loading.hide();
			this.$.loading.hide();
			return this;
		},

		// 创建评论列表
		build: function() {
			var html = $([
				'<div class="M-comment">',
					'<header class="M-commentHead">',
						'<h2 class="M-commentHeadTitle">评论</h2>',
						'<span class="M-commentHeadAdd" title="添加评论">+</span>',
						'<div class="M-commentHeadLine"/>',
					'</header>',
					'<article class="M-commentList"/>',
					'<div class="M-commentPager"/>',
					'<div class="M-commentLoading"/>',
					'<div class="M-commentEmpty">',
						'<div class=M-commentEmptyWrap>',
							'<div class="M-commentEmptyLeftHand"/>',
							'<div class="M-commentEmptyRightHand"/>',
							'<div class="M-commentEmptyCushion"/>',
							'<div class="M-commentEmptyFootLeft"/>',
							'<div class="M-commentEmptyFootRight"/>',
							'<div class="M-commentEmptyFootBack"/>',
						'</div>',
						'<div class=M-commentEmptyTxt>有空沙发</div>',
					'</div>',
				'</div>'
			].join('')).appendTo( this.$target );

			this.$doms = {
				'body'    : html,
				'title'   : $('.M-commentHeadTitle', html),
				'add'     : $('.M-commentHeadAdd', html),
				'loading' : $('.M-commentLoading', html),
				'list'    : $('.M-commentList', html).hide(),
				'pager'   : $('.M-commentPager', html).hide(),
				'empty'   : $('.M-commentEmpty', html).hide()
			}

			// 创建分页模块
			pager.init({
				'name': 'commentPager',
				'target': this.$doms.pager,
				'max': 5,
				'showInfo': false
			});

			this.$.loading = loading.init({
				'target': this.$doms.loading,
				'width':  0,
				'scale': 30,
				// 'size': 8,
				'class': 'center',
				'autoHide': true
			});

			// 监听页码选择事件
			app.event.on('pagerSelected', this.onPagerSelected, this);

			// 绑定添加评论事件
			app.event.bind( this.$doms.add, 'click', this.eventClickAdd, this );
		},

		onPagerSelected: function( ev ) {
			var param = ev.param;
			var newParam;
			if ( param.name === 'commentPager' ) {
				newParam = util.merge( this.$param, {
					'page': param.page
				});
				this.load( newParam );
			}
			return false;
		},

		eventClickAdd: function() {
			popwin.init({'title': '添加评论：'}).setData({'postid': this.$param.artid});
		},

		// 清空评论列表
		empty: function() {
			this.$doms.list.empty();
			return this;
		},

		// 拉取评论列表
		load: function( param ) {
			param = param || this.$param;
			this.hide().empty().showLoading();
			app.data.get( dc.listcomment, param, this.onData, this );
		},

		// 数据返回
		onData: function( err, res ) {
			var self = this;
			var dataError = '评论列表拉取失败~';
			if ( err ) {
				util.error('拉取数据失败！状态: ' + err.status + ', 错误信息: ' + err.message);
				return false;
			}
			if ( !res.success ) {
				if ( res.message ) {
					dataError = res.message;
				}
				return false;
			}
			res = res.result;

			setTimeout(function() {
				self.show().hideLoading();

				// 更新头部标题
				self.$doms.title.text(res.total +'条评论');

				if ( res.total === 0 ) {
					self.hide();
					self.$doms.empty.show();
				}

				// 更新页码
				pager.setParam({
					'page': res.page,
					'pages': res.pages,
					'total': res.total
				});
			}, c.delay);

			// 发通知消息
			app.event.fire('commentDataLoaded');
			// 构建评论列表
			self.buildList( res.items );
		},

		// 创建评论列表
		buildList: function( items ) {
			var list = [];
			this.$items = items;
			util.each( items, function( item, idx ) {
				var date = item.date.toString().slice( 0, 10 );
				var nickName = '';
				nickName = item.url ? '<a href="http://'+ item.url +'" target="_blank">'+ item.author +'</a>' : item.author;
				list.push([
					'<section class="M-commentIssuse" data-id="'+ idx +'">',
						'<header class="M-commentIssuseHead">',
							'<b class="M-commentIssuseHeadFloor">#'+ (idx + 1) +'</b>',
							'<b class="M-commentIssuseHeadNick">'+ nickName +'</b>',
							'<span class="M-commentIssuseHeadTime">'+ '发表于 ' + date +'</span>',
							'<div class="M-commentIssuseHeadOp">',
								// '<span data-id="'+ item.id +'" class="op like">',
								// 	'支持(<i class="likes">0</i>)',
								// '</span>',
								// '<span data-id="'+ item.id +'" class="op dislike">',
								// 	'反对(<i class="dislikes">0</i>)',
								// '</span>',
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
			this.$imageUrl = dc.getthecode;
			this.$clicks = 0;
			this.$tip = '(验证码为打乱顺序的JS或CSS关键字)';
			this.$friendTips = [
				'(比如: switch, window, margin...)',
				'(比如: block, inline, rotate...)',
				'(比如: define, bold, scale...)',
				'(比如: return, left, float...)'
			];
			this.$fuckTips = [
				'这样一直点真的很好玩吗？？',
				'你还没看出验证码是啥吗？？',
				'靠！你是一心的吧？？',
				'难道一个单词都不认得？'
			];
			this.$dailogBody = dailog
				.init({
					'height': 24
				})
				.setTitle( config.title )
				.show()
				.getBody();
			return this;
		},

		setData: function( data ) {
			this.$data = data;
			// TODO: 不要每次都清空
			this.$dailogBody.empty();
			this.buildComment();
		},

		buildComment: function() {
			var holderTxt = '';
			if ( this.$data && this.$data.content ) {
				var content = util.removeTags(this.$data.content);
				var brief = content.length > 20 ? content.substr(0, 20) + '……' : content;
				holderTxt = '[必填] 回复“'+ this.$data.author +'”的评论：“' + brief + '”';
			}
			else {
				holderTxt = '[必填] 在这里输入评论内容~';
			}
			var holderNick = '[必填] 在这输入您的昵称，不能为纯数字，不能包含特殊字符，不能超过16个字符。';
			var holderLink = '[选填] 这里可以输入您的网址(例:www.tangbc.com)，链接会加在您的昵称上。';
			var holderCode = '输入验证码';
			var dom = $([
				'<div class="M-commentForm">',
					'<textarea class="M-commentFormText"  placeholder="'+ holderTxt +'"></textarea>',
					'<input type="text" class="M-commentFormNick" placeholder="'+ holderNick +'"/>',
					'<input type="text" class="M-commentFormLink" placeholder="'+ holderLink +'"/>',
					'<div class="M-commentFormFooter">',
						'<input class="M-commentFormFooterCode"  placeholder="'+ holderCode +'">',
						'<img class="M-commentFormFooterPic" title="点击更换验证码" src="'+ this.$imageUrl +'"/>',
						'<span class="M-commentFormFooterTips">'+ this.$tip +'</span>',
						'<button class="M-commentFormFooterSubmit">发表评论</button>',
						'<button class="M-commentFormFooterReset">重置</button>',
					'</div>',
				'</div>'
			].join(''));
			dom.appendTo( this.$dailogBody );

			this.$doms = {
				'text'   : $('.M-commentFormText', dom),
				'nick'   : $('.M-commentFormNick', dom),
				'link'   : $('.M-commentFormLink', dom),
				'code'   : $('.M-commentFormFooterCode', dom),
				'image'  : $('.M-commentFormFooterPic', dom),
				'tips'   : $('.M-commentFormFooterTips', dom),
				'reset'  : $('.M-commentFormFooterReset', dom),
				'submit' : $('.M-commentFormFooterSubmit', dom)
			}

			// 绑定重置
			app.event.bind( this.$doms.reset, 'click.reset', this.eventClickReset, this );
			// 绑定提交
			app.event.bind( this.$doms.submit, 'click.submit', this.eventClickSubmit, this );
			// 绑定验证码输入框失去焦点
			app.event.bind( this.$doms.code, 'blur.code', this.eventBlurCode, this );
			// 绑定更换验证码
			app.event.bind( this.$doms.image, 'click.image', this.eventClickImage, this );
			// 对话框关闭 解除绑定
			app.event.on('dailogClosed', this.onDailogClosed, this);
		},

		// 对话框关闭事件
		onDailogClosed: function() {
			app.event.unbind(this.$doms.reset, 'click.reset');
			app.event.unbind(this.$doms.submit, 'click.submit');
			app.event.unbind(this.$doms.code, 'blur.code');
			app.event.unbind(this.$doms.image, 'click.image');
			return false;
		},

		// 获取提交数据
		getData: function() {
			return {
				'content' : util.htmlEncode( this.$doms.text.val() ),
				'author'  : this.$doms.nick.val().trim(),
				'link'    : this.$doms.link.val().trim(),
				'code'    : this.$doms.code.val().trim(),
				'postid'  : this.$data && this.$data.postid
			}
		},

		// 点击重置
		eventClickReset: function() {
			this.$doms.text.val('').focus();
			this.$doms.nick.val('');
			this.$doms.code.val('');
			this.$doms.link.val('');
			return false;
		},

		// 表单验证
		validate: function( data ) {
			if ( data.content === '' ) {
				this.$doms.text.focus();
				return false;
			}
			if ( data.author === '' ) {
				this.$doms.nick.focus();
				return false;
			}
			if ( data.code === '' ) {
				this.$doms.code.focus();
				return false;
			}
			return true;
		},

		// 点击提交
		eventClickSubmit: function() {
			var data = this.getData();
			if ( this.validate( data ) ) {
				app.data.post( dc.addcomment, data, this.onData, this );
			}
			return false;
		},

		// 评论提交结果
		onData: function( err, data ) {
			console.log( err, data );
		},

		// 验证码失去焦点
		eventBlurCode: function( evt, elm ) {
			var code = $(elm).val().trim();
			if ( code !== '' ) {
				app.data.post( dc.verifycode, {
					'code': code
				}, this.onVerify, this );
			}
			return false;
		},

		// 验证码校验结果
		onVerify: function( err, data ) {
			var msg = '';
			if ( err ) {
				util.error( err );
				msg = '<span class="warning animated fadeIn">服务器出了点问题~<span>';
			}
			if ( !data.success ) {
				msg = '<span class="warning animated fadeIn"><i class="M-iconWarning">×</i>' + data.message + '</span>';
			}
			else {
				msg = '<span class="ok animated fadeIn"><i class="M-iconOk">√</i>验证码正确！<span>';
			}
			this.$doms.tips.html( msg );
		},

		// 点击更换验证码
		eventClickImage: function( evt, elm ) {
			var self = this;
			var tip = '', stop;
			this.$clicks += 1;
			self.$doms.code.val('').focus();
			switch( this.$clicks ) {
				case 1:case 2:case 3:
					tip = this.$tip;
				break;
				case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:
					tip = this.$friendTips[util.random(0, this.$friendTips.length - 1)];
				break;
				case 14:case 15:case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 23:
					tip = this.$fuckTips[util.random(0, this.$fuckTips.length - 1)];
				break;
				default: {
					tip = '好了，不能再这么任性下去了……';
					stop = true;
				}
			}
			self.$doms.tips.html( tip );
			if ( stop ) {
				$(elm).attr('src', self.$imageUrl + '?ts=' + evt.timeStamp);
			}
			else {
				app.animate.play(
					$(elm),
					[
						'hinge',
						'zoomOutDown',
						'rotateOutDownLeft',
						'rotateOutDownRight'
					],
					function() {
						$(elm).attr('src', self.$imageUrl + '?ts=' + evt.timeStamp);
					}
				);
			}
			return false;
		}
	}
});