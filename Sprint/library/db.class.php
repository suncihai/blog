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
         * query 基本查询,返回没有格式化字段的结果
         * param  [String] $sql [SQL语句]
         */
        public function query( $sql )
        {
            $result = mysql_query( $sql, $this->conn );
            if( $result )
            {
                // 选项数组集合
                $itemArray = array();
                while( $assoc = mysql_fetch_assoc( $result ) )
                {
                    array_push( $itemArray, $assoc );
                }
                // 结果行数
                $total = mysql_num_rows( $result );
                $resultObject = array
                (
                    'items' => $itemArray,
                    'total' => $total
                );
                // 最终返回的结果
                $retArray = array
                (
                    'success' => true,
                    'result'  => $resultObject
                );
            }
            else
            {
                $retArray = array
                (
                    'success' => false,
                    'result'  => null
                );
            }
            mysql_free_result( $result );
            return json_encode( $retArray );
        }

        /**
         * getArchiveList 获取某个栏目的文章列表
         * param  [Number] $catid   [栏目ID]
         * param  [Number] $limit   [每页显示文章数目]
         * param  [Number] $order   [排序方式]
         * param  [Number] $brief   [摘要的长度(字数)]
         */
        public function getArchiveList( $catid, $limit, $order, $brief )
        {
            // 查询字段
            $fields = "ID, post_title, post_date, post_modified, post_content";
            // 查询条件
            $filter = "LIMIT $limit ORDER BY $order";
            $sql = "SELECT $fields FROM wp_posts $filter";
            // 执行查询操作
            $result = mysql_query( $sql, $this->conn );
            // 查询是否成功
            if( $result )
            {
                // 选项数组集合
                $itemArray = array();
                while( $assoc = mysql_fetch_assoc( $result ) )
                {
                    $itemFormat = array
                    (
                        'id'           => $assoc['ID'],
                        'title'        => $assoc['post_title'],
                        'publishDate'  => $assoc['post_date'],
                        'modifiedDate' => $assoc['post_modified'],
                        'content'      => $assoc['post_content']
                    );
                    array_push( $itemArray, $itemFormat );
                }
                // 结果行数
                $total = mysql_num_rows( $result );
                $resultObject = array
                (
                    'items' => $itemArray,
                    'total' => $total
                );
                // 最终返回的结果
                $retArray = array
                (
                    'success' => true,
                    'result'  => $resultObject
                );
            }
            else
            {
                $retArray = array
                (
                    'success' => false,
                    'result'  => null
                );
            }
            mysql_free_result( $result );
            return json_encode( $retArray );
        }

        /**
         * getArticle 获取一篇文章的信息
         * param  [Number] $artid   [文章ID]
         */
        public function getArticle( $artid )
        {
            // 查询字段
            $fields = "post_title, post_date, post_modified, post_content";
            // 查询条件
            $filter = "LIMIT 1";
            $sql = "SELECT $fields FROM wp_posts WHERE ID = $artid $filter";
            // 执行查询操作
            $result = mysql_query( $sql, $this->conn );
            // 查询是否成功
            if( $result )
            {
                $assoc = mysql_fetch_assoc( $result );
                $itemFormat = array
                (
                    'title'        => $assoc['post_title'],
                    'publishDate'  => $assoc['post_date'],
                    'modifiedDate' => $assoc['post_modified'],
                    'content'      => $assoc['post_content']
                );
                // 最终返回的结果
                $retArray = array
                (
                    'success' => true,
                    'result'  => $itemFormat
                );
            }
            else
            {
                $retArray = array
                (
                    'success' => false,
                    'result'  => null
                );
            }
            mysql_free_result( $result );
            return json_encode( $retArray );
        }
	}

?>