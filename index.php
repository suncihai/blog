<?php
	// 只匹配iPhone和Android客户端
	$regex_match = '/(iphone|android)/i';
	$isWap = preg_match( $regex_match, strtolower($_SERVER['HTTP_USER_AGENT']) );
	if( $isWap ) {
		// header( 'HTTP/1.1 301 Moved Permanently' );
		header('Location: http://'.$_SERVER['HTTP_HOST'].'/blog/waproot/');
	}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8"/>
	<title>应用加载中……</title>
	<script type="text/javascript" src="http://<?php echo $_SERVER['HTTP_HOST']; ?>/blog/dist/sea/sea.js"></script>
	<script type="text/javascript" src="http://<?php echo $_SERVER['HTTP_HOST']; ?>/blog/dist/core/init.js"></script>
	<style>
	noscript{
		font-family: Arial, 'Microsoft Yahei'; display: block; width: 550px; height: 80px;
		position: absolute; left: 50%; top: 50%; margin-left: -275px; margin-top: -40px;
		text-align: center; font-size: 35px; color: #666; text-shadow: 2px 2px 3px #CCC;
	}
	</style>
</head>
<body>
	<noscript>请开启浏览器JavaScript哦~~~~</noscript>
</body>
</html>