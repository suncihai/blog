/**
 * [评论/留言列表模块]
 */
define(function(require, exports) {
	var sugar = require('sugar');
	var util = sugar.util;
	var tooltip = sugar.tooltip;
	var prettyDate = require('@widget/prettyDate');

	// 初始请求参数
	var iparam = sugar.config('commentParam');

	// 评论列表基础模块
	var CommentList = sugar.Container.extend({
		init: function(config) {
			config = sugar.cover(config, {
				'class'    : 'M-comment',
				'template' : 'template/modules/commentList.html',
				// 评论/留言拉取地址
				'listUrl'  : '',
				// 是否有头部
				'hasHeader': false,
				// 是否有沙发
				'hasEmpty' : false,
				// loading图标是否是绿色
				'isGreen'  : false,
				'vModel'   : {
					// 是否有头部
					'hasHeader'     : config.hasHeader,
					// 是否有沙发
					'hasEmpty'      : config.hasEmpty,
					// 头部标题
					'title'         : T('评论'),
					// 是否显示加载状态
					'isLoading'     : false,
					// loading图标的颜色
					'isGreen'       : config.isGreen,
					// 评论数是否为0
					'isEmpty'       : true,
					// 是否显示分页器
					'showPager'     : false,
					// 评论列表
					'comments'      : [],
					// 是否显示刷新重试
					'isRefresh'     : false,
					// 点击添加评论
					'vmClickAdd'    : this.eventClickAdd,
					// 点击重新加载
					'vmClickRefresh': this.eventClickRefresh
				}
			});
			// 初始请求参数
			this.$param = util.copy(iparam);
			// 请求数据状态锁
			this.$dataReady = false;
			this.Super('init', arguments);
		},

		/**
		 * 布局视图初始化完成
		 */
		viewReady: function() {
			var c = this.getConfig();

			// 创建子模块（分页器）
			this.createTplModules();

			// 创建评论弹窗模块
			if (c.hasHeader) {
				this.createAsync('dialog', '@modules/dialog.base', {
					'width' : 35,
					'height': 22.4,
					'type'  : 'module',
					'title' : T('添加评论'),
					'module': '@modules/commentForm.base',
					'config': {
						'saveUrl': sugar.config('api/addcomment')
					}
				});
			}
		},

		/**
		 * 显示加载状态
		 */
		showLoading: function() {
			this.vm.set('isLoading', true);
			return this;
		},

		/**
		 * 隐藏加载状态
		 */
		hideLoading: function() {
			this.vm.set('isLoading', false);
			return this;
		},

		/**
		 * 选择的页码，来自分页模块的冒泡消息
		 */
		onPageSelected: function(ev) {
			var page = ev.param;
			this.$param.page = page;
			this.load();
			return false;
		},

		/**
		 * 评论添加成功，隐藏对话框，来自评论表单的冒泡消息，hasHeader==false时不触发
		 */
		onCommentSubmited: function(ev) {
			var dialog = this.getChild('dialog');
			this.setTimeout(function() {
				dialog.hide();
				this.load();
			}, 1000);
			return false;
		},

		/**
		 * 点击重新加载
		 */
		eventClickRefresh: function() {
			this.vm.set('isRefresh', false);
			this.load();
		},

		/**
		 * 加载评论列表
		 * @param   {Number}  artid  [文章id]
		 */
		load: function(artid) {
			var param;
			if (artid) {
				this.$artid = artid;
			}

			this.$dataReady = false;
			this.showLoading();

			param = !artid ? this.$param : util.extend(this.$param, {
				'artid': artid
			});

			sugar.ajax.get(this.getConfig('listUrl'), param, this.delayData, this);
		},

		/**
		 * 延迟展现
		 */
		delayData: function() {
			this.setTimeout('afterDataBack', 2000, arguments);
		},

		/**
		 * 请求数据回调
		 * @param   {Object}  err   [请求错误信息]
		 * @param   {Object}  data  [请求成功信息]
		 */
		afterDataBack: function(err, data) {
			this.$dataReady = true;
			this.hideLoading();

			if (err) {
				util.error(err);
				// 提示错误信息
				tooltip.setTip({
					'arrow'  : false,
					'type'   : 'warning',
					'content': T(err.message)
				});
				this.vm.set('isRefresh', true);
				return false;
			}

			var result = data.result;
			var items = result.items;
			var page = result.page;
			var pages = result.pages;
			var total = result.total;

			// 评论分页参数
			var pager = this.getChild('pager');
			var showPager = pages > 1;
			this.vm.set('showPager', showPager);
			if (pager && showPager) {
				pager.setParam({
					'page' : page,
					'pages': pages
				});
			}

			// 更新标题
			var title = total ? T('共{1}条评论', total) : T('没有评论，点击下面的沙发添加');

			// 构建列表
			this.setList(items);

			this.vm.set({
				'title'  : title,
				'isEmpty': items.length === 0
			});

			// 通知父模块数据已拉取完毕
			this.fire('commentDataLoaded');
		},

		/**
		 * 评论列表数据转换
		 * @param  {Array}  items  [评论数组]
		 */
		setList: function(items) {
			var comments = [];
			util.each(items, function(item) {
				// 评论回复
				var replies = [];
				if (util.isArray(item.replies)) {
					util.each(item.replies, function(reply) {
						replies.push({
							'nickName': reply.author,
							'url'     : reply.url ? ('//' + reply.url) : null,
							'date'    : prettyDate.format(reply.date),
							'content' : reply.content,
							'isAdmin' : reply.admin
						});
					});
				}

				comments.push({
					'nickName': item.author,
					'address' : item.address,
					'url'     : item.url ? ('//' + item.url) : null,
					'date'    : prettyDate.format(item.date),
					'content' : item.content,
					'replies' : replies
				});
			});
			this.vm.set('comments', comments);
		},

		/**
		 * 点击添加评论
		 */
		eventClickAdd: function() {
			var dialog = this.getChild('dialog');
			dialog.show();

			// 广播消息设置评论表单参数
			this.broadcast('setCommentFormParam', {
				'artid': this.$artid
			});
		},

		/**
		 * 重置模块为初始状态
		 */
		reset: function() {
			var chs = this.getChilds(true);
			util.each(chs, function(child) {
				if (util.isFunc(child.reset)) {
					child.reset();
				}
			});

			this.$param = util.copy(iparam);
			this.$dataReady = false;
			this.vm.reset();
			return this;
		}
	});
	exports.base = CommentList;
});