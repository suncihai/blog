/**
 * [评论/留言表单模块]
 */
define(function(require, exports) {
	var sugar = require('sugar');
	var util = sugar.util;
	var $ = sugar.jquery;
	var tooltip = sugar.tooltip;

	var api = sugar.config('api');

	// 评论表单
	var CommentForm = sugar.Container.extend({
		init: function(config) {
			config = sugar.cover(config, {
				'class'      : 'M-commentForm',
				'template'   : 'template/modules/commentForm.html',
				// 评论/留言保存地址
				'saveUrl'    : '',
				// 是否有联系方式
				'hasContact' : false,
				'vModel'     : {
					// 评论内容
					'content'      : '',
					// 评论昵称
					'nick'         : '',
					// 网页链接
					'link'         : '',
					// 联系方式
					'contact'      : '',
					// 输入的验证码
					'code'         : '',
					// 验证码获取地址
					'codeSrc'      : api.getthecode,
					// 是否显示联系方式
					'hasContact'   : config.hasContact,
					// 点击更换验证码
					'vmClickChange': this.eventClickImage,
					// 点击提交
					'vmClickSubmit': this.eventSubmit,
					// 点击重置
					'vmClickReset' : this.eventReset,
					// 提交按钮文字
					'putText'      : T('发表评论'),
					// 提交按钮状态class
					'isPushing'    : false,
					'isSuccess'    : false,
					'isError'      : false
				}
			});
			// 是否正在提交数据
			this.$pushing = false;
			this.Super('init', arguments);
		},

		viewReady: function() {
			var el = this.getDOM();
			// DOM缓存
			this.$doms = {
				'text': el.find('.M-commentFormText'),
				'nick': el.find('.M-commentFormNick'),
				'code': el.find('.M-commentFormFooterCode')
			}

			this.setCookieValue();
		},

		/**
		 * 设置cookie的值
		 */
		setCookieValue: function() {
			var vm = this.vm.$;
			var link = sugar.cookie.get('userlink');
			var nickName = sugar.cookie.get('usernickname');
			if (link) {
				vm.link = link;
			}
			if (nickName) {
				vm.nick = nickName;
			}
		},

		/**
		 * 设置表单参数，来自评论列表的广播消息
		 */
		onSetCommentFormParam: function(ev) {
			this.$param = ev.param;
			return false;
		},

		/**
		 * 获取提交数据
		 */
		getData: function() {
			var vm = this.vm.$;
			var param = this.$param;
			var c = this.getConfig();
			return {
				'content': util.htmlEncode(vm.content),
				'author' : vm.nick,
				'link'   : vm.link,
				'code'   : vm.code,
				'contact': c.hasContact ? vm.contact : '',
				// 所属文章id
				'postid' : param && param.artid,
				// 原评论id
				'id'     : param && param.pcid
			}
		},

		/**
		 * 点击更换验证码
		 */
		eventClickImage: function(evt) {
			var vm = this.vm.$;
			var elm = $(evt.target);
			this.setTimeout(function() {
				vm.codeSrc = api.getthecode + '?ts=' + (evt.timeStamp || util.random());
			}, 500);
			sugar.animate.play(elm, 'flipOutY');
			return false;
		},

		/**
		 * 设置提交按钮的状态
		 */
		setSubmitStatus: function(status) {
			var sArray = Array(3);
			var tips = this.getConfig('vModel/putText');

			switch (status) {
				case 'pushing':
					tips = T('正在提交') + '<span class="textLoading"><i>···</i></span>';
					sArray[0] = true;
				break;
				case 'success':
					tips = '<i class="fa fa-check-circle mr3"></i>' + T('提交成功');
					sArray[1] = true;
				break;
				case 'error':
					tips = '<i class="fa fa-warning mr3"></i>' + T('提交失败, 请重试');
					sArray[2] = true;
				break;
			}

			this.vm.set({
				'putText'  : tips,
				'isPushing': sArray[0],
				'isSuccess': sArray[1],
				'isError'  : sArray[2]
			});
		},

		/**
		 * 点击提交按钮
		 */
		eventSubmit: function(evt) {
			var data = this.getData();
			tooltip.setTimeStamp(evt.timeStamp);

			if (this.$pushing) {
				return false;
			}

			if (this.validate(data)) {
				this.$pushing = true;
				this.setSubmitStatus('pushing');
				sugar.ajax.post(this.getConfig('saveUrl'), data, this.afterDataBack, this);
			}
		},

		/**
		 * 延迟展现（@todo: 这样真的好吗？）
		 */
		afterDataBack: function() {
			this.setTimeout('afterSubmit', 2000, arguments);
		},

		/**
		 * 数据请求回调
		 */
		afterSubmit: function(err, data) {
			if (err) {
				util.error(err);
				this.$pushing = false;
				// 更新按钮状态
				this.setSubmitStatus('error');
				// 提示错误信息
				tooltip.setTip({
					'arrow'  : false,
					'type'   : 'warning',
					'content': T(err.message)
				});
				// 重置验证码
				this.vm.set('codeSrc', api.getthecode + '?ts' + util.random());
				return false;
			}

			var result = data.result;

			this.setSubmitStatus('success');
			// 提示成功
			tooltip.setTip({
				'arrow'  : false,
				'type'   : 'success',
				'content': T('评论成功！')
			});

			// 更新cookie
			var clink = sugar.cookie.get('userlink');
			var cname = sugar.cookie.get('usernickname');
			var url = result.url;
			var author = result.author;
			if (!clink || (clink !== url)) {
				sugar.cookie.set('userlink', url);
			}
			if (!cname || (cname !== author)) {
				sugar.cookie.set('usernickname', author);
			}

			// 发消息通知已添加成功
			this.fire('commentSubmited', result);
		},

		/**
		 * 表单验证
		 */
		validate: function(data) {
			var domText = this.$doms.text;
			var domNick = this.$doms.nick;
			var domCode = this.$doms.code;

			if (data.content === '') {
				tooltip.setTip({
					'refer'     : domText.focus(),
					'arrow'     : 'top',
					'offsetLeft': 10,
					'offsetTop' : 25,
					'content'   : T('评论内容不能为空~'),
					'width'     : 140
				});
				return false;
			}
			if (data.author === '') {
				tooltip.setTip({
					'refer'     : domNick.focus(),
					'arrow'     : 'bottom',
					'offsetLeft': 0,
					'offsetTop' : -45,
					'content'   : T('昵称不能为空~'),
					'width'     : 120
				});
				return false;
			}
			if (data.code === '') {
				tooltip.setTip({
					'refer'     : domCode.focus(),
					'arrow'     : 'bottom',
					'offsetLeft': 0,
					'offsetTop' : -45,
					'content'   : T('验证码不能为空~'),
					'width'     : 130
				});
				return false;
			}
			return true;
		},

		/**
		 * 点击重置按钮
		 */
		eventReset: function() {
			this.reset();
		},

		/**
		 * 重置模块为初始状态
		 */
		reset: function() {
			this.$pushing = false;
			this.vm.reset();
			this.setCookieValue();
			return this;
		}
	});
	exports.base = CommentForm;
});