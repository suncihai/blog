<?php

	/**
	 * 获取一篇文章
	 */

	require_once('../../library/db.class.php');

	$Sql = new SQL();

	$Sql->open();

	$artid = $_GET['artid'];

	$result = $Sql->getArticle( $artid );

	echo( $result );

	$Sql->close();

?>