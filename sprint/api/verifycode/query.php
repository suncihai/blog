<?php
	/**
	 * 验证码校验
	 */
	session_start();

	$postData = file_get_contents('php://input', 'r');
	// 参数对象
	$params = json_decode( $postData, true );
	// 传入的验证码
	$code = $params['code'];

	$ret = array
	(
		'success' => true,
		'message' => ''
	);

	// 还未设置验证码
	if ( !isset( $_SESSION['img_code_word'] ) )
	{
		$ret['success'] = false;
		$ret['message'] = '还未读取验证码！';
	}
	else
	{
		// 验证码不正确
		if ( $_SESSION['img_code_word'] !== $code )
		{
			$ret['success'] = false;
			$ret['message'] = '验证码错误！';
		}
	}

	echo json_encode( $ret );
?>