/**
 * [侧边栏模块(栏目页和文章页)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout');
	var util = require('util');
	var C = require('@core/config');

	var dc = C.dataCenter;
	var Aside = layout.doms.aside;

	// HTML结构
	var html = [
		'<div class="P-aside">',
			'<div class="P-aside-me"></div>',
			'<div class="P-aside-list">',
				'<dl class="P-aside-list-dl">',
					'<dt class="P-aside-list-dt"></dt>',
					'<dd class="P-aside-list-dd">',
						'<ul class="P-aside-list-dd-ul"/>',
					'</dd>',
				'</dl>',
			'</div>',
			'<div class="P-aside-others"></div>',
		'</div>'
	].join('');

	$(html).appendTo( Aside );
	var doms = {
		'aside': 	$('.P-aside', Aside),
		'me': 		$('.P-aside-me', Aside),
		'list': 	$('.P-aside-list', Aside),
		'listDL': 	$('.P-aside-list-dl', Aside),
		'listDT': 	$('.P-aside-list-dt', Aside),
		'listDD': 	$('.P-aside-list-dd', Aside),
		'listDDul':	$('.P-aside-list-dd-ul', Aside),
		'others': 	$('.P-aside-others', Aside)
	}
	exports.doms = doms;

	/**
	 * build 侧边栏初始化
	 */
	exports.init = function() {
		this.buildMe()
			.buildList()
			.buildOthers();
	}

	/**
	 * TODO：清空后再创建出现无法找到HTML元素节点
	 * empty 清空aside
	 */
	exports.empty = function() {
		layout.doms.aside.empty();
		return false;
	}

	/**
	 * buildMe 构建自我介绍
	 * @return {type} [Aside]
	 */
	exports.buildMe = function() {
		$([
			'<dl class="P-aside-me-dl">',
				'<dt class="P-aside-me-dt">About Me</dt>',
				'<dd class="P-aside-me-dd">关于我的信息</dd>',
			'</dl>'
		].join('')).appendTo( doms.me );
		return this;
	}

	/**
	 * buildList 构建文章列表
	 * @return {type} [Aside]
	 */
	exports.buildList = function ( num ) {
		var requestParam = util.mergeParam( C.listOption );

		// 拉取数据
		$.ajax({
			'url': dc.listtitle,
			'method': 'get',
			'dataType': 'json',
			'data': requestParam,
			'success': fnSuccess,
			'error': fnError
		});

		/**
		 * fnSuccess 请求成功
		 * @param  {JSON} res [返回数据]
		 * @return {NULL}     [无返回值]
		 */
		function fnSuccess( res ) {
			if( !res.success ) {
				doms.list.html('拉取数据出了点问题~');
				return;
			}
			$([
				'<span class="opt" data-id="1">NEW</span>',
				'<span class="cube">■</span>',
				'<span class="opt" data-id="2">JS</span>',
				'<span class="cube">■</span>',
				'<span class="opt" data-id="3">CSS</span>',
				'<span class="cube">■</span>',
				'<span class="opt" data-id="4">UED</span>'
			].join('')).appendTo( doms.listDT );
			$.each( res.result.items, createList );
		}

		/**
		 * createList 循环生成列表
		 * @param  {Number} idx  [序号]
		 * @param  {Object} item [选项对象]
		 * @return {NULL}        [无返回值]
		 */
		function createList( idx, item ) {
			var lis = [];
			var archive = util.getKeyName( item.archive, C.cat );
			var date = item.publishDate.toString().slice( 0, 10 );
			lis.push([
				'<li class="art-item" data-id="'+ idx +'">',
					'<a href="#'+ archive +'/'+ item.id +'" class="art-anchor">',
						'<span class="art-title" title="'+ item.title +'">'+ item.title +'</span>',
						'<em class="art-archive" title="文章分类：'+ archive +'">'+ archive +'</em>',
						'<em class="art-date" title="发布日期：'+ date +'">'+ date +'</em>',
						'<em class="art-comments" title="'+ item.comments +'条评论">'+ item.comments +'评论</em>',
					'</a>',
				'</li>',
				'<li class="art-line"/>'
			].join(''));
			$(lis).appendTo( doms.listDDul );
		}

		/**
		 * fnError 请求失败
		 * @param  {JSON} msg [错误信息]
		 * @return {NULL}     [无返回值]
		 */
		function fnError( msg ) {
			util.error('数据拉取失败！错误码:' + msg.status + ', 错误信息:' + msg.statusText);
		}

		return this;
	}

	/**
	 * buildOthers 构建底部展示信息
	 * @return {type} [Aside]
	 */
	exports.buildOthers = function() {
		doms.others.html('其他展示信息');
		return this;
	}

});