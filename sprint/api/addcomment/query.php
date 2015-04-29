<?php

	/**
	 * 添加一条评论
	 */

	require_once('../../library/db.class.php');

	$isFull = isset( $_POST['postid'] )
				&& is_numeric( $_POST['postid'] )
			&& isset( $_POST['content'] )
			&& isset( $_POST['author'] );

	if( $isFull )
	{
		$postid = $_POST['postid'];
		$content = $_POST['content'];
		$author = $_POST['author'];

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
			'is'      => $_POST['content'],
			'message' => 'One of your request parameters is error!'
		);
		echo json_encode( $retError );
	}
?>