/**
 * [页脚模块]
 */
define(function(require, exports, module) {
	var app = require('app');
	var util = app.util;
	var $ = app.jquery;

	var Footer = app.Container.extend({
		init: function(config) {
			// 默认的语言
			var lang = app.cookie.get('lang') || 'zhCN';

			config = app.cover(config, {
				'class'   : 'M-footer',
				'template': 'template/modules/footer.html',
				'vModel'  : {
					// copyright
					'copy'       : app.config('copyright'),
					// 多语言选项
					'langs'      : [],
					// 当前所选语言字段
					'lang'       : lang,
					// 当前所选语言名称
					'langText'   : app.config('lang/' + lang),
					// 点击弹出语言选择下拉
					'vmClickLang': this.eventClickLang
				}
			});
			this.$doc = $(document);
			this.Super('init', arguments);
		},

		/**
		 * 布局视图渲染完成
		 */
		viewReady: function() {
			var el = this.getDOM();
			var c = this.getConfig();

			// 设置可选的语言数组
			this.setLangs();

			this.$doms = {
				'wraper': c.target,
				'select': el.find('.M-footerLangSelect')
			};

			// 绑定语言选择事件
			this.proxy(this.$doms.select, 'click', 'a', 'eventSelectLang');
		},

		/**
		 * 设置可选的语言下拉数据
		 */
		setLangs: function() {
			var langs = [];
			var langMap = app.config('lang');

			util.each(langMap, function(text, type) {
				langs.push({
					'type': type,
					'text': text
				});
			});

			this.vm.set('langs', langs);
		},

		/**
		 * 点击弹出语言选择下拉
		 */
		eventClickLang: function(evt) {
			this.$timeStamp = evt.timeStamp;
			this.showSelect();

			// 监听空白点击
			this.bind(this.$doc, 'click.blank', 'eventClickBlank');
			return false;
		},

		/**
		 * 下拉菜单语言点击事件
		 */
		eventSelectLang: function(evt, elm) {
			var lang = $(elm).attr('data-type');
			this.hideSelect();

			if (lang === this.vm.get('lang')) {
				return false;
			}

			this.changeLang(lang);
			return false;
		},

		/**
		 * 设置语言
		 * @param   {String}  lang  [语言字段]
		 */
		changeLang: function(lang) {
			if (!util.has(lang, app.config('lang'))) {
				app.tooltip.setTip({
					'arrow'  : false,
					'type'   : 'warning',
					'content': T('不存在的语言：{1}', String(lang))
				});
				return false;
			}

			this.vm.set({
				'lang'    : lang,
				'langText': app.config('lang/' + lang)
			});

			app.lang.setLang(lang, true);
		},

		/**
		 * 空白点击事件
		 */
		eventClickBlank: function(evt) {
			if (evt.timeStamp !== this.$timeStamp) {
				this.hideSelect();
			}
		},

		/**
		 * 显示多语言下拉框
		 */
		showSelect: function() {
			app.animate.play(this.$doms.select.show(), 'zoomIn', 'fast');
			return this;
		},

		/**
		 * 隐藏多语言下拉框
		 */
		hideSelect: function() {
			app.animate.play(this.$doms.select, 'zoomOut', 'fast', function() {
				this.$doms.select.hide();
				this.unbind(this.$doc, 'click.blank');
			}, this);
			return this;
		},

		// 显示页脚
		hide: function() {
			this.$doms.wraper.hide();
			return this;
		},

		// 隐藏页脚
		show: function() {
			this.$doms.wraper.show();
			return this;
		},

		// 消息控制页脚的显示隐藏
		onSwitchFooter: function(ev) {
			var param = ev.param;
			if (param) {
				this.show();
			}
			else {
				this.hide();
			}
		}
	});
	exports.base = Footer;
});