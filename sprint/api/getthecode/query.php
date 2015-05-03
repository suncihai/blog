<?php

	/**
	 * 返回随机乱序的验证码
	 */
	header("Content-type: image/PNG");
	if ( !isset( $_SESSION['img_code_word'] ) )
	{
		session_start();
	}

	// 单词库
	$word = "break|case|else|false|null|return|switch|this|true|typeof|define|join|slice|sort|shift|join|push|length|concat|trim|substr|while|window|width|height|color|left|border|float|bottom|clear|margin|cursor|block|none|fixed|auto|hidden|center|italic|both|inline|bold|normal|rgba|solid|italic|scale|rotate";

	// 转成数组并随机抽取一个
	$words = explode("|", $word);
	$count = count( $words );
	$num = rand( 0, $count - 1 );
	$code = $words[$num];

	// 打乱单词顺序
	$mixCode = disturbString( $code );

	// 图形定义
	$width = 90;
	$height = 35;
	$img = imagecreate( $width, $height );

	// painting...
	$gray = imagecolorallocate( $img, 240, 240, 240 );
	// 填充色
	imagefill( $img, 0, 0, $gray );
	// 绘制字体
	$fontColor = imagecolorallocate( $img, 34, 182, 171 );
	$font = "../../../resources/fonts/consolaz.ttf";
	// $font = "../../../resources/fonts/gomarice.ttf";
	$fontSize = 16;
	$fontBox = imagettfbbox( $fontSize, 0, $font, $mixCode ); // 字体文本的范围
	$posX = ceil( ( $width - $fontBox[2] ) / 2 ); // left偏移量
	$posY = 24; // top偏移量
	$angle = 0; // 字体角度
	imagettftext( $img, $fontSize, $angle, $posX, $posY, $fontColor, $font, $mixCode );

	// 存入session
	$_SESSION['img_code_word'] = $code;
	imagepng( $img );
	imagedestroy( $img );

	// 打乱字符串的顺序
	function disturbString( $string )
	{
        // 字符个数
		$len = strlen( $string );

		// 存放每个字母的数组
		$arr = array();
		for ( $i = 0; $i < $len; $i++ )
		{
			array_push( $arr, substr( $string, $i, 1) );
		}

		shuffle( $arr );

		// 再拼接回字符串返回
		return implode('', $arr);
	}
?>