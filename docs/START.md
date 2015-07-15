# 1、框架加载流程
+ 框架使用seaJS作为模块加载器，DOM操作使用jQuery。
+ 入口文件`boot/init.js`，文件夹和模块的别名配置，appInit函数是具体的加载流程。
+ appInit最后调用了router.start()启用路由控制（监听hashChange事件），每一次hashChange事件触发就会调用`dist/core/router.js`的`hashChanged`方法进行模块的切换，`hashChanged`方法会异步调用`controller`文件夹中相应的路由控制文件，控制文件得到展示模块`view/view.js`返回的目标DOM，再异步调用页面模块`project/pages`，同时将目标DOM作为参数传入到对应的页面模块中，页面模块再进行页面元素、组件的展示。
+ 关于view文件夹：`view/layout.js`为整体框架布局模块，`view/view.js`模块负责页面切换，决定容器的显示/隐藏。

# 2、后端数据库配置
将您的服务器数据库信息（数据库名称、用户名、密码）填写到`sprint/library/config.php`中，如：
>    /* 服务器 */

>    define('DB_HOST', 'localhost');
>
>    /* 数据库用户名 */

>    define('DB_USER', 'root');
>
>    /* 数据库密码 */

>    define('DB_PASSWORD', '');
>
>    /* 默认数据库 */

>    define('DB_NAME', 'tangbc');
>
>    /* 数据库字符集 */

>    define('DB_CHARSET', 'utf8');
>
>    /* 时区设置 */

>    define('TIMEZONE', "PRC");

# 3、前端配置
前端的基本配置均在`boot/config.js`中，前端配置与数据库相关的只有`config.js`中的`category`字段：

>category: {

>'frontends': 1,

>'moods': 24

>},

frontends和moods为路由hash对应的模块名称，即#frontends和#moods分别对应的是`controller`文件夹中的frontends.js和moods.js，1和24分别是WordPress数据库中相应的分类ID。WordPress分类ID的查看方法：WordPress后台 -> 文章 -> 分类目录 -> 分类目录名称的超链接的url中的&tag_ID参数（审查元素或者看左下角浏览器状态栏）

# 4、个性化修改
+ 修改整体框架布局：需要改动的是`view`里面的layout.js和view.js；
+ 修改页面布局：需要改动的是`project`里的页面pages或者模块modules；
+ 修改样式：所有的css样式都是less编译的，修改样式时先在根目录npm install安装grunt所需要的包，然后开启grunt即可对样式进行实时编译和压缩(grunt cssmin)。
+ 所有less文件都放在`resources/less`目录下，其中M表示组件模块的less，P表示页面模块的less，新增一个文件时需要到app.less文件中进行import

# 5、app模块基础方法
+ `app.animate` app.animate.play: 应用css3动画，并提供一个动画结束的回调函数。
+ `app.cookie` app.cookie.set: 设置cookie值；app.cookie.get: 获取当前cookie值；app.cookie.remove: 删除cookie。
+ `app.data` app.data.get: GET请求；app.data.post: POST请求。
+ `app.event` app.event.bind: 绑定事件； app.event.unbind: 取消绑定； app.event.hover: mouseenter和mouseleave事件结合； app.event.proxy: 代理事件on函数； app.event.unproxy: 取消事件。
+ `app.messager` app.messager.fire: 发布消息；app.messager.on: 订阅消息；app.messager.cancel: 取消消息的订阅。
+ `app.lang` app.lang.load: 加载指定语言。