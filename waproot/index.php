<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<title>应用加载中……</title>
	<script type="text/javascript" src="http://<?php echo $_SERVER['HTTP_HOST']; ?>/blog/dist/sea/sea.js"></script>
	<script type="text/javascript" src="http://<?php echo $_SERVER['HTTP_HOST']; ?>/blog/waproot/boot/init.js?load_time=<?php echo time();?>"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
</head>
<body>
	<div class="G-frame">
		<div class="G-frameBody">
			<!-- 首页 -->
			<div class="G-frameBodyIndex">
				<div class="G-frameBodyIndexHead"></div>
				<div class="G-frameBodyIndexContent"></div>
				<div class="G-frameBodyIndexFooter"></div>
			</div>
			<!-- 博客 -->
			<div class="G-frameBodyBlog">
				<div class="G-frameBodyBlogHead"></div>
				<div class="G-frameBodyBlogBanner"></div>
				<div class="G-frameBodyBlogArchive"></div>
				<div class="G-frameBodyBlogArticle"></div>
				<div class="G-frameBodyBlogFooter"></div>
			</div>
			<!-- 空白页 -->
			<div class="G-frameBodyBlank"></div>
		</div>
	</div>
</body>
</html>