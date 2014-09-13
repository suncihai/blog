<?php 
	
    header("Content-type: text/html; charset=utf-8");
	require_once('config.php');
	date_default_timezone_set( TIMEZONE );

	class SQL
	{
		public $host;
		public $user;
		public $pswd;
		public $db;
		public $conn;

		/**
         * 打开数据库连接
         */
        public function open( $host = DB_HOST, $user = DB_USER, $pswd = DB_PASSWORD, $db = DB_NAME )
        {
            $this->host = $host;
            $this->user = $user;
            $this->pswd = $pswd;
            $this->db = $db;
            $this->conn = mysql_connect( $this->host, $this->user, $this->pswd );
            mysql_select_db( $this->db );
            mysql_query( "SET NAMES ".DB_CHARSET );
        }
        /**
         * 关闭数据连接
         */
        public function close()
        {
            mysql_close( $this->conn );
        }

        /**
         * [query 执行SQL查询并返回结果]
         * @ param  [String] $sql [SQL语句]
         */
        public function query( $sql )
        {
            $result = mysql_query( $sql, $this->conn );
            // 获得关联数组
            $assoc = mysql_fetch_assoc( $result );
            // 结果对象
            $itemArray = array
            (
                'items' => array($assoc),
                'total' => mysql_num_rows( $result )
            );
            // 最终返回的格式
            $retArray = array
            (
                'success' => is_array($assoc) ? true : false,
                'result'  => $itemArray
            );
            mysql_free_result( $result );      
            return json_encode( $retArray );
        }
	}


?>