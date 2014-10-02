<?php

	/**
	 * 栏目文章列表
	 */

	require_once('../../library/db.class.php');

	// 栏目iD
	$catid = isset( $_GET['catid'] ) ? intval( $_GET['catid'] ) : 3;
	// 请求第几页
	$page = isset( $_GET['page'] ) ? intval( $_GET['page'] ) : 1;
	// 每页行数
	$limit = isset( $_GET['limit'] ) ? intval( $_GET['limit'] ) : 8;
	// 排序方式
	$order = isset( $_GET['order'] ) ? $_GET['order'] : 'date';
	// 摘要长度
	$brief = isset( $_GET['brief'] ) ? intval( $_GET['brief'] ) : 200;

	$Sql = new SQL();

	$Sql->open();

	$result = $Sql->getArchiveList( $catid, $page, $limit, $order, $brief );

	echo( $result );

	$Sql->close();

?>