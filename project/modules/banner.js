/**
 * [博客Banner模块]
 */
define(function( require, exports ) {
	var $ = require('jquery');
	var layout = require('layout').base;

	var Banner = {
		// 创建DOM结构
		build: function() {
			var target = layout.getDOM('blog/banner');
			// 布局
			var dom = $([
				'<div class="M-banner">',
					// 列表banner
					'<div class="M-bannerArchive">',
						'<div class="content"/>',
					'</div>',
					// 内容banner
					'<div class="M-bannerArticle">',
						'<h1 class="title"/>',
						'<div class="info">',
							'<span class="time"/>',
							'<span class="tag"/>',
							'<span class="comments"/>',
						'</div>',
					'</div>',
				'</div>'
			].join('')).appendTo( target );

			// dom缓存
			this.$doms = {
				'main': dom,
				'archive': dom.find('.M-bannerArchive'),
				'archives': {
					'content': dom.find('.content')
				},

				'article': dom.find('.M-bannerArticle'),
				'articles': {
					'title': dom.find('.title'),
					'time': dom.find('.time'),
					'tag': dom.find('.tag'),
					'comments': dom.find('.comments')
				}
			}

			this.$domReady = true;
		},

		// 设置数据
		setData: function( data ) {
			if( !this.$domReady ) {
				this.build();
			}
			if( !this.$show ) {
				this.show();
			}
			var type = data['type'];
			switch( type ) {
				case 'article':
					this.setArticleInfo( data );
				break;
				case 'archive':
					this.setArchiveInfo( data );
				break;
			}
		},

		// 文章页
		setArticleInfo: function( info ) {
			var dom = this.$doms.articles;
			this.$doms.article.show().siblings().hide();
			dom.title.text( info['title'] );
			dom.time.text( info['time'] );
			dom.tag.text( info['tag'] );
			dom.comments.text( info['comments'] );
		},

		// 列表页
		setArchiveInfo: function( info ) {
			var dom = this.$doms.archives;
			this.$doms.archive.show().siblings().hide();
			dom.content.html( info['content'] || "" );
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
	exports.base = Banner;
});