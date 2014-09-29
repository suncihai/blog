<?php

	/**
	 * 获取一列文章标题
	 */

	require_once('../../library/db.class.php');

	// 请求选项
	$type = isset( $_GET['type'] ) ? $_GET['type'] : 0;
	$amount = isset( $_GET['amount'] ) ? $_GET['amount'] : 8;

	$Sql = new SQL();

	$Sql->open();

	$result = $Sql->getTitleList( $type, $amount );

	echo( $result );

	$Sql->close();

?>