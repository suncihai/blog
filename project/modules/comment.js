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
	var dialog = require('@modules/dialog').base;
	// var header = require('@modules/header').base;
	var tooltip = require('@modules/tooltip').tooltip.init();
	var loading = require('@modules/loading').chrysanthemum;

	// 评论列表
	var CommentList = {
		init: function( config ) {
			this.$ = {};
			this.$comments = 0;
			this.$target = config.target;
			this.$param = $.extend({}, c.commentParam, {
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
					'<div class="M-commentError"/>',
				'</div>'
			].join('')).appendTo( this.$target );

			this.$doms = {
				'body'    : html,
				'title'   : $('.M-commentHeadTitle', html),
				'add'     : $('.M-commentHeadAdd', html),
				'loading' : $('.M-commentLoading', html),
				'list'    : $('.M-commentList', html).hide(),
				'pager'   : $('.M-commentPager', html).hide(),
				'empty'   : $('.M-commentEmpty', html).hide(),
				'error'   : $('.M-commentError', html).hide()
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
			app.messager.on('pagerSelected', this.onPagerSelected, this);

			// 监听添加评论成功消息
			app.messager.on('commentAdded', this.onAddAComment, this);

			// 绑定添加评论事件
			app.event.bind( this.$doms.add, 'click', this.eventClickAdd, this );
			app.event.bind( this.$doms.empty, 'click', this.eventClickAdd, this );
		},

		// 添加一条评论
		onAddAComment: function( ev ) {
			var param = ev.param;
			var newComment = this.createAComment( param );
			if ( !this.$comments ) {
				this.$comments++;
				this.$doms.title.text('评论');
				this.show().$doms.empty.hide();
			}
			this.$doms.list.prepend( $(newComment).addClass('animated flipInX') );
		},

		// 分页响应事件
		onPagerSelected: function( ev ) {
			var param = ev.param;
			var page = param.page;
			if ( param.name === 'commentPager' ) {
				this.$param.page = page;
				this.load();
			}
			return false;
		},

		// 点击新增评论
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
			this.$doms.title.text('评论努力加载中···');
			param = param || this.$param;
			this.hide().empty().showLoading();
			app.data.get( dc.listcomment, param, this.onData, this );
		},

		// 数据返回
		onData: function( err, res ) {
			var self = this;
			var dataError = '评论列表拉取失败~';
			var title = '';
			if ( err ) {
				util.error('拉取数据失败！状态: ' + err.status + ', 错误信息: ' + err.message);
				if ( err.status === 'timeout' ) {
					self.hideLoading();
					self.$doms.title.text('服务器请求超时');
					self.$doms.error.show().addClass('animated shake').text('(ˇˍˇ)评论列表请求超时，请稍后重试~');
				}
				return false;
			}
			if ( !res.success ) {
				if ( res.message ) {
					dataError = res.message;
				}
				return false;
			}
			res = res.result;
			this.$comments = res.total;

			setTimeout(function() {
				self.show().hideLoading();
				switch( res.total ) {
					case 0:
						self.hide();
						self.$doms.title.text('没有评论，快抢沙发~');
						self.$doms.empty.show();
					break;
					case 1:case 2:
						title = '共'+ res.total +'条评论';
						self.$doms.title.text( title );
					break;
					default:
						title = res.page === res.pages ?
							'共'+ res.total +'条评论，已经最后一页了'
							: '共'+ res.total +'条评论，第'+ res.page +'页';
						self.$doms.title.text( title );
				}

				// 更新页码
				pager.setParam({
					'page': res.page,
					'pages': res.pages,
					'total': res.total
				});
			}, 0);

			// 发通知消息
			app.messager.fire('commentDataLoaded');
			// 构建评论列表
			self.buildList( res.items );
		},

		// 创建评论列表
		buildList: function( items ) {
			var self = this;
			var list = [];
			this.$items = items;

			util.each( items, function( item, idx ) {
				var comment = self.createAComment( item, idx );
				list.push( comment );
			});

			$(list.join('')).appendTo( this.$doms.list );

			// 评论操作
			var op = $('.M-commentIssuseHeadOp', this.$doms.list);
			app.event.proxy( op, 'click', 'span', this.eventClickOp, this );
		},

		// 创建一条评论
		createAComment: function( info, idx ) {
			// 序号
			var floor = info.passed ? '#' + (idx + 1) : '-';
			// 评论昵称
			var nickName = info.admin ?
				'<span class="M-commentIssuseHeadNickAdmin">'+ info.author +'</span>'
				: info.url ?
				'<a href="http://'+ info.url +'" target="_blank">'+ info.author +'</a>'
				: info.author;
			// 评论时间
			var date = util.prettyDate( info.date );
			// 评论内容(html)
			var content = '';
			// 评论者所在地
			var address = info.admin ?
				'' : info.address ? '['+ info.address +']' : '<span class="tdef">未知地区</span>';
			// 有父评论
			if ( info.parent ) {
				var pnick = info.parent.url ? '<a href="http://'+ info.parent.url +'" target="_blank">@'+ info.parent.author +'</a>' : '@' + info.parent.author;
				var phtml = [
					'<div class="M-commentIssuseContentParent">',
						'<div class="M-commentIssuseContentParentHead">',
							'<div class="M-commentIssuseContentParentHeadTitle">',
								'回复' + '<span class="nick">' + pnick + '</span>' + '的评论：',
							'</div>',
						'</div>',
						'<div class="M-commentIssuseContentParentContent">'+ info.parent.content +'</div>',
					'</div>'
				].join('');
				content = phtml + '<div class="M-commentIssuseContentMain">'+ info.content +'</div>';
			}
			else {
				content = info.content;
			}
			// 新增的评论(未审核状态)标出提示
			if ( !info.passed ) {
				content = '<div class="warning ti pb5">提示：您的评论需要经过审核才能公开显示，该评论当前只有您自己可见。</div>' + content;
			}

			return [
				'<section class="M-commentIssuse" data-id="'+ (idx || -1) +'">',
					'<header class="M-commentIssuseHead">',
						'<b class="M-commentIssuseHeadFloor">'+ floor +'</b>',
						'<b class="M-commentIssuseHeadNick">'+ nickName +'</b>',
						'<span class="M-commentIssuseHeadAddress">'+ address +'</span>',
						'<span class="M-commentIssuseHeadTime" title="'+ info.date +'">',
							// info.parent ? '回复于 ' : '评论于 ',
							date,
						'</span>',
						'<div class="M-commentIssuseHeadOp">',
							// '<span data-id="'+ info.id +'" class="op like">',
							// 	'支持(<i class="likes">0</i>)',
							// '</span>',
							// '<span data-id="'+ info.id +'" class="op dislike">',
							// 	'反对(<i class="dislikes">0</i>)',
							// '</span>',
							// info.passed ? '<span data-id="'+ info.id +'" class="op reply">'+ '回复TA' +'</span>' : '',
						'</div>',
					'</header>',
					'<article class="M-commentIssuseContent">'+ content +'</article>',
				'</section>'
			].join('');
		},

		// 点击评论操作
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
			this.$dialogBody = dialog
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
			this.$dialogBody.empty();
			this.buildComment();
		},

		buildComment: function() {
			var holderTxt = '';
			if ( this.$data && this.$data.content ) {
				var content = util.removeTags(this.$data.content);
				content = content.trim();
				var brief = content.length > 20 ? content.substr(0, 20) + '……' : content;
				holderTxt = '[必填] 回复“'+ this.$data.author +'”的评论：“' + brief + '”';
			}
			else {
				holderTxt = '[必填] 在这里输入评论内容~';
			}
			var holderNick = '[必填] 在这输入您的昵称，不超过16个字符。';
			var holderLink = '[选填] 这里可以输入您的网址(如:www.tangbc.com)，链接会加在您的昵称上。';
			var holderCode = '输入验证码';
			var dom = $([
				'<div class="M-commentForm">',
					'<textarea class="M-commentFormText" placeholder="'+ holderTxt +'"></textarea>',
					'<input type="text" class="M-commentFormNick" placeholder="'+ holderNick +'"/>',
					'<input type="text" class="M-commentFormLink" placeholder="'+ holderLink +'"/>',
					'<div class="M-commentFormFooter">',
						'<input class="M-commentFormFooterCode"  placeholder="'+ holderCode +'">',
						'<img class="M-commentFormFooterPic" title="点击更换验证码" src="'+ this.$imageUrl +'"/>',
						'<span class="M-commentFormFooterTips">'+ this.$tip +'</span>',
						'<button class="M-commentFormFooterSubmit">发表评论</button>',
						'<button class="M-commentFormFooterReset">重置</button>',
					'</div>',
					'<div class="M-commentFormMask">',
						'<div class="M-commentFormMaskText">评论正在提交中···</div>',
					'</div>',
				'</div>'
			].join(''));
			dom.appendTo( this.$dialogBody );

			this.$doms = {
				'text'     : $('.M-commentFormText', dom),
				'nick'     : $('.M-commentFormNick', dom),
				'link'     : $('.M-commentFormLink', dom),
				'code'     : $('.M-commentFormFooterCode', dom),
				'image'    : $('.M-commentFormFooterPic', dom),
				'tips'     : $('.M-commentFormFooterTips', dom),
				'reset'    : $('.M-commentFormFooterReset', dom),
				'submit'   : $('.M-commentFormFooterSubmit', dom),
				'mask'     : $('.M-commentFormMask', dom),
				'maskText' : $('.M-commentFormMaskText', dom)
			}

			// 读取cookie值
			var nickName = app.cookie.get('usernickname');
			var link = app.cookie.get('userlink');
			if ( nickName ) {
				this.$doms.nick.val( nickName ).prop('disabled', true);
			}
			if ( link ) {
				this.$doms.link.val( link );
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
			app.messager.on('dialogClosed', this.onDialogClosed, this);
		},

		// 对话框关闭事件
		onDialogClosed: function() {
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
				'postid'  : this.$data && this.$data.postid,
				'id'      : this.$data.id
			}
		},

		// 点击重置
		eventClickReset: function() {
			this.reset();
			return false;
		},

		// 重置表单
		reset: function() {
			this.$doms.text.val('').focus();
			this.$doms.code.val('');
			if ( !app.cookie.get('usernickname') ) {
				this.$doms.nick.val('');
			}
			if ( !app.cookie.get('userlink') ) {
				this.$doms.link.val('');
			}
		},

		// 表单验证
		validate: function( data ) {
			if ( data.content === '' ) {
				tooltip.setTip({
					'refer': this.$doms.text,
					'arrow': {'position': 'top'},
					'offset': {'left': 10, 'top': 25},
					'content': '评论内容不能为空~',
					'width': 140,
					'name': 'content'
				});
				this.$doms.text.focus();
				return false;
			}
			if ( data.author === '' ) {
				tooltip.setTip({
					'refer': this.$doms.nick,
					'arrow': {'position': 'bottom'},
					'offset': {'left': 0, 'top': -45},
					'content': '昵称不能为空~',
					'width': 120,
					'name': 'nick'
				});
				this.$doms.nick.focus();
				return false;
			}
			if ( data.code === '' ) {
				tooltip.setTip({
					'refer': this.$doms.code,
					'arrow': {'position': 'bottom'},
					'offset': {'left': 0, 'top': -45},
					'content': '验证码不能为空~',
					'width': 130,
					'name': 'code'
				});
				this.$doms.code.focus();
				return false;
			}
			return true;
		},

		// 点击提交
		eventClickSubmit: function( evt ) {
			var data = this.getData();
			tooltip.setTimeStamp( evt.timeStamp );
			if ( this.validate( data ) ) {
				this.$doms.mask.show()
				app.animate.play(this.$doms.maskText, 'fadeIn');
				app.data.post( dc.addcomment, data, this.onData, this );
			}
			return false;
		},

		// 评论提交结果
		onData: function( err, res ) {
			var self = this;
			var txt = '';
			// 提交成功
			if ( res && res.success ) {
				self.$res = res.result;
				self.reset();
				if ( !app.cookie.get('usernickname') ) {
					app.cookie.set('usernickname', self.$res.author);
				}
				if ( !app.cookie.get('userlink') ) {
					app.cookie.set('userlink', self.$res.url);
				}
				app.animate.play(self.$doms.maskText.text('评论成功！'), 'fadeIn', function() {
					setTimeout(function() {
						dialog.hide( self.afterDialogHide, self );
					}, 1000);
				});
				return false;
			}
			// 提交失败
			else {
				app.event.bind( $(document), 'click.hideMask', this.eventHideMask, this );
				if ( err ) {
					txt = [err.status, err.message].join(', ');
					app.animate.play(self.$doms.maskText.addClass('warning').text( txt ), 'shake');
				}
				if ( res && !res.success ) {
					txt = res.message || '提交失败请重试~';
					app.animate.play(self.$doms.maskText.addClass('warning').text( txt ), 'shake');
				}
			}
		},

		// 对话框隐藏, 将新增的评论发给评论列表
		afterDialogHide: function() {
			app.messager.fire('commentAdded', this.$res);
		},

		// 隐藏评论表单的遮罩
		eventHideMask: function() {
			var mask = this.$doms.mask;
			app.animate.play( mask, 'fadeOut', 1, function() {
				mask.hide();
				app.event.unbind($(document), 'click.hideMask');
			});
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
						'zoomOutDown'
						// 'rotateOutDownLeft',
						// 'rotateOutDownRight'
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