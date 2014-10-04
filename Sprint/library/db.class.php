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
            mysql_free_result( $result );
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
        return json_encode( $retArray );
    }

    /**
     * getArchiveList 获取某个栏目的文章列表
     * param  [Number] $catid   [栏目ID]
     * param  [Number] $limit   [每页显示文章数目]
     * param  [Number] $order   [排序方式]
     * param  [Number] $brief   [摘要的长度(字数)]
     */
    public function getArchiveList( $catid, $page, $limit, $order, $brief )
    {
        // 结果排序方式
        switch( $order )
        {
            case 'date':
               $orderBy = 'post_date';
            break;
        }
        // 查询$catid栏目下的所有文章ID
        $resultIDs = mysql_query("SELECT object_id FROM wp_term_relationships WHERE term_taxonomy_id=$catid");
        $IDArr = array();
        while( $assocIDs = mysql_fetch_assoc( $resultIDs ) )
        {
            array_push( $IDArr, $assocIDs["object_id"] );
        }
        // 结果总条数
        $total = mysql_num_rows( $resultIDs );
        mysql_free_result( $resultIDs );
        $IDs = implode(",", $IDArr);
        // 查询字段
        $_fields = "ID, post_title, post_date, post_modified, post_content";
        // 查询条件(返回正常的文章必须指定post_status和post_type)
        $_where = "ID in($IDs) AND post_status='publish' AND post_type='post'";
        // 排序方式
        $_order = "ORDER BY $orderBy DESC";
        // 分页起点
        $start = ( $page - 1 ) * $limit;
        // SQL语句
        $sql = "SELECT $_fields FROM wp_posts WHERE $_where $_order LIMIT $start, $limit";
        $result = mysql_query( $sql, $this->conn );
        if( $result )
        {
            // 选项数组集合
            $itemArray = array();
            while( $assoc = mysql_fetch_assoc( $result ) )
            {
                // 摘要截取, 先截取再检测(确保性能)
                // $text = mb_substr( $assoc['post_content'], 0, $brief, 'utf8' );
                // $abstract = strip_tags( fixtags( $text ) );

                // 摘要截取, 先检测再截取(确保字数)
                $text = fixtags( $assoc['post_content'] );
                $abstract = mb_substr( strip_tags( $text ), 0, $brief, 'utf8');
                $itemFormat = array
                (
                    'id'           => $assoc['ID'],
                    'title'        => $assoc['post_title'],
                    'publishDate'  => $assoc['post_date'],
                    'modifiedDate' => $assoc['post_modified'],
                    'content'      => $abstract
                );
                array_push( $itemArray, $itemFormat );
            }
            mysql_free_result( $result );
            $resArray = array
            (
                'items' => $itemArray,               // 选项数组
                'total' => $total,                   // 总条数
                'pages' => ceil( $total / $limit ),  // 总页数
                'page'  => $page                     // 当前第几页
            );
            // 最终返回的结果
            $retArray = array
            (
                'success' => true,
                'result'  => $resArray
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
        return json_encode( $retArray );
    }

    /**
     * getArticle 获取一篇文章的信息
     * param  [Number] $artid   [文章ID]
     */
    public function getArticle( $artid )
    {
        // 查询字段
        $fields = "post_title, post_date, post_modified, post_content, comment_count";
        // 查询条件
        $filter = "LIMIT 1";
        $sql = "SELECT $fields FROM wp_posts WHERE ID = $artid $filter";
        // 执行查询操作
        $result = mysql_query( $sql, $this->conn );
        // 查询是否成功
        if( $result )
        {
            $assoc = mysql_fetch_assoc( $result );
            mysql_free_result( $result );
            $itemFormat = array
            (
                'title'        => $assoc['post_title'],
                'publishDate'  => $assoc['post_date'],
                'modifiedDate' => $assoc['post_modified'],
                'comments'     => $assoc['comment_count'],
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
        return json_encode( $retArray );
    }

    /**
     * getTitleList 获取一列文章标题(用于aside)
     * param  [Number] $type     [请求文章类型,可为catid,new,comments]
     * param  [Number] $amount   [请求结果条数]
     */
    public function getTitleList( $type, $amount )
    {
        // 查询字段
        $fields = "ID, post_title, post_date, comment_count";
        // 查询条件
        $where = "post_status='publish' AND post_type='post'";
        // 限制条件
        $filter = "ORDER BY post_date DESC LIMIT $amount";
        $sql = "SELECT $fields FROM wp_posts WHERE $where $filter";
        $result = mysql_query( $sql, $this->conn );
        if( $result )
        {
            // 选项数组集合
            $itemArray = array();
            while( $assoc = mysql_fetch_assoc( $result ) )
            {
                $ID = $assoc["ID"];
                $sql_getArchive = "SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id=$ID LIMIT 1";
                $resultArchie = mysql_query( $sql_getArchive );
                $archiveAssoc = mysql_fetch_assoc( $resultArchie );
                mysql_free_result( $resultArchie );
                $archiveID = $archiveAssoc['term_taxonomy_id'];
                $itemFormat = array
                (
                    'id'           => $ID,
                    'archive'      => $archiveID,
                    'title'        => $assoc['post_title'],
                    'publishDate'  => $assoc['post_date'],
                    'comments'     => $assoc['comment_count']
                );
                array_push( $itemArray, $itemFormat );
            }
            // 结果行数
            $total = mysql_num_rows( $result );
            mysql_free_result( $result );
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
        return json_encode( $retArray );
    }
}

// HTML标签闭合检测, $text的数据过大时, 可能存在一定的性能问题
function fixtags( $text ) {
    $text = preg_replace( "/&quot;/", "&quot;\"", htmlspecialchars( $text ) );
    $tags = "/&lt;(!|)(\/|)(\w*)(\ |)(\w*)([\\\=]*)(?|(\")\"&quot;\"|)(?|(.*)?&quot;(\")|)([\ ]?)(\/|)&gt;/i";
    $replacement = "<$1$2$3$4$5$6$7$8$9$10$11>";
    $text = preg_replace( $tags, $replacement, $text );
    $text = preg_replace( "/=\"\"/", "=", $text );
    $text = preg_replace( "/&quot;\"/", "\"", $text );
    return $text;
}

?>