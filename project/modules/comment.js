/**
 * [文章评论模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var app = require('app');
	var util = require('util');
	var c = app.getConfig();
	var dc = c.dataCenter;

	var pager = require('@modules/pager').pagerNoLink;
	var dialog = require('@modules/dialog').base;
	var tooltip = require('@modules/tooltip').tooltip.init();
	var loading = require('@modules/loading').chrysanthemum;

	/*
	 * 评论列表 参数config：
	 * {
	 *	'target': DOM,
	 *	'artid': Number,
	 *	'geturl': String,
	 *	'hasHead': Boolean,
	 *	'cls': String,
	 *	'hasOp': Boolean
	 *	'pageSize': Number
	 * }
	 */
	var CommentList = {
		init: function( config ) {
			this.$ = {};
			this.$geturl = config.geturl || dc.listcomment, // 评论请求接口
			this.$comments = 0; // 评论总数
			this.$target = config.target;
			this.$hasHead = config.hasHead, // 是否显示头部
			this.$cls = config.cls || '', // 额外样式
			this.$hasOp = config.hasOp, // 是否有回复操作
			this.$param = $.extend({}, c.commentParam, {
				'artid': config.artid || 0,
				'limit': config.pageSize
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
				// '<div class="M-commentLine"/>',
				'<div class="M-comment">',
					'<header class="M-commentHead">',
						'<h2 class="M-commentHeadTitle">评论</h2>',
						'<span class="M-commentHeadAdd" title="添加评论"/>',
					'</header>',
					'<article class="M-commentList"/>',
					'<div class="M-commentPager"/>',
					'<div class="M-commentLoading"/>',
					'<div class="M-commentEmpty">',
						'<div class="M-commentEmptyWrap">',
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

			// 增加额外样式
			if ( this.$cls ) {
				html.addClass( this.$cls );
			}

			// 隐藏头部
			if ( !this.$hasHead ) {
				$('.M-commentHead', html).hide();
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
			app.event.bind( this.$doms.empty.find('.M-commentEmptyWrap'), 'click', this.eventClickAdd, this );

			// 加载超时点击重试
			app.event.bind( this.$doms.error, 'click', this.eventClickReload, this );
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
			var param = {
				'postid': this.$param.artid
			}
			popwin.init({'title': '添加评论：'}).setData( param );
		},

		// 清空评论列表
		empty: function() {
			this.$doms.list.empty();
			return this;
		},

		// 点击重试
		eventClickReload: function() {
			this.$doms.error.hide().removeClass('animated shake');
			this.load();
			return false;
		},

		// 拉取评论列表
		load: function( param ) {
			this.$doms.title.text('评论努力加载中···');
			param = param || this.$param;
			this.hide().empty().showLoading();
			app.data.get( this.$geturl, param, this.onData, this );
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
					self.$doms.error.show().addClass('animated shake').text('(ˇˍˇ)评论列表请求超时，点击这里重试~');
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

			// 鼠标移入显示回复按钮
			app.event.proxy('section.M-commentIssuse', 'mouseenter mouseleave', this.eventEnterLeave, this);
			// 评论操作
			var op = $('.M-commentIssuseHeadOp', this.$doms.list);
			app.event.proxy( op, 'click', 'span', this.eventClickOp, this );
		},

		// 评论选项鼠标移入移出事件
		eventEnterLeave: function( evt, elm ) {
			switch( evt.type ) {
				case 'mouseenter':
					$(elm).find('.M-commentIssuseHeadOp').addClass('fadeIn animated').show();
				break;
				case 'mouseleave':
					$(elm).find('.M-commentIssuseHeadOp').removeClass('fadeIn').hide();
				break;
			}
			return false;
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
								'回复' + '<span class="nick">' + pnick + '</span>' + '：',
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
							(this.$hasOp && info.passed) ? '<span data-id="'+ info.id +'" class="op reply" title="回复TA"/>' : '',
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
	exports.list = $.extend( false, {}, CommentList );

	/*
	 * 评论表单 参数config：
	 * {
	 *	'target': DOM,
	 *	'submitTxt': Object,
	 *	'data': Object,
	 *	'posturl': String
	 *	'hasContact': Boolean
	 *	'silence': Boolean
	 * }
	 */
	var CommentForm = {
		init: function( config ) {
			this.$target = config.target;
			this.$data = config.data; // 回复评论时的数据
			this.$posturl = config.posturl || dc.addcomment,
			this.$imageUrl = dc.getthecode;
			this.$hasContact = config.hasContact,
			this.$pushing = false; // 评论是否正在提交
			this.$silence = config.silence, // 评论成功后是否发通知
			this.$submitTxt = {
				'init'   : config.submitTxt && config.submitTxt.init || '发表评论',
				'pushing': config.submitTxt && config.submitTxt.pushing || '正在提交……',
				'success': config.submitTxt && config.submitTxt.success || '评论成功！',
				'error'  : config.submitTxt && config.submitTxt.error || '评论失败请重试'
			};
			this.$holderTxt = {
				'content': config.holderTxt && config.holderTxt.content || '[必填] 在这里输入评论内容~',
				'nick'   : config.holderTxt && config.holderTxt.nick || '[必填] 在这输入您的昵称，不超过16个字符。',
				'link'   : config.holderTxt && config.holderTxt.link || '[选填] 这里可以输入您的网址(如:www.tangbc.com)，链接会加在您的昵称上。',
				'contact': config.holderTxt && config.holderTxt.contact || '[选填] 联系方式(比如Email,QQ,微信)',
				'code'   : config.holderTxt && config.holderTxt.code || '输入验证码'
			}
			this.build();
			return this;
		},

		// 创建表单
		build: function() {
			var holderTxt = this.$holderTxt;
			if ( this.$data && this.$data.content ) {
				var content = util.removeTags( this.$data.content );
				content = content.trim();
				var brief = content.length > 20 ? content.substr(0, 20) + '……' : content;
				holderTxt.content = '[必填] 回复“'+ this.$data.author +'”的评论：“' + brief + '”';
			}
			var dom = $([
				'<div class="M-commentForm">',
					'<textarea class="M-commentFormText" placeholder="'+ holderTxt.content +'"></textarea>',
					'<input type="text" class="M-commentFormNick" placeholder="'+ holderTxt.nick +'"/>',
					'<input type="text" class="M-commentFormLink" placeholder="'+ holderTxt.link +'"/>',
					this.$hasContact ? '<input type="text" class="M-commentFormContact" placeholder="'+ holderTxt.contact +'"/>' : '',
					'<div class="M-commentFormFooter">',
						'<input class="M-commentFormFooterCode"  placeholder="'+ holderTxt.code +'">',
						'<img class="M-commentFormFooterPic" title="点击更换验证码" src="'+ this.$imageUrl +'"/>',
						'<span class="M-commentFormFooterTips"/>',
						'<button class="M-commentFormFooterSubmit">'+ this.$submitTxt.init +'</button>',
						'<button class="M-commentFormFooterReset">重置</button>',
					'</div>',
				'</div>'
			].join(''));
			dom.appendTo( this.$target );

			this.$doms = {
				'text'     : $('.M-commentFormText', dom),
				'nick'     : $('.M-commentFormNick', dom),
				'link'     : $('.M-commentFormLink', dom),
				'contact'  : $('.M-commentFormContact', dom),
				'code'     : $('.M-commentFormFooterCode', dom),
				'image'    : $('.M-commentFormFooterPic', dom),
				'tips'     : $('.M-commentFormFooterTips', dom),
				'reset'    : $('.M-commentFormFooterReset', dom),
				'submit'   : $('.M-commentFormFooterSubmit', dom)
			}

			// 读取cookie值
			var nickName = app.cookie.get('usernickname');
			var link = app.cookie.get('userlink');
			if ( nickName ) {
				this.$doms.nick.val( nickName );
			}
			if ( link ) {
				this.$doms.link.val( link );
			}

			// 绑定重置
			app.event.bind( this.$doms.reset, 'click.reset', this.eventClickReset, this );
			// 绑定提交
			app.event.bind( this.$doms.submit, 'click.submit', this.eventClickSubmit, this );
			// 绑定验证码输入框失去焦点
			// app.event.bind( this.$doms.code, 'blur.code', this.eventBlurCode, this );
			// 绑定更换验证码
			app.event.bind( this.$doms.image, 'click.image', this.eventClickImage, this );
		},

		// 获取提交数据
		getData: function() {
			return {
				'content' : util.htmlEncode( this.$doms.text.val() ),
				'author'  : this.$doms.nick.val().trim(),
				'link'    : this.$doms.link.val().trim(),
				'code'    : this.$doms.code.val().trim(),
				'contact' : this.$hasContact ? this.$doms.contact.val().trim() : '',
				'postid'  : this.$data && this.$data.postid, // 所属文章id
				'id'      : this.$data && this.$data.id // 原评论id
			}
		},

		// 点击重置
		eventClickReset: function() {
			this.reset();
			return false;
		},

		// 重置表单
		reset: function(error) {
			this.$doms.text.val('').focus();
			this.$doms.code.val('');
			if ( this.hasContact ) {
				this.$doms.contact.val('');
			}
			if ( !app.cookie.get('usernickname') ) {
				this.$doms.nick.val('');
			}
			if ( !app.cookie.get('userlink') ) {
				this.$doms.link.val('');
			}
		},

		// 移除模块内对事件的绑定
		resetEvent: function() {
			app.event.unbind(this.$doms.reset, 'click.reset');
			app.event.unbind(this.$doms.submit, 'click.submit');
			// app.event.unbind(this.$doms.code, 'blur.code');
			app.event.unbind(this.$doms.image, 'click.image');
			return this;
		},

		// 表单验证
		validate: function( data ) {
			if ( data.content === '' ) {
				tooltip.setTip({
					'refer': this.$doms.text,
					'arrow': {'position': 'top'},
					'offset': {'left': 10, 'top': 25},
					'content': '评论内容不能为空~',
					'width': 140
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
					'width': 120
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
					'width': 130
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
			if ( this.$pushing ) {
				return false;
			}
			if ( this.validate( data ) ) {
				this.$pushing = true;
				this.$doms.submit.addClass('pushing').text( this.$submitTxt.pushing );
				app.data.post( this.$posturl, data, this.onData, this );
			}
			return false;
		},

		// 评论提交结果
		onData: function( err, res ) {
			var self = this;
			var txt = '';
			var cname = app.cookie.get('usernickname');
			var clink = app.cookie.get('userlink');

			// 提交成功
			if ( res && res.success ) {
				txt = '<span class="ok animated fadeIn"><i class="M-iconOk">√</i>提交成功！审核后即可在留言列表显示。</span>';
				self.$doms.submit.removeClass('pushing error').addClass('success').text( self.$submitTxt.success );
				self.$res = res.result;
				self.reset();

				if ( !cname || cname !== self.$res.author ) {
					app.cookie.set('usernickname', self.$res.author);
				}
				if ( !clink || clink !== self.$res.url ) {
					app.cookie.set('userlink', self.$res.url);
				}

				// 发通知给dialog自动隐藏
				if ( this.$silence ) {
					setTimeout(function() {
						dialog.hide( self.afterDialogHide, self );
					}, 1000);
				}

				return false;
			}
			// 提交失败
			else {
				this.$pushing = false;
				self.$doms.submit.removeClass('pushing success').addClass('error').text( self.$submitTxt.error );
				if ( err ) {
					txt = [
						'<span class="warning animated fadeIn">',
							'<i class="M-iconWarning">×</i>',
							[err.status, err.message].join(', '),
						'</span>'
					].join('');
				}
				if ( res && !res.success ) {
					txt = [
						'<span class="warning animated fadeIn">',
							'<i class="M-iconWarning">×</i>',
							res.message,
						'</span>'
					].join('');
				}
			}
			this.$doms.tips.html( txt );
		},

		// 对话框隐藏, 将新增的评论发给评论列表
		afterDialogHide: function() {
			app.messager.fire('commentAdded', this.$res);
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
			self.$doms.code.val('').focus();
			// TODO：有更好的办法么？
			setTimeout(function() {
				$(elm).attr('src', self.$imageUrl + '?ts=' + evt.timeStamp);
			}, 500);
			app.animate.play($(elm), 'flipOutY');
			return false;
		}
	}
	exports.form = $.extend( false, {}, CommentForm );

	/*
	 * 评论弹窗 参数config：
	 * {
	 *	'title': String
	 * }
	 */
	var popwin = {
		// config配置参数：{title: 对话框标题}
		init: function( config ) {
			this.$dialogBody = dialog
				.init({
					'height': 24
				})
				.setTitle( config.title )
				.show()
				.getBody();
			return this;
		},

		// 设置表单数据
		setData: function( data ) {
			// 创建评论表单
			this.$form = $.extend( false, {}, CommentForm );
			this.$dialogBody.empty();
			this.$form.init({
				'target': this.$dialogBody,
				'data': data,
				'silence': true
			});

			// 对话框关闭 解除绑定
			app.messager.on('dialogClosed', this.onDialogClosed, this);
		},

		// 对话框关闭事件
		onDialogClosed: function() {
			this.$form.resetEvent();
			return false;
		}
	}
});