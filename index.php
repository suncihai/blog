<?php
	// 只匹配iPhone和Android客户端
	$regMatch = '/(iphone|android)/i';
	$isWap = preg_match( $regMatch, strtolower($_SERVER['HTTP_USER_AGENT']) );
	if( $isWap ) {
		// header('HTTP/1.1 301 Moved Permanently');
		header('Location:http://'.$_SERVER['HTTP_HOST'].'/blog/waproot/');
	}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<title>应用加载中……</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
	<script type="text/javascript" src="http://<?php echo $_SERVER['HTTP_HOST']; ?>/blog/dist/sea/sea.js"></script>
	<script type="text/javascript" src="http://<?php echo $_SERVER['HTTP_HOST']; ?>/blog/dist/core/init.js"></script>
	<style>
	noscript{
		font-family: Arial, 'Microsoft Yahei'; display: block; width: 550px; height: 80px;
		position: absolute; left: 50%; top: 50%; margin-left: -275px; margin-top: -40px;
		text-align: center; font-size: 35px; color: #666; text-shadow: 2px 2px 3px #CCC;
	}
	</style>
	<script type="text/javascript">
	var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
	document.write(unescape("%3Cspan style='display:none;' id='cnzz_stat_icon_5606127'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s96.cnzz.com/stat.php%3Fid%3D5606127' type='text/javascript'%3E%3C/script%3E"));
	</script>
</head>
<body>
	<noscript>请开启浏览器JavaScript哦~~~~</noscript>
<!--
	 _________     _       ____  _____   ______  ______      ______
	|  _   _  |   / \     |_   \|_   _|.' ___  ||_   _ \   .' ___  |
	|_/ | | \_|  / _ \      |   \ | | / .'   \_|  | |_) | / .'   \_|
	    | |     / ___ \     | |\ \| | | |   ____  |  __'. | |
	   _| |_  _/ /   \ \_  _| |_\   |_\ `.___]  |_| |__) |\ `.___.'\
	  |_____||____| |____||_____|\____|`._____.'|_______/  `.____ .'

 -->
</body>
</html>