# blog
我的博客 <a href="http://www.tangbc.com/blog/" target="_blank">www.tangbc.com/blog</a> 前后端源代码，一个以 <a href="https://github.com/tangbc/suagr" target="_blank">sugar</a> 框架为核心构建的单页面应用。

# 一、简单介绍
今年（2015）八月之前，我的博客只是一个形式单一、利用模块加载器实现的简单单页应用，代码和模块的复用率和可维护性都很低。
为了更彻底的实现模块和组件化，所以决定改版重构，创建 sugar.
经过两个多月的时间，约50条commits，改版重构终于完成了。

项目的所有视图模块都是 sugar 实现的，sugar 是一个自带模板和 mvvm 的轻量 javascript 框架，关于 sugar 可以看<a href="https://github.com/tangbc/sugar" target="_blank">这里</a>

整个项目实现了基本的博客功能：分类列表页、文章内容页、评论和留言板。全项目模块化的流程也很方便的维护与后期拓展，也很易于与第三方类库结合起来使用，比如代码高亮插件 prism, CSS3 动画库 animate.css 和导航插件 headroom。

另外，在 `project/widget` 文件夹下我自己也开发了多语言 language 模块、CSS3 动画处理模块和 cookie 操作模块。

虽说我的博客只是一个功能很简单的一个单页应用，但是通过 sugar 的模块化开发，整个项目的设计流程、解决方案和架构我觉得对于中大型应用也是可以适用的。

# 二、项目目录结构
 **`boot`** 系统入口启动文件 init.js 以及系统前端配置文件 config.js

 **`controller`** 路由切换响应模块

 **`lang`** 语言包翻译转换文件

 **`plugins`** 第三方插件、库以及系统模块入口——路由控制模块 router.js

 **`project`** 组件 modules、页面pages模块、功能widget以及项目整体布局文件 layout.js

 **`resources`** fortawesome 图标、字体、LESS 和编译后的 CSS 文件

 **`sugar`** sugar 框架目录，一个独立的项目，以<a href="http://git-scm.com/book/en/v2/Git-Tools-Submodules" target="_blank">子模块</a>的形式引入

 **`template`** 模板文件目录，存放所有页面以及模块组件的 html 布局模板文件

 **`wheat`** 数据库配置、接口文件（根据 WordPress 数据库，利用世界上最好的语言 php 写的数据查询接口）

 **`index.php`** 主页入口文件

 **`glupfile.js`** gulp 配置文件，主要是 js 语法检查和编译 less 的任务


# 三、交流
拉取代码：

1. 克隆项目  `git clone https://github.com/tangbc/blog.git`
2. 初始化子库 sugar  `git submdule init`
3. 更新子库 sugar  `git submodule update`

整个项目的流程方案是通过我平时工作经验的借鉴和改进而来的，由于水平有限，项目中难免有些实现方式不是最合适的甚至是错误的地方，如果发现非常欢迎提出来一起探讨!
