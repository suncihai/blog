<?php

	/**
	 * 栏目文章列表
	 */

	require_once('../../library/db.class.php');

	// 请求选项
	$catid = $_GET['catid'];
	$limit = $_GET['limit'];
	$order = $_GET['order'];
	$brief = $_GET['brief'];

	$Sql = new SQL();

	$Sql->open();

	$result = $Sql->getArchiveList( $catid, $limit, $order, $brief );

	echo( $result );

	$Sql->close();

?>