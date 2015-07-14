/**
 * [留言页面]
 */
define(function(require, exports, module) {
	var app = require('app');
	var c = app.getConfig();
	var api = c.api;
	// var util = require('util');
	var $ = require('jquery');

	var layout = require('layout');
	var banner = require('@modules/banner');
	var comment = require('@modules/comment');

	var Message = {
		init: function(data) {
			this.$ = {};
			this.$data = data;
			this.$param = $.extend({}, c.commentParam);
			layout.showFooter().setTitle(c.archiveTitle[data.name]);
			// banner设置
			banner.setData({
				'type': 'archive',
				'content': '<h1 class="bannerTxt animated fadeIn fts28 pt5">'+ T('可以随意发表：无聊的、建议的、拍砖的、批评的……') +'</h1>'
			});
			this.build();
			return this;
		},

		build: function() {
			var target = this.$data.dom;
			var msgDom = $('<div class="M-message"/>').appendTo(target);
			// 留言左侧
			var main = $('<div class="M-messageMain"/>').appendTo(msgDom);
			// 右侧信息
			var info = $('<div class="M-messageInfo"/>').appendTo(msgDom);

			// 选项卡
			$([
				'<ul class="tabHead">',
					'<li op-type="list">'+ T('留言列表') +'</li>',
					'<li op-type="form" class="act">'+ T('我要留言') +'</li>',
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
			].join('')).appendTo(main);

			// DOM缓存
			this.$doms = {
				'info'   : info,
				'form'   : main.find('.M-messageMainForm'),
				'list'   : main.find('.M-messageMainList'),
				'pager'  : main.find('.M-messageMainPager'),
				'tabCont': main.find('.tabCont')
			}

			// 点击切换选项卡
			app.event.proxy(main.find('.tabHead'), 'click', 'li', this.eventSwitchTab, this);

			// 构建细节
			this.buildForm().buildList().buildInfo();
		},

		// 切换选项卡
		eventSwitchTab: function(evt, elm) {
			var index = $(elm).index();
			var type = $(elm).attr('op-type');
			if (!$(elm).hasClass('act')) {
				// 切换容器
				$(elm).addClass('act').siblings('li').removeClass('act');
				this.$doms.tabCont.eq(index).show().siblings().hide();

				// 切到列表重新拉取数据
				if (type === 'list' && this.$.list) {
					this.$.list.load();
				}
			}
			return false;
		},

		/*
		 * 创建留言表单
		 */
		buildForm: function() {
			var form = this.$.form = comment.form;
			form.init({
				'target': this.$doms.form,
				'posturl': api.addmessage,
				'hasContact': true,
				'submitTxt': {
					'init'   : T('发表留言'),
					'pushing': T('正在提交……'),
					'success': T('留言成功！'),
					'error'  : T('留言失败请重试')
				},
				'holderTxt': {
					'content': T('[必填] 在这里输入留言的内容~'),
					'nick'   : T('[必填] 在这里输入昵称'),
					'link'   : T('[选填] 网址(比如博客/微博/知乎主页url)')
				},
				'successTxt': T('提交成功！')
				// 'successTxt': T('提交成功！等待审核……')
			});
			return this;
		},

		/*
		 * 创建留言列表
		 */
		buildList: function() {
			var list = this.$.list = comment.list;
			list.init({
				'target': this.$doms.list,
				'geturl': api.listmessage,
				'hasHead': false,
				'hasOp': false,
				'pageSize': 10, // 每页显示留言条数
				'hasFloor': false,
				'silence': false,
				'cls': 'M-messageMainListWidth'
			});
			return this;
		},

		/*
		 * 创建右侧信息
		 */
		buildInfo: function() {
			var info = this.$doms.info;
			$([
				'<div class="infoBox">',
					'<h2 class="title">'+ T('博主信息') + '</h2>',
					'<ul>',
						'<li>',
							'<label>'+ T('所在地：') + '</label>',
							'<span>'+ T('广东广州') + '</span>',
						'</li>',
						'<li>',
							'<label>'+ T('联系方式：') + '</label>',
							'<span>went2077@gmail.com</span>',
						'</li>',
					'</ul>',
					'<p class="item">'+ T('欢迎给我提各种改进建议或者博客框架目前存在的BUGs，谢谢！') +'</p>',
					'<p class="item">'+ T('博客的源码：') +'</p>',
					'<p class="item"><a href="https://github.com/tangbc/blog" target="_blank">https://github.com/tangbc/blog</a></p>',
				'</div>'
			].join('')).appendTo(info);
			return this;
		}
	}
	module.exports = Message;
});