<?php

	/**
	 * 关键字搜索(标题)
	 */

	require_once('../../library/db.class.php');
	require_once('../../library/op.class.php');
	// 错误信息
	$retError = array
	(
		'success' => false,
		'result'  => null,
		'message' => 'One of your request parameters is error!'
	);

	// 请求参数过滤
	if( isset( $_GET['word'] ) && $_GET['word'] != '' )
	{
		$Sql = new SQL();

		$OP = new OP();

		$Sql->open();

		$word = $OP->clearXss( $_GET['word'] );

		if( $word )
		{
			$result = $Sql->filterWord( $word );

			echo( $result );
		}
		else
		{
			echo json_encode( $retError );
		}

		$Sql->close();
	}
	else
	{
		echo json_encode( $retError );
	}

?>