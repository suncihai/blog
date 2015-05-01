<?php

	/**
	 * 添加一条评论
	 */

	require_once('../../library/db.class.php');

	// 原JSON数据
	$postData = file_get_contents('php://input', 'r');
	// 参数对象
	$params = json_decode( $postData );

	$isFull = isset( $params['postid'] )
				&& is_numeric( $params['postid'] )
			&& isset( $params['content'] )
			&& isset( $params['author'] );

	if ( $isFull )
	{
		$postid = $params['postid'];
		$content = $params['content'];
		$author = $params['author'];

		$Sql = new SQL();

		$Sql->open();

		$result = $Sql->addComment( $postid, $content, $author );

		echo( $result );
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