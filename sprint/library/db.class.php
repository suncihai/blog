<?php
/**
 * 数据增查操作类
 */

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
     * query 基本查询接口,返回查询的结果数组(原始字段)
     * param  [String]  $sql     [SQL语句]
     * param  [Boolean] $private [内部使用]
     * param  [Return]           [返回items->结果集合, total->结果总数]
     */
    public function query( $sql, $private = true )
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
            // 结果
            $resultObject = array
            (
                'items' => $itemArray,
                'total' => $total
            );
            // 返回结构
            $retArray = array
            (
                'success' => true,
                'result'  => $resultObject
            );
        }
        else
        {
            // 结果
            $resultObject = array
            (
                'items' => null,
                'total' => 0
            );
            // 返回结构
            $retArray = array
            (
                'success' => false,
                'result'  => $resultObject
            );
        }
        // 函数返回体(内部调用只返回items和total)
        if( $private )
        {
            return $resultObject;
        }
        else
        {
            return json_encode( $retArray );
        }
    }

    /**
     * getArchiveList 获取某个栏目的文章列表
     * param  [Number] $catid   [栏目ID]
     * param  [Number] $page    [请求的页码]
     * param  [Number] $limit   [每页显示文章数目]
     * param  [Number] $brief   [摘要的长度(字数)]
     */
    public function getArchiveList( $catid, $page, $limit, $brief )
    {
        // 查询$catid栏目下的所有文章ID记录
        $resQueryID = $this->query("SELECT object_id FROM wp_term_relationships WHERE term_taxonomy_id=$catid");
        $IDArr = array();
        foreach( $resQueryID['items'] as $key => $item ) {
            array_push( $IDArr, $item["object_id"] );
        }
        $IDs = implode(",", $IDArr);

        // 结果排序方式
        $orderBy = 'post_date';
        // 查询字段
        $_fields = "ID, post_title, post_date, post_content, comment_count";
        // 查询条件(返回正常的文章必须指定post_status和post_type)
        $_where = "ID in($IDs) AND post_status='publish' AND post_type='post'";
        // 排序方式
        $_order = "ORDER BY $orderBy DESC";
        // 分页起点
        $start = ( $page - 1 ) * $limit;

        // 查询结果总条数(直接用IDs的结果数会不准确)
        $resQueryAll = $this->query("SELECT ID FROM wp_posts WHERE $_where");
        $total = $resQueryAll['total'];
        $resQueryList = $this->query("SELECT $_fields FROM wp_posts WHERE $_where $_order LIMIT $start, $limit");
        // 转换数据格式
        if( $resQueryList['total'] )
        {
            $itemArray = array();
            foreach( $resQueryList['items'] as $key => $item ) {
                $abstract = '';
                if( $brief !== 0 )
                {
                    // 截取文章摘要
                    $cover = getFirstImg( $item['post_content'] );
                    $text = removeTag( $item['post_content'] );
                    $abstract = mb_substr( strip_tags( $text ), 0, $brief, 'utf8');
                }
                $itemFormat = array
                (
                    'id'           => intval( $item['ID'] ),
                    'title'        => $item['post_title'],
                    'publishDate'  => $item['post_date'],
                    'content'      => $abstract,
                    'comments'     => intval( $item['comment_count'] ),
                    'cover'        => $cover
                );
                array_push( $itemArray, $itemFormat );
            }
            $resArray = array
            (
                'items' => $itemArray,               // 选项数组
                'total' => intval( $total ),         // 总条数
                'pages' => ceil( $total / $limit ),  // 总页数
                'page'  => intval( $page )           // 当前第几页
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
        $fields = "post_title, post_date, post_content, comment_count";
        // 查询条件
        $filter = "LIMIT 1";
        // 执行查询操作
        $resQueryArticle = $this->query("SELECT $fields FROM wp_posts WHERE ID = $artid $filter");
        // 结果数
        $num = $resQueryArticle['total'];
        if( $num == 1 )
        {
            $article = $resQueryArticle['items'][0];
            // 只返回内容不为空的数据
            if( $article['post_content'] != '' )
            {
                $itemFormat = array
                (
                    'title'        => $article['post_title'],
                    'publishDate'  => $article['post_date'],
                    'comments'     => intval( $article['comment_count'] ),
                    'content'      => postAutoP( $article['post_content'] )
                );
                // 最终返回的结果
                $retArray = array
                (
                    'success' => true,
                    'result'  => $num === 0 ? null : $itemFormat,
                    'total'   => $num
                );
            }
            else
            {
                $retArray = array
                (
                    'success' => true,
                    'result'  => null,
                    'total'   => 0
                );
            }

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
        // 执行查询
        $resQueryList = $this->query("SELECT $fields FROM wp_posts WHERE $where $filter");
        if( $resQueryList['total'] )
        {
            // 选项数组集合
            $itemArray = array();
            foreach( $resQueryList['items'] as $key => $item ) {
                $ID = $item["ID"];
                $resQueryID = $this->query("SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id=$ID LIMIT 1");
                $archiveID = $resQueryID['items'][0]['term_taxonomy_id'];
                $itemFormat = array
                (
                    'id'           => $ID,
                    'archive'      => $archiveID,
                    'title'        => $item['post_title'],
                    'publishDate'  => $item['post_date'],
                    'comments'     => $item['comment_count']
                );
                array_push( $itemArray, $itemFormat );
            }
            $resultObject = array
            (
                'items' => $itemArray,
                'total' => $resQueryList['total']
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
     * filterWord 关键字查询
     * param  [String]  $word   [关键字]
     */
    public function filterWord( $word )
    {
        // 查询字段
        $_fields = "ID, post_title, post_date, post_content, comment_count";
        // 模糊查询条件
        $_where = "(post_title LIKE '%".$word."%' OR post_content LIKE '%".$word."%') AND post_status='publish' AND post_type='post'";
        // 执行查询
        $resQuery = $this->query("SELECT $_fields FROM wp_posts WHERE $_where");
        if( $resQuery['total'] )
        {
            // 选项数组集合
            $itemArray = array();
            foreach( $resQuery['items'] as $key => $item ) {

                // 查询每条文章对应的栏目ID
                $artid = $item['ID'];
                $resQueryTermID = $this->query("SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id=$artid");
                $archiveID = $resQueryTermID['items'][0]['term_taxonomy_id'];

                // 关键字相关的片段截取(目标的前后100字符)
                $brief = "";
                $pattern = '/('.$word.')/i';
                $isMatch = false;
                // 先去掉html标签再进行关键字匹配
                $content = removeTag( $item['post_content'] );
                if( preg_match("/(.{100}".$word.".{100})/sui", $content, $matches) )
                {
                    if( count( $matches ) !== 0 )
                    {
                        $isMatch = true;
                        // 取完整模式匹配到的片段
                        $brief = $matches[0];
                        // 高亮关键字
                        $brief = preg_replace( $pattern, '<b class="keyword">$1</b>', $brief );
                    }
                }
                // 标题也加高亮
                $title = preg_replace( $pattern, '<b class="keyword">$1</b>', $item['post_title'] );

                if( $isMatch || ($title !== $item['post_title']) )
                {
                    $itemFormat = array
                    (
                        'id'           => intval( $artid ),
                        'catId'        => intval( $archiveID ),
                        'title'        => $title,
                        'tips'         => $item['post_title'],
                        'publishDate'  => $item['post_date'],
                        'brief'        => $brief,
                        'comments'     => intval( $item['comment_count'] )
                    );
                    array_push( $itemArray, $itemFormat );
                }
            }
            $resArray = array
            (
                'items' => $itemArray,               // 选项数组
                'total' => count( $itemArray )       // 总条数
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
}

// 去掉文章的html标签
function removeTag( $pee ) {
    return preg_replace('/<\/?[^>]+>/i', '', $pee);
}

// 获取第一张图片作为缩略图
function getFirstImg( $text ) {
    preg_match("<img.*src=[\"](.*?)[\"].*?>", $text, $match);
    if( $match ) {
        return $match[1];
    }
    return "";
}

// HTML标签闭合检测, 取自XXX
function fixHtmlTags( $text ) {
    $text = preg_replace( "/&quot;/", "&quot;\"", htmlspecialchars( $text ) );
    $tags = "/&lt;(!|)(\/|)(\w*)(\ |)(\w*)([\\\=]*)(?|(\")\"&quot;\"|)(?|(.*)?&quot;(\")|)([\ ]?)(\/|)&gt;/i";
    $replacement = "<$1$2$3$4$5$6$7$8$9$10$11>";
    $text = preg_replace( $tags, $replacement, $text );
    $text = preg_replace( "/=\"\"/", "=", $text );
    $text = preg_replace( "/&quot;\"/", "\"", $text );
    return $text;
}

// 文章自动加上段落标签<p></p>, 取自WordPress: wp-includes/formatting.php wpautop() Line 245
function postAutoP( $pee, $br = true ) {
    $pre_tags = array();

    if ( trim($pee) === '' )
        return '';

    $pee = $pee . "\n"; // just to make things a little easier, pad the end

    if ( strpos($pee, '<pre') !== false ) {
        $pee_parts = explode( '</pre>', $pee );
        $last_pee = array_pop($pee_parts);
        $pee = '';
        $i = 0;

        foreach ( $pee_parts as $pee_part ) {
            $start = strpos($pee_part, '<pre');

            // Malformed html?
            if ( $start === false ) {
                $pee .= $pee_part;
                continue;
            }

            $name = "<pre wp-pre-tag-$i></pre>";
            $pre_tags[$name] = substr( $pee_part, $start ) . '</pre>';

            $pee .= substr( $pee_part, 0, $start ) . $name;
            $i++;
        }

        $pee .= $last_pee;
    }

    $pee = preg_replace('|<br />\s*<br />|', "\n\n", $pee);
    // Space things out a little
    $allblocks = '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|noscript|legend|section|article|aside|hgroup|header|footer|nav|figure|details|menu|summary)';
    $pee = preg_replace('!(<' . $allblocks . '[^>]*>)!', "\n$1", $pee);
    $pee = preg_replace('!(</' . $allblocks . '>)!', "$1\n\n", $pee);
    $pee = str_replace(array("\r\n", "\r"), "\n", $pee); // cross-platform newlines

    if ( strpos( $pee, '</object>' ) !== false ) {
        // no P/BR around param and embed
        $pee = preg_replace( '|(<object[^>]*>)\s*|', '$1', $pee );
        $pee = preg_replace( '|\s*</object>|', '</object>', $pee );
        $pee = preg_replace( '%\s*(</?(?:param|embed)[^>]*>)\s*%', '$1', $pee );
    }

    if ( strpos( $pee, '<source' ) !== false || strpos( $pee, '<track' ) !== false ) {
        // no P/BR around source and track
        $pee = preg_replace( '%([<\[](?:audio|video)[^>\]]*[>\]])\s*%', '$1', $pee );
        $pee = preg_replace( '%\s*([<\[]/(?:audio|video)[>\]])%', '$1', $pee );
        $pee = preg_replace( '%\s*(<(?:source|track)[^>]*>)\s*%', '$1', $pee );
    }

    $pee = preg_replace("/\n\n+/", "\n\n", $pee); // take care of duplicates
    // make paragraphs, including one at the end
    $pees = preg_split('/\n\s*\n/', $pee, -1, PREG_SPLIT_NO_EMPTY);
    $pee = '';

    foreach ( $pees as $tinkle ) {
        $pee .= '<p>' . trim($tinkle, "\n") . "</p>\n";
    }

    $pee = preg_replace('|<p>\s*</p>|', '', $pee); // under certain strange conditions it could create a P of entirely whitespace
    $pee = preg_replace('!<p>([^<]+)</(div|address|form)>!', "<p>$1</p></$2>", $pee);
    $pee = preg_replace('!<p>\s*(</?' . $allblocks . '[^>]*>)\s*</p>!', "$1", $pee); // don't pee all over a tag
    $pee = preg_replace("|<p>(<li.+?)</p>|", "$1", $pee); // problem with nested lists
    $pee = preg_replace('|<p><blockquote([^>]*)>|i', "<blockquote$1><p>", $pee);
    $pee = str_replace('</blockquote></p>', '</p></blockquote>', $pee);
    $pee = preg_replace('!<p>\s*(</?' . $allblocks . '[^>]*>)!', "$1", $pee);
    $pee = preg_replace('!(</?' . $allblocks . '[^>]*>)\s*</p>!', "$1", $pee);

    if ( $br ) {
        $pee = preg_replace_callback('/<(script|style).*?<\/\\1>/s', '_autop_newline_preservation_helper', $pee);
        $pee = preg_replace('|(?<!<br />)\s*\n|', "<br />\n", $pee); // optionally make line breaks
        $pee = str_replace('<WPPreserveNewline />', "\n", $pee);
    }

    $pee = preg_replace('!(</?' . $allblocks . '[^>]*>)\s*<br />!', "$1", $pee);
    $pee = preg_replace('!<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)!', '$1', $pee);
    $pee = preg_replace( "|\n</p>$|", '</p>', $pee );

    if ( !empty($pre_tags) )
        $pee = str_replace(array_keys($pre_tags), array_values($pre_tags), $pee);

    return $pee;
}

function _autop_newline_preservation_helper( $matches ) {
    return str_replace("\n", "<WPPreserveNewline />", $matches[0]);
}

?>