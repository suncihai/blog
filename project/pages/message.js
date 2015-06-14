/**
 * [留言页面]
 */
define(function( require, exports ){
	var app = require('app');
	var c = app.getConfig();
	var dc = c.dataCenter;
	var util = require('util');
	var $ = require('jquery');

	var layout = require('layout').base;
	var banner = require('@modules/banner').base;
	var tooltip = require('@modules/tooltip').tooltip.init();

	var Message = {
		init: function( data ) {
			this.$ = {};
			this.$tip = '';
			this.$data = data;
			this.$subDoms = {}; // 子dom对象缓存
			this.$imageUrl = dc.getthecode;
			this.$pushing = false;
			this.$param = $.extend({}, c.commentParam);
			this.$submitTxt = {
				'init'   : '发表留言',
				'pushing': '正在提交……',
				'success': '提交成功！',
				'error'  : '提交失败请重试'
			};
			this.$holder = {
				'textarea': '[必填] 在这里输入留言的内容~',
				'nick'    : '[必填] 在这里输入昵称',
				'url'     : '[选填] 网址(比如博客/微博/知乎主页url)',
				'contact' : '[选填] 联系方式(比如Email,QQ,微信)',
				'code'    : '输入验证码'
			}
			layout.showFooter().setTitle( c.archiveTitle[data.name] );
			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt animated fadeIn fts28 pt5">可以随意发表：无聊的、建议的、拍砖的、批评的……</h1>'
			});
			this.build();
			return this;
		},

		build: function() {
			var target = this.$data.dom;
			var msgDom = $('<div class="M-message"/>').appendTo( target );
			// 留言左侧
			var main = $('<div class="M-messageMain"/>').appendTo( msgDom );
			// 右侧信息
			var info = $('<div class="M-messageInfo"/>').appendTo( msgDom );

			// 选项卡
			$([
				'<ul class="tabHead">',
					// '<li>留言列表</li>',
					'<li class="act">我要留言</li>',
				'</ul>',
				'<div class="tabBody">',
					// 列表
					'<div class="tabCont">',
						'<div class="M-messageMainList"/>',
						'<div class="M-messageMainPager"/>',
					'</div>',
					// 表单
					'<div class="tabCont">',
						'<div class="M-messageMainForm"/>',
					'</div>',
				'</div>'
			].join('')).appendTo( main );

			// DOM缓存
			this.$doms = {
				'info'   : info,
				'form'   : main.find('.M-messageMainForm'),
				'list'   : main.find('.M-messageMainList'),
				'pager'  : main.find('.M-messageMainPager'),
				'tabCont': main.find('.tabCont')
			}

			// 点击切换选项卡
			app.event.proxy( main.find('.tabHead'), 'click', 'li', this.eventSwitchTab, this );

			// 构建细节
			this.buildForm().buildInfo();
		},

		// 切换选项卡
		eventSwitchTab: function( evt, elm ) {
			var index = $(elm).index();
			if ( !$(elm).hasClass('act') ) {
				$(elm).addClass('act').siblings('li').removeClass('act');
				this.$doms.tabCont.eq( index ).show().siblings().hide();
			}
			return false;
		},

		/*
		 * 创建留言表单
		 */
		buildForm: function() {
			var form = this.$doms.form;
			$([
				'<textarea placeholder="'+ this.$holder.textarea +'" class="textarea"></textarea>',
				'<input placeholder="'+ this.$holder.nick +'" type="text" class="nick"/>',
				'<input placeholder="'+ this.$holder.url +'" type="text" class="url"/>',
				'<input placeholder="'+ this.$holder.contact +'" type="text" class="contact"/>',
				'<div class="footer">',
					'<input placeholder="'+ this.$holder.code +'" type="text" class="code"/>',
					'<img class="image" title="点击更换验证码" src="'+ this.$imageUrl +'"/>',
					'<span class="tips">'+ this.$tip +'</span>',
					'<button class="submit">'+ this.$submitTxt.init +'</button>',
					'<button class="reset">重置</button>',
				'</div>'
			].join('')).appendTo( form );

			// 表单DOM缓存
			this.$subDoms.form = {
				'textarea' : form.find('.textarea'),
				'nick'     : form.find('.nick'),
				'url'      : form.find('.url'),
				'contact'  : form.find('.contact'),
				'code'     : form.find('.code'),
				'tips'     : form.find('.tips'),
				'submit'   : form.find('.submit')
			}

			// 读取cookie值
			var nickName = app.cookie.get('usernickname');
			var link = app.cookie.get('userlink');
			if ( nickName ) {
				this.$subDoms.form.nick.val( nickName );
			}
			if ( link ) {
				this.$subDoms.form.url.val( link );
			}

			// 点击更换验证码
			app.event.bind( form.find('.image'), 'click', this.eventChangeCode, this );
			// 点击重置
			app.event.bind( form.find('.reset'), 'click', this.eventReset, this );
			// 点击提交
			app.event.bind( this.$subDoms.form.submit, 'click', this.eventSubmit, this );
			return this;
		},

		// 点击更换验证码
		eventChangeCode: function( evt, elm ) {
			var self = this;
			this.$subDoms.form.code.focus();
			setTimeout(function() {
				$(elm).attr('src', self.$imageUrl + '?ts=' + evt.timeStamp);
			}, 500);
			app.animate.play($(elm), 'flipOutY');
		},

		// 点击重置
		eventReset: function() {
			this.$subDoms.form.textarea.val('');
			this.$subDoms.form.code.val('');
			this.$subDoms.form.contact.val('');
			if ( !app.cookie.get('usernickname') ) {
				this.$subDoms.form.nick.val('');
			}
			if ( !app.cookie.get('userlink') ) {
				this.$subDoms.form.url.val('');
			}
			return false;
		},

		// 获取表单数据
		getData: function() {
			return {
				'content' : util.htmlEncode( this.$subDoms.form.textarea.val() ),
				'author'  : this.$subDoms.form.nick.val().trim(),
				'link'    : this.$subDoms.form.url.val().trim(),
				'contact' : this.$subDoms.form.contact.val().trim(),
				'code'    : this.$subDoms.form.code.val().trim()
			}
		},

		// 表单验证
		validate: function( data ) {
			if ( data.content === '' ) {
				tooltip.setTip({
					'refer': this.$subDoms.form.textarea,
					'arrow': {'position': 'top'},
					'offset': {'left': 10, 'top': 25},
					'content': '请填写留言内容~',
					'width': 140
				});
				this.$subDoms.form.textarea.focus();
				return false;
			}
			if ( data.author === '' ) {
				tooltip.setTip({
					'refer': this.$subDoms.form.nick,
					'arrow': {'position': 'bottom'},
					'offset': {'left': 0, 'top': -45},
					'content': '起个称呼吧~',
					'width': 120
				});
				this.$subDoms.form.nick.focus();
				return false;
			}
			if ( data.code === '' ) {
				tooltip.setTip({
					'refer': this.$subDoms.form.code,
					'arrow': {'position': 'bottom'},
					'offset': {'left': 0, 'top': -45},
					'content': '验证码不能为空~',
					'width': 130
				});
				this.$subDoms.form.code.focus();
				return false;
			}
			return true;
		},

		// 点击提交
		eventSubmit: function( evt ) {
			var data = this.getData();
			tooltip.setTimeStamp( evt.timeStamp );
			if ( this.$pushing ) {
				return false;
			}
			if ( this.validate( data ) ) {
				this.$pushing = true;
				this.$subDoms.form.submit.addClass('pushing').text( this.$submitTxt.pushing );
				app.data.post( dc.addmessage, data, this.onData, this );
			}
		},

		onData: function( err, res ) {
			var txt = '';
			var cname = app.cookie.get('usernickname');
			var clink = app.cookie.get('userlink');
			// 提交成功
			if ( res && res.success ) {
				txt = '<span class="ok animated fadeIn"><i class="M-iconOk">√</i>提交成功！感谢你的留言 ^_^</span>';
				this.$subDoms.form.submit.removeClass('pushing error').addClass('success').text( this.$submitTxt.success );
				this.eventReset();
				if ( !cname || cname !== res.result.author ) {
					app.cookie.set('usernickname', res.result.author);
				}
				if ( !clink || clink !== res.result.url ) {
					app.cookie.set('userlink', res.result.url);
				}
			}
			// 提交失败
			else {
				this.$pushing = false;
				this.$subDoms.form.submit.removeClass('success pushing').addClass('error').text( this.$submitTxt.error );
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
			this.$subDoms.form.tips.html( txt );
		},

		// 创建右侧信息
		buildInfo: function() {
			var info = this.$doms.info;
			$([
				'<div class="infoBox">',
					'<h2 class="title">博主信息</h2>',
					'<ul>',
						'<li>',
							'<label>所在地：</label>',
							'<span>广东广州</span>',
						'</li>',
						'<li>',
							'<label>联系方式：</label>',
							'<span>went2077@gmail.com</span>',
						'</li>',
					'</ul>',
					'<p class="sayother">欢迎给我提各种改进建议或者博客框架目前存在的BUGs，谢谢！</p>',
				'</div>'
			].join('')).appendTo( info );
			return this;
		}
	}
	exports.base = Message;
});