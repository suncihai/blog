<?php 
	
	require_once('config.php');
	date_default_timezone_set( TIMEZONE );

	class Sql
	{
		public $host;
		public $user;
		public $pswd;
		public $db;
		public $conn;

		/**
         * DB类构造函数
         */
        public function Sql( $host = DB_HOST, $user = DB_USER, $pswd = DB_PASSWORD, $db = DB_NAME)
        {
            $this->host = $host;
            $this->user = $user;
            $this->pswd = $pswd;
            $this->db = $db;
             
        }
        /**
         * 打开数据库连接
         */
        public function open()
        {
            $this->conn = mysql_connect( $this->host, $this->user, $this->pswd );
            mysql_select_db( $this->db );
            mysql_query( "SET CHARACTER SET ".DB_CHARSET );
        }
        /**
         * 关闭数据连接
         */
        public function close()
        {
            mysql_close( $this->conn );
        }

        /**
         * [query 执行SQL查询并返回JSON格式数据]
         * @ param  [String] $sql [SQL语句]
         * @ return [Object]      [JSON]
         */
        public function query( $sql )
        {
            $result = mysql_query( $sql, $this -> conn );
            $arrTemp = array();
            $counter = 0;
            while( $row = mysql_fetch_assoc( $result ) )
            {
                $arrTemp[$counter] = $row;
                $counter++;
            }
            mysql_free_result( $result );
            mysql_close( $this -> conn );            
            return json_encode( $arrTemp );
        }

	}


?>