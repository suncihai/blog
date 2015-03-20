<?php

	/**
	 * 获取一篇文章
	 */

	require_once('../../library/db.class.php');

	$Sql = new SQL();

	$Sql->open();

	$artid = isset( $_GET['artid'] ) ? $_GET['artid'] : 1;

	$result = $Sql->getArticle( $artid );

	echo( $result );

	$Sql->close();

?>