<?php

	/**
	 * 获取一列文章标题
	 */

	require_once('../../library/db.class.php');

	// 请求选项
	$type = $_GET['type'];
	$amount = $_GET['amount'];

	$Sql = new SQL();

	$Sql->open();

	$result = $Sql->getTitleList( $type, $amount );

	echo( $result );

	$Sql->close();

?>