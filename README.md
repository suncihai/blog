# blog
基于WordPress数据库的单页面前/后端博客框架。

# 一、简单介绍
本框架适用于WordPress搭建的站点，实现基本的博客功能：博客列表、分页、文章、评论系统、留言系统。后端api接口都是根据WordPress的数据库表结构来进行增删改查的。
本质上是一个模板，与普通WordPress模板不同的是本框架的数据和页面是完全分离的，Ajax请求数据，DOM操作渲染页面。

框架优点：加载速度快，体验好，页面组件模块化便于管理；

框架缺点：单页面应用不利于搜索引擎收录（SEO）。

# 二、目录结构
 **`boot`** 系统入口启动文件init.js以及系统前端配置文件config.js
 
 **`controller`** 路由切换响应模块
 
 **`dist`** 系统核心模块core、第三方插件plugins和库jquery等
 
 **`lang`** 语言包文件

 **`project`** 组件modules和页面pages模块
 
 **`resources`** 图片、字体、PSD、LESS和CSS文件
 
 **`sprint`** 数据库配置、数据接口文件
 
 **`view`** 视图控制模块
 
 **`waproot`** 移动端访问目录（尚未开发）
 
 index.php

# 三、配置以及使用
详细的配置以及使用请看[这里](https://github.com/tangbc/blog/blob/master/docs/START.md)。

由于水平有限，框架中难免有些实现方式不是最合适的甚至是错误的地方，如果发现非常欢迎提出来一起探讨。

任何问题或者建议都可以在[这里](https://github.com/tangbc/blog/issues)发表。
