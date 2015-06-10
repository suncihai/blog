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
	var banTxt = '可以随意发表：无聊的、建议的、拍砖的、批评的……';

	var Message = {
		init: function( data ) {
			this.$data = data;
			this.$subDoms = {}; // 子dom对象缓存
			this.$imageUrl = dc.getthecode;
			this.$holder = {
				'textarea': '[必填] 在这里输入留言的内容~',
				'nick': '[必填] 在这里输入昵称',
				'url': '[选填] 昵称链接网址(比如博客/微博/知乎主页url)',
				'contact': '[选填] 联系方式(比如Email,QQ,微信, 仅博主可见, 不会公开显示)',
				'code': '输入验证码'
			}
			layout.hideFooter().setTitle( c.archiveTitle[data.name] );
			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt animated fadeIn fts28 pt5">'+ banTxt +'</h1>'
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
					'<li>留言列表</li>',
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
			this.buildForm().buildList().buildPager().buildInfo();
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

		// 创建留言表单
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
					'<button class="submit">发表留言</button>',
					'<button class="reset">重置</button>',
				'</div>'
			].join('')).appendTo( form );
			// 表单DOM缓存
			this.$subDoms.form = {
				'textarea' : form.find('.textarea'),
				'nick'     : form.find('.nick'),
				'url'      : form.find('.url'),
				'contact'  : form.find('.contact'),
				'code'     : form.find('.code')
			}

			// 读取cookie值
			var nickName = app.cookie.get('usernickname');
			var link = app.cookie.get('userlink');
			if ( nickName ) {
				this.$subDoms.form.nick.val( nickName ).prop('disabled', true);
			}
			if ( link ) {
				this.$subDoms.form.url.val( link );
			}

			// 点击更换验证码
			app.event.bind( form.find('.image'), 'click', this.eventChangeCode, this );
			// 点击重置
			app.event.bind( form.find('.reset'), 'click', this.eventReset, this );
			// 点击提交
			app.event.bind( form.find('.submit'), 'click', this.eventSubmit, this );
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
					'width': 140,
					'name': 'content'
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
					'width': 120,
					'name': 'nick'
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
					'width': 130,
					'name': 'code'
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
			if ( this.validate( data ) ) {
				app.data.post( dc.addmessage, data, this.onData, this );
			}
		},

		onData: function( err, data ) {
			console.log(data);
		},

		// 创建留言列表
		buildList: function() {
			return this;
		},

		// 创建留言分页
		buildPager: function() {
			return this;
		},

		// 创建右侧信息
		buildInfo: function() {
			return this;
		}
	}
	exports.base = Message;
});