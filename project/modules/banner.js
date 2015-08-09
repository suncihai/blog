/**
 * [博客Banner模块]
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var util = require('util');
	var layout = require('layout');

	var Banner = {
		// 创建DOM结构
		build: function() {
			var target = layout.getDOM('blog/banner');
			// 布局
			var dom = $([
				'<div class="M-banner">',
					// 公共面包屑
					'<div class="M-bannerCrumbs"/>',
					// 列表banner
					'<div class="M-bannerArchive">',
						'<div class="content"/>',
					'</div>',
					// 内容banner
					'<div class="M-bannerArticle animated">',
						'<h1 class="title"/>',
						'<div class="info">',
							// 发布时间 
							'<span title="'+ T('发布时间') +'">',
								'<i class="fa fa-calendar mr3"></i>',
								'<span class="time"/>',
							'</span>',
							// 标签
							'<span class="tag ml1 mr1"/>',
							// 评论数
							'<span title="'+ T('评论数') +'">',
								'<i class="fa fa-comments mr3"></i>',
								'<span class="comments"/>',
							'</span>',
						'</div>',
					'</div>',
				'</div>'
			].join('')).appendTo(target);

			// dom缓存
			this.$doms = {
				'main'     : dom,
				'crumbs'   : dom.find('.M-bannerCrumbs'),
				
				'archive'  : dom.find('.M-bannerArchive'),
				'archives' : {
					'content': dom.find('.content')
				},

				'article'  : dom.find('.M-bannerArticle'),
				'articles' : {
					'title'    : dom.find('.title'),
					'time'     : dom.find('.time'),
					'tag'      : dom.find('.tag'),
					'comments' : dom.find('.comments')
				}
			}

			this.$domReady = true;
		},

		// 设置数据
		setData: function(data) {
			if (!this.$domReady) {
				this.build();
			}
			if (!this.$show) {
				this.show();
			}
			var type = data.type;
			switch(type) {
				case 'article':
					this.setArticleInfo(data);
				break;
				case 'archive':
					this.setArchiveInfo(data);
				break;
			}
			return this;
		},

		// 文章页
		setArticleInfo: function(info) {
			var dom = this.$doms.articles;
			this.$doms.article.addClass('fadeIn');
			this.$doms.article.show().siblings('.M-bannerArchive').hide();
			dom.title.text(info.title);
			dom.time.text(info.time);
			dom.tag.text(info.tag);
			dom.comments.text(info.comments);
		},

		// 列表页
		setArchiveInfo: function(info) {
			var dom = this.$doms.archives;
			this.$doms.article.removeClass('fadeIn');
			this.$doms.archive.show().siblings('.M-bannerArticle').hide();
			dom.content.html(info.content || "");
		},

		// 设置公共面包屑
		setCrumbs: function() {
			var args = util.argumentsToArray(arguments);
			var html = args.join('<span class="M-bannerCrumbsArrow">&gt;</span>');
			this.$doms.crumbs.html(html);
		},

		show: function() {
			this.$doms.main.show();
			this.$show = true;
		},

		hide: function() {
			this.$doms.main.hide();
			this.$show = false;
		}
	}
	module.exports = Banner;
});