<?php

	/**
	 * 添加一条评论
	 */

	require_once('../../library/db.class.php');
	require_once('../../library/op.class.php');
	session_start();

	// 原JSON数据
	$postData = file_get_contents('php://input', 'r');
	// 参数对象
	$params = json_decode( $postData, true );

	$retError = array
	(
		'success' => false,
		'result'  => null,
		'message' => 'One of your request parameters is error!'
	);

	$isFull = isset( $params['postid'] )
				&& is_numeric( $params['postid'] )
			&& isset( $params['content'] )
			&& isset( $params['author'] );

	if ( $isFull )
	{
		$Sql = new SQL();

		$OP = new OP();

		$postid = $params['postid'];
		$postCode = $OP->clearXss( $params['code'] );
		$content = htmlspecialchars( $params['content'] );
		$author = htmlspecialchars( $params['author'] );
		$link = $OP->clearXss( $params['link'] );
		$id = 0; // 0为默认不是回复

		$content = $OP->clearXss( $content );
		$author = $OP->clearXss( $author );

		// 回复的评论(有评论id)
		if ( isset( $params['id'] ) ) {
			// 评论id必须数字
			if ( is_numeric( $params['id'] ) ) {
				$id = $params['id'];
			}
			else {
				$retError['message'] = '评论id必须为数字~';
				echo json_encode( $retError );
				exit();
			}
		}

		if ( !$content || !$author )
		{
			$retError['message'] = '评论内容或昵称不能为空~';
			echo json_encode( $retError );
			exit();
		}

		// 评论内容过多
		if ( mb_strlen($content, 'utf8') >= 150 )
		{
			$retError['message'] = '评论内容不要超过150个字符哟~';
			echo json_encode( $retError );
			exit();
		}

		// 昵称不能为纯数字
		if ( is_numeric( $author ) )
		{
			$retError['message'] = '昵称不能为纯数字哦~';
			echo json_encode( $retError );
			exit();
		}
		// 昵称不能包含两个以上特殊字符
		// preg_match_all("/[\',:;*?~`!@#$%^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/", $author, $matches );
		// if ( .count( $matches[0] >= 3 )
		// {
		// 	$retError['message'] = '昵称不能包含两个以上特殊字符~' );
		// 	echo json_encode( $retError );
		// 	exit();
		// }
		// 昵称过长
		if ( mb_strlen($author, 'utf8') >= 16 )
		{
			$retError['message'] = '昵称太长了吧？请在16个字符以内哟~';
			echo json_encode( $retError );
			exit();
		}

		// 验证码不通过
		if ( $_SESSION['img_code_word'] !== $postCode )
		{
			$retError['message'] = '验证码错误！';
			echo json_encode( $retError );
			exit();
		}

		$Sql->open();

		$result = $Sql->addComment( $postid, $content, $author, $link, $id );

		echo( $result );

		$Sql->close();
	}
	// 参数不全或不正确
	else
	{
		echo json_encode( $retError );
	}
?>