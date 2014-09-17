<?php

	require_once('../../library/sql.class.php');

	$DB = new SQL();

	$DB->open();

	$array = $DB->query("SELECT user_nicename FROM wp_users WHERE ID = 1");

	echo( $array );

	$DB->close();

?>