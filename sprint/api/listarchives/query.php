<?php

	/**
	 * 栏目文章列表
	 */

	require_once('../../library/db.class.php');

	// 请求参数过滤
	$paramFormat =
		isset( $_GET['catid'] )
			&& is_numeric( $_GET['catid'] )
		&& isset( $_GET['page'] )
			&& is_numeric( $_GET['page'] )
		&& isset( $_GET['limit'] )
			&& is_numeric( $_GET['limit'] )
		&& isset( $_GET['brief'] )
			&& is_numeric( $_GET['brief'] );

	if( $paramFormat )
	{
		// 栏目ID
		$catid =  $_GET['catid'];
		// 请求第几页
		$page = $_GET['page'];
		// 每页行数
		$limit = $_GET['limit'];
		// 摘要长度
		$brief = $_GET['brief'];

		$Sql = new SQL();

		$Sql->open();

		$result = $Sql->getArchiveList( $catid, $page, $limit, $brief );

		echo( $result );

		$Sql->close();
	}
	else
	{
		$retError = array
		(
			'success' => false,
			'result'  => null,
			'message' => 'One of your request parameters is error!'
		);
		 echo json_encode( $retError );
	}
?>