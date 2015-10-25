<?php

	/**
	 * 获取一篇文章
	 */

	require_once('../../library/db.class.php');

	// 请求参数过滤
	if (isset($_GET['artid']) && is_numeric($_GET['artid']) && ($_GET['artid'] !== 2)) {
		$Sql = new SQL();

		$Sql->open();

		$artid = $_GET['artid'];

		$result = $Sql->getArticle($artid);

		echo($result);

		$Sql->close();
	}
	else {
		$retError = array(
			'success' => false,
			'result'  => null,
			'message' => 'One of your request parameters is error!'
		);
		echo json_encode($retError);
	}

?>