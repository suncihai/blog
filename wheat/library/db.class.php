<?php
/**
 * 数据增查操作类
 */

header("Content-type: text/html; charset=utf-8");
require_once('config.php');
date_default_timezone_set(TIMEZONE);

class SQL {
	public $host;
	public $user;
	public $pswd;
    public $db;
	public $conn;
	public $ADMIN = '博主';

    /**
     * 打开数据库连接
     */
    public function open($host = DB_HOST, $user = DB_USER, $pswd = DB_PASSWORD, $db = DB_NAME) {
        $this->host = $host;
        $this->user = $user;
        $this->pswd = $pswd;
        $this->db = $db;
        $this->conn = mysql_connect($this->host, $this->user, $this->pswd);
        mysql_select_db($this->db);
        mysql_query("SET NAMES ".DB_CHARSET);
    }

    /**
     * 关闭数据连接
     */
    public function close() {
        mysql_close($this->conn);
    }

    /**
     * query 基本查询接口,返回查询的结果数组(原始字段)
     * param  [String]  $sql     [SQL语句]
     * param  [Boolean] $insert  [INSERT 语句]
     * param  [Return]           [返回items->结果集合, total->结果总数, success->查询成功]
     */
    private function query($sql, $insert = false) {
        $result = mysql_query($sql, $this->conn);
        // 查询成功
        if ($result) {
            // 非INSERT语句返回结果items和总数total
            if (!$insert) {
                // 选项数组集合
                $itemArray = array();

                while ($assoc = mysql_fetch_assoc($result)) {
                    array_push($itemArray, $assoc);
                }

                // 结果行数
                $total = mysql_num_rows($result);
                mysql_free_result($result);

                // 结果
                $resultObject = array(
                    'items'   => $itemArray,
                    'total'   => $total,
                    'success' => true
                );
            }
            // INSERT语句只返回success和新增的auto_increment_id
            else {
                $resultObject = array(
                    'success' => true,
                    'newid'   => mysql_insert_id()
                );
            }
        }
        // 查询失败
        else {
            // 非INSERT语句
            if (!$insert) {
                $resultObject = array(
                    'items'   => null,
                    'total'   => 0,
                    'success' => false
                );
            }
            // INSERT语句
            else {
                $resultObject = array(
                    'id'      => 0,
                    'success' => false
                );
            }
        }

        return $resultObject;
    }

    /**
     * getArchiveList 获取某个栏目的文章列表
     * param  [Number] $catid   [栏目ID]
     * param  [Number] $page    [请求的页码]
     * param  [Number] $limit   [每页显示文章数目]
     * param  [Number] $brief   [摘要的长度(字数)]
     */
    public function getArchiveList($catid, $page, $limit, $brief) {
        // 查询$catid栏目下的所有文章ID记录
        $resQueryID = $this->query("SELECT object_id FROM wp_term_relationships WHERE term_taxonomy_id=$catid");

        $idArr = array();
        foreach ($resQueryID['items'] as $key => $item) {
            array_push($idArr, $item["object_id"]);
        }
        $ids = implode(",", $idArr);

        // 结果排序方式
        $orderBy = 'post_date';

        // 查询字段
        $_fields = "ID, post_title, post_date, post_content, comment_count";

        // 查询条件(返回正常的文章必须指定post_status和post_type)
        $_where = "ID in($ids) AND post_status='publish' AND post_type='post'";

        // 排序方式
        $_order = "ORDER BY $orderBy DESC";

        // 分页起点
        $start = ($page - 1) * $limit;

        // 查询结果总条数(直接用ids的结果数会不准确)
        $resQueryAll = $this->query("SELECT ID FROM wp_posts WHERE $_where");
        $total = $resQueryAll['total'];

        $resQueryList = $this->query("SELECT $_fields FROM wp_posts WHERE $_where $_order LIMIT $start, $limit");

        // 查询成功
        if ($resQueryList['success']) {
            $itemArray = array();

            foreach ($resQueryList['items'] as $key => $item) {
                // 截取文章摘要
                $abstract = '';
                if ($brief !== 0) {
                    $cover = getFirstImg($item['post_content']);
                    $text = $item['post_content'];
                    $text = removeTag($text);
                    $text = fixStripHtmlTags($text);
                    $abstract = mb_substr(strip_tags($text), 0, $brief, 'utf8');
                }

                // 数据格式化
                $itemFormat = array(
                    'id'       => intval($item['ID']),
                    'title'    => $item['post_title'],
                    'date'     => $item['post_date'],
                    'content'  => htmlspecialchars_decode($abstract),
                    'comments' => intval($item['comment_count']),
                    'cover'    => $cover
                );

                array_push($itemArray, $itemFormat);
            }

            $resArray = array(
                // 选项数组
                'items' => $itemArray,
                // 总条数
                'total' => intval($total),
                // 总页数
                'pages' => ceil($total / $limit),
                // 当前第几页
                'page'  => intval($page)
            );

            // 返回的结果
            $retArray = array(
                'success' => true,
                'result'  => $resArray
            );
        }
        // 查询失败
        else {
            $retArray = array(
                'success' => false,
                'result'  => null
            );
        }

        return json_encode($retArray);
    }

    /**
     * getArticle 获取一篇文章的信息
     * param  [Number] $artid   [文章ID]
     */
    public function getArticle($artid) {
        // 查询字段
        $fields = "post_title, post_date, post_content, comment_count";

        // 查询条件
        $filter = "LIMIT 1";

        $resQueryArticle = $this->query("SELECT $fields FROM wp_posts WHERE ID = $artid $filter");

        // 结果数
        $num = $resQueryArticle['total'];

        // 查询成功
        if ($num == 1) {
            $article = $resQueryArticle['items'][0];

            // 只返回内容不为空的数据
            if ($article['post_content'] != '') {
                // 数据格式化
                $itemFormat = array(
                    'title'    => $article['post_title'],
                    'date'     => $article['post_date'],
                    'comments' => intval($article['comment_count']),
                    'content'  => postAutoP($article['post_content'])
                );

                // 返回的结果
                $retArray = array(
                    'success' => true,
                    'result'  => $itemFormat,
                    'total'   => $num
                );
            }
            // 文章内容为空
            else {
                $retArray = array(
                    'success' => false,
                    'result'  => null,
                    'message' => 'No content for '.$artid,
                    'total'   => 0
                );
            }
        }
        // 查询失败
        else {
            $retArray = array(
                'success' => false,
                'message' => 'No article record for '.$artid,
                'result'  => null
            );
        }

        return json_encode($retArray);
    }

    /**
     * getTitleList 获取一列文章标题(用于aside)
     * param  [Number] $type     [请求文章类型,可为catid,new,comments]
     * param  [Number] $amount   [请求结果条数]
     */
    public function getTitleList($type, $amount) {
        // 查询字段
        $fields = "ID, post_title, post_date, comment_count";

        // 查询条件
        $where = "post_status='publish' AND post_type='post'";

        // 限制条件
        $filter = "ORDER BY post_date DESC LIMIT $amount";

        $resQueryList = $this->query("SELECT $fields FROM wp_posts WHERE $where $filter");

        // 查询成功
        if ($resQueryList['success']) {
            $itemArray = array();

            foreach ($resQueryList['items'] as $key => $item) {
                // 找到对应的栏目id
                $ID = $item["ID"];
                $resQueryID = $this->query("SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id=$ID LIMIT 1");
                $archiveID = $resQueryID['items'][0]['term_taxonomy_id'];

                // 数据格式化
                $itemFormat = array(
                    'id'       => $ID,
                    'archive'  => $archiveID,
                    'title'    => $item['post_title'],
                    'date'     => $item['post_date'],
                    'comments' => $item['comment_count']
                );

                array_push($itemArray, $itemFormat);
            }

            $resultObject = array(
                'items' => $itemArray,
                'total' => $resQueryList['total']
            );

            // 返回的结果
            $retArray = array(
                'success' => true,
                'result'  => $resultObject
            );
        }
        // 查询失败
        else {
            $retArray = array(
                'success' => false,
                'result'  => null
            );
        }

        return json_encode($retArray);
    }

    /**
     * filterWord 关键字查询
     * param  [String]  $word   [关键字]
     */
    public function filterWord($word) {
        // 查询字段
        $_fields = "ID, post_title, post_date, post_content, comment_count";

        // 模糊查询条件
        $_where = "(post_title LIKE '%".$word."%' OR post_content LIKE '%".$word."%') AND post_status='publish' AND post_type='post'";

        $resQuery = $this->query("SELECT $_fields FROM wp_posts WHERE $_where");

        // 查询成功
        if ($resQuery['success']) {
            $itemArray = array();

            foreach ($resQuery['items'] as $key => $item) {
                // 找到对应的栏目id
                $artid = $item['ID'];
                $resQueryTermID = $this->query("SELECT term_taxonomy_id FROM wp_term_relationships WHERE object_id=$artid");
                $archiveID = $resQueryTermID['items'][0]['term_taxonomy_id'];

                // 关键字相关的片段截取(目标的前后100字符)
                $brief = "";
                $pattern = '/('.$word.')/i';
                $isMatch = false;

                // 先去掉html标签再进行关键字匹配
                $content = removeTag($item['post_content']);

                if (preg_match("/(.{100}".$word.".{100})/sui", $content, $matches)) {
                    if (count($matches) !== 0) {
                        $isMatch = true;
                        // 取完整模式匹配到的片段
                        $brief = $matches[0];
                        // 闭合标签检测
                        $brief = fixStripHtmlTags($brief);
                        // 高亮关键字
                        $brief = preg_replace($pattern, '<b class="keyword">$1</b>', $brief);
                    }
                }

                // 标题也加高亮
                $title = preg_replace($pattern, '<b class="keyword">$1</b>', $item['post_title']);

                // 格式化数据
                if ($isMatch || ($title !== $item['post_title'])) {
                    $itemFormat = array(
                        'id'       => intval($artid),
                        'catId'    => intval($archiveID),
                        'title'    => $title,
                        'tips'     => $item['post_title'],
                        'date'     => $item['post_date'],
                        'brief'    => htmlspecialchars_decode($brief),
                        'comments' => intval($item['comment_count'])
                    );

                    array_push($itemArray, $itemFormat);
                }
            }

            $resArray = array(
                'items' => $itemArray,               // 选项数组
                'total' => count($itemArray)       // 总条数
            );

            // 返回的结果
            $retArray = array(
                'success' => true,
                'result'  => $resArray
            );
        }
        // 查询失败
        else {
            $retArray = array(
                'success' => false,
                'result'  => null
            );
        }

        return json_encode($retArray);
    }

    /**
     * getCommentList 获取指定文章的评论列表
     * param  [Number] $artid   [文章ID]
     * param  [Number] $page    [请求的页码]
     * param  [Number] $limit   [每页显示文章数目]
     * param  [Number] $date    [时间排序方式]
     */
    public function getCommentList($artid, $page, $limit, $date) {
        // 查询字段
        $_fieldArr = array(
            'comment_ID',
            'comment_date',
            'comment_author',
            // 'comment_author_email',
            // 'comment_agent',
            'comment_author_IP',
            "comment_author_url",
            'comment_content',
            'comment_parent',
            'user_id'
        );
        $_fields = implode(", ", $_fieldArr);

        // 限制条件(返回已批准、非回复的评论)
        $_where = "comment_approved=1 AND comment_post_ID=$artid AND comment_parent=0";

        // 评论总数
        $resQueryAll = $this->query("SELECT comment_ID FROM wp_comments WHERE $_where");
        $total = $resQueryAll['total'];

        // 排序默认按最新
        $sort = $date === -1 ? 'ASC' : 'DESC';
        $_order = "ORDER BY comment_date $sort";

        // 分页起点
        $start = ($page - 1) * $limit;

        $resQueryList = $this->query("SELECT $_fields FROM wp_comments WHERE $_where $_order LIMIT $start, $limit");

        // 查询成功
        if ($resQueryList['success']) {
            $itemArray = array();

            foreach ($resQueryList['items'] as $key => $item) {
                // 评论id
                $cid = intval($item['comment_ID']);

                // 回复的所有评论
                $replies = $this->getReplyComments($cid);

                // 是否是管理员回复
                $isAdmin = intval($item['user_id']) === 1;

                // 数据格式化
                $itemFormat = array(
                    'id'       => $cid,
                    'pid'      => intval($item['comment_parent']),
                    'author'   => $isAdmin ? $this->ADMIN : $item['comment_author'],
                    'url'      => preg_replace('/(http:)/', "", $item['comment_author_url']),
                    'address'  => $isAdmin ? '' : getCityName($item['comment_author_IP']),
                    'date'     => $item['comment_date'],
                    'content'  => htmlspecialchars_decode(postAutoP($item['comment_content'])),
                    'replies'  => $replies,
                    'admin'    => $isAdmin,
                    'passed'   => true
                );

                array_push($itemArray, $itemFormat);
            }

            $resArray = array(
                // 选项数组
                'items' => $itemArray,
                // 总条数
                'total' => $total,
                // 总页数
                'pages' => ceil($total / $limit),
                // 当前第几页
                'page'  => intval($page)
            );

            // 返回的结果
            $retArray = array(
                'success' => true,
                'result'  => $resArray
            );
        }
        // 查询失败
        else {
            $retArray = array(
                'success' => false,
                'result'  => null
            );
        }

        return json_encode($retArray);
    }

    /**
     * getParentComment 获取父级评论内容
     * param  [Number] $pid   [父评论ID]
     */
    private function getParentComment($pid) {
        if (!$pid) {
            return null;
        }

        // 父评论需要字段
        $_fieldArr = array(
            'comment_author',
            "comment_author_url",
            'comment_content',
            'user_id'
        );
        $_fields = implode(", ", $_fieldArr);

        $resQueryParent = $this->query("SELECT $_fields FROM wp_comments WHERE comment_ID=$pid LIMIT 1");

        // 查询成功
        if ($resQueryParent['success']) {
            $parentItem = $resQueryParent['items'][0];
            $isAdmin = intval($parentItem['user_id']) === 1;

            $parent = array(
                'author'  => $isAdmin ? $this->ADMIN : $parentItem['comment_author'],
                'url'     => preg_replace('/(http:)/', "", $parentItem['comment_author_url']),
                'content' => htmlspecialchars_decode(postAutoP($parentItem['comment_content']))
            );
        }
        // 查询失败
        else {
            $parent = null;
        }

        return $parent;
    }

    /**
     * getReplyComments 获取回复于当前评论的所有评论
     * @param   [type]  $cid  [当前评论id]
     */
    private function getReplyComments($cid) {
        if (!$cid) {
            return null;
        }

        // 查询字段
        $_fieldArr = array(
            'comment_ID',
            'comment_date',
            'comment_author',
            // 'comment_author_email',
            // 'comment_agent',
            'comment_author_IP',
            "comment_author_url",
            'comment_content',
            'comment_parent',
            'user_id'
        );
        $_fields = implode(", ", $_fieldArr);

        $resQuery = $this->query("SELECT $_fields FROM wp_comments WHERE comment_parent=$cid");

        // 总结果数
        $total = $resQuery['total'];

        // 查询成功
        if ($resQuery['success']) {
            $itemArray = array();

            foreach ($resQuery['items'] as $key => $item) {
                // 是否是管理员回复
                $isAdmin = intval($item['user_id']) === 1;

                // 数据格式化
                $itemFormat = array(
                    'id'       => intval($item['comment_ID']),
                    'pid'      => $cid,
                    'author'   => $isAdmin ? $this->ADMIN : $item['comment_author'],
                    'url'      => preg_replace('/(http:)/', "", $item['comment_author_url']),
                    'date'     => $item['comment_date'],
                    'content'  => htmlspecialchars_decode(postAutoP($item['comment_content'])),
                    'admin'    => $isAdmin,
                    'passed'   => true
                );
                array_push($itemArray, $itemFormat);
            }

            // 返回的结果
            $resArray = $itemArray;
        }
        // 查询失败
        else {
            $resArray = null;
        }

        return $resArray;
    }

    /**
     * addComment 添加一条评论
     * param  [Number] $postid   [被评论的文章ID]
     * param  [String] $content  [评论内容]
     * param  [String] $author   [作者/昵称]
     * param  [String] $link     [网址]
     * param  [String] $id       [回复时原评论id]
     */
    public function addComment($postid, $content, $author, $link, $id) {
        // 错误信息
        $resQueryError = '';

        // 评论内容
        $content = removeTag($content);

        // 评论昵称
        $author = removeTag($author);

        // 存储的默认类型: 0待审核, 1通过, spam垃圾评论, trash回收站评论
        $approved = 1;

        // 当前时间
        $date = date('Y-m-d H:i:s', time());
        // 当前GMT时间
        $gmtdate = gmdate('Y-m-d H:i:s', time());

        // 客户端IP地址
        $ip = getIP();

        // 客户端UA
        $useragent = $_SERVER['HTTP_USER_AGENT'];

        // 设置的字段
        $fieldArr = array(
            "comment_post_ID",
            "comment_author",
            "comment_author_url",
            "comment_content",
            "comment_approved",
            "comment_date",
            "comment_date_gmt",
            "comment_author_IP",
            "comment_agent",
            "comment_parent"
        );
        // 对应的字段值
        $valueArr = array(
            "$postid",
            "'$author'",
            "'$link'",
            "'$content'",
            "$approved",
            "'$date'",
            "'$gmtdate'",
            "'$ip'",
            "'$useragent'",
            "'$id'"
        );
        $_sets = implode(",", $fieldArr);
        $_values = implode(",", $valueArr);

        $resQuery = $this->query("INSERT INTO wp_comments ($_sets) VALUES ($_values)", $insert = true);

        // 查询成功
        if ($resQuery['success']) {
            // 更新文章comment_count字段
            $where = "comment_approved=1 AND comment_post_ID=$postid AND comment_parent=0";
            $resQueryNum = $this->query("SELECT comment_ID FROM wp_comments WHERE $where");
            $num = $resQueryNum['total'];
            $resQueryUpdate = $this->query("UPDATE wp_posts SET comment_count=$num WHERE ID=$postid", $insert = true);

            // 返回新增的评论数据
            $newId = $resQuery['newid'];

            $resQueryNewData = $this->query("SELECT $_sets FROM wp_comments WHERE comment_ID=$newId LIMIT 1");

            // 查询成功
            if ($resQueryNewData['success']) {
                $newData = $resQueryNewData['items'][0];
                $pid = intval($newData['comment_parent']);
                $parent = $this->getParentComment($pid);

                // 数据格式化
                $resultArr = array(
                    'id'      => $newId,
                    'author'  => $newData['comment_author'],
                    'url'     => preg_replace('/(http:)/', "", $newData['comment_author_url']),
                    'address' => getCityName($newData['comment_author_IP']),
                    'date'    => $newData['comment_date'],
                    'content' => htmlspecialchars_decode(postAutoP($newData['comment_content'])),
                    'parent'  => $parent,
                    'admin'   => false,
                    'passed'  => $approved === 1
                );
            }
            // 获取新增数据失败
            else {
                $resultArr = null;
            }
        }
        // 数据插入失败
        else {
            $resQueryError = 'Submit Comment error!';
        }

        // 有错误返回错误信息
        if ($resQueryError) {
            $ret = array(
                'success' => false,
                'message' => $resQueryError
            );
        }
        else {
            $ret = array(
                'success' => true,
                'result'  => $resultArr
            );
        }

        return json_encode($ret);
    }

    /**
     * addMessage 添加一条留言
     * param  [String] $content  [留言内容内容]
     * param  [String] $author   [作者/昵称]
     * param  [String] $link     [网址]
     * param  [String] $email    [留言者的联系信息]
     */
    public function addMessage($content, $author, $link, $email) {
        // 错误信息
        $resQueryError = '';

        // 留言内容
        $content = removeTag($content);

        // 留言昵称
        $author = removeTag($author);

        // 存储的默认类型: 0待审核, 1通过, spam垃圾留言, trash回收站留言
        $approved = 1;

        // 当前时间
        $date = date('Y-m-d H:i:s', time());
        // 当前GMT时间
        $gmtdate = gmdate('Y-m-d H:i:s', time());

        // 客户端IP地址
        $ip = getIP();

        // 客户端UA
        $useragent = $_SERVER['HTTP_USER_AGENT'];

        // 设置的字段
        $fieldArr = array(
            "comment_post_ID",
            "comment_author",
            "comment_author_url",
            "comment_author_email",
            "comment_content",
            "comment_approved",
            "comment_date",
            "comment_date_gmt",
            "comment_author_IP",
            "comment_agent"
        );
        // 对应的字段值
        $valueArr = array(
            2, // 留言的post_id设为2
            "'$author'",
            "'$link'",
            "'$email'",
            "'$content'",
            "$approved",
            "'$date'",
            "'$gmtdate'",
            "'$ip'",
            "'$useragent'"
        );
        $_sets = implode(",", $fieldArr);
        $_values = implode(",", $valueArr);

        $resQuery = $this->query("INSERT INTO wp_comments ($_sets) VALUES ($_values)", $insert = true);

        // 查询成功
        if ($resQuery['success']) {
            // 返回新增的留言数据
            $newId = $resQuery['newid'];
            $resQueryNewData = $this->query("SELECT $_sets FROM wp_comments WHERE comment_ID=$newId LIMIT 1");

            if ($resQueryNewData['success']) {
                $newData = $resQueryNewData['items'][0];

                // 数据格式化
                $resultArr = array(
                    'id'      => $newId,
                    'author'  => $newData['comment_author'],
                    'url'     => preg_replace('/(http:)/', "", $newData['comment_author_url']),
                    'address' => getCityName($newData['comment_author_IP']),
                    'date'    => $newData['comment_date'],
                    'content' => htmlspecialchars_decode(postAutoP($newData['comment_content'])),
                    'admin'   => false,
                    'passed'  => $approved === 1
                );
            }
            // 获取新增数据失败
            else {
                $resultArr = null;
            }
        }
        // 数据插入失败
        else {
            $resQueryError = 'Submit message error!';
        }

        // 有错误返回错误信息
        if ($resQueryError) {
            $ret = array(
                'success' => false,
                'message' => $resQueryError
            );
        }
        else {
            $ret = array(
                'success' => true,
                'result'  => $resultArr
            );
        }

        return json_encode($ret);
    }
}

// 去掉文章的html标签
function removeTag($pee) {
    return preg_replace('/<\/?[^>]+>/i', '', $pee);
}

// 获取第一张图片作为缩略图
function getFirstImg($text) {
    preg_match("<img.*src=[\"](.*?)[\"].*?>", $text, $match);
    if ($match) {
        return $match[1];
    }
    return "";
}

// 去掉HTML标签并作闭合检测, 取自XXX
function fixStripHtmlTags($text) {
    $text = preg_replace("/&quot;/", "&quot;\"", htmlspecialchars($text));
    $tags = "/&lt;(!|)(\/|)(\w*)(\ |)(\w*)([\\\=]*)(?|(\")\"&quot;\"|)(?|(.*)?&quot;(\")|)([\ ]?)(\/|)&gt;/i";
    $replacement = "<$1$2$3$4$5$6$7$8$9$10$11>";
    $text = preg_replace($tags, $replacement, $text);
    $text = preg_replace("/=\"\"/", "=", $text);
    $text = preg_replace("/&quot;\"/", "\"", $text);
    return $text;
}

// 根据IP地址获取城市
function getCityName($ip) {
    $remote = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
    $reg_ip = '/^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1 -9]?\d))))$/';
    if (!$ip || !preg_match($reg_ip, $ip)) {
        return $ip;
    }
    $infoJson = @ file_get_contents($remote.$ip);
    $infoJson = iconv('GBK//IGNORE', 'UTF-8', $infoJson);
    if ($infoJson) {
        $params = json_decode($infoJson, true);
        if ($params) {
            $country = $params['country'];
            $province = $params['province'];
            $city = $params['city'];
            // 只能这样判断了？
            if ($country === '中国' || $country === '中华人民共和国' || $country === '中华') {
                if ($province === $city)  {
                    $address = $city;
                }
                else {
                   $address = $province.$city;
                }
            }
            else {
                $address = $country.$province.$city;
            }
            return $address;
        }
        else {
            return $ip;
        }
    }
    else {
        return $ip;
    }
}

// 获取IP地址
function getIP() {
    if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown"))
        $ip = getenv("HTTP_CLIENT_IP");
    else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
        $ip = getenv("HTTP_X_FORWARDED_FOR");
    else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
        $ip = getenv("REMOTE_ADDR");
    else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
        $ip = $_SERVER['REMOTE_ADDR'];
    else
        $ip = "unknown";
    return($ip);
}

// 文章自动加上段落标签<p></p>, 取自WordPress: wp-includes/formatting.php wpautop() Line 245
function postAutoP($pee, $br = true) {
    $pre_tags = array();

    if (trim($pee) === '')
        return '';

    $pee = $pee . "\n"; // just to make things a little easier, pad the end

    if (strpos($pee, '<pre') !== false) {
        $pee_parts = explode('</pre>', $pee);
        $last_pee = array_pop($pee_parts);
        $pee = '';
        $i = 0;

        foreach ($pee_parts as $pee_part) {
            $start = strpos($pee_part, '<pre');

            // Malformed html?
            if ($start === false) {
                $pee .= $pee_part;
                continue;
            }

            $name = "<pre wp-pre-tag-$i></pre>";
            $pre_tags[$name] = substr($pee_part, $start) . '</pre>';

            $pee .= substr($pee_part, 0, $start) . $name;
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

    if (strpos($pee, '</object>') !== false) {
        // no P/BR around param and embed
        $pee = preg_replace('|(<object[^>]*>)\s*|', '$1', $pee);
        $pee = preg_replace('|\s*</object>|', '</object>', $pee);
        $pee = preg_replace('%\s*(</?(?:param|embed)[^>]*>)\s*%', '$1', $pee);
    }

    if (strpos($pee, '<source') !== false || strpos($pee, '<track') !== false) {
        // no P/BR around source and track
        $pee = preg_replace('%([<\[](?:audio|video)[^>\]]*[>\]])\s*%', '$1', $pee);
        $pee = preg_replace('%\s*([<\[]/(?:audio|video)[>\]])%', '$1', $pee);
        $pee = preg_replace('%\s*(<(?:source|track)[^>]*>)\s*%', '$1', $pee);
    }

    $pee = preg_replace("/\n\n+/", "\n\n", $pee); // take care of duplicates
    // make paragraphs, including one at the end
    $pees = preg_split('/\n\s*\n/', $pee, -1, PREG_SPLIT_NO_EMPTY);
    $pee = '';

    foreach ($pees as $tinkle) {
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

    if ($br) {
        $pee = preg_replace_callback('/<(script|style).*?<\/\\1>/s', '_autop_newline_preservation_helper', $pee);
        $pee = preg_replace('|(?<!<br />)\s*\n|', "<br />\n", $pee); // optionally make line breaks
        $pee = str_replace('<WPPreserveNewline />', "\n", $pee);
    }

    $pee = preg_replace('!(</?' . $allblocks . '[^>]*>)\s*<br />!', "$1", $pee);
    $pee = preg_replace('!<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)!', '$1', $pee);
    $pee = preg_replace("|\n</p>$|", '</p>', $pee);

    if (!empty($pre_tags))
        $pee = str_replace(array_keys($pre_tags), array_values($pre_tags), $pee);

    return $pee;
}

function _autop_newline_preservation_helper($matches) {
    return str_replace("\n", "<WPPreserveNewline />", $matches[0]);
}

?>