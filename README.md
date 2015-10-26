# blog
我的博客 <a href="http://www.tangbc.com/blog/" target="_blank">www.tangbc.com/blog</a> 前后端源代码，一个以<a href="https://github.com/tangbc/suagr" target="_blank">sugar</a>框架为核心构建的单页面应用。

# 一、简单介绍
今年（2015）八月之前，我的博客只是一个形式单一、利用模块加载器实现的简单单页应用，代码和模块的复用率和可维护性都很低。
为了更彻底的实现模块和组件化，所以决定改版重构，编写sugar框架。
利用两个多月的“课余时间”，约50条commits，改版重构终于初步完成了。

整个项目的所有视图模块组件都是通过继承sugar的Container类来实现的，sugar是一个封装了jQuery和<a href="https://github.com/vuejs/vue" target="_blank">Vue.js</a>（视图层mvvm库）的、轻量级的、快速构建模块化和组件化项目的一个javascript框架，关于sugar框架更具体的介绍和用法可以看<a href="https://github.com/tangbc/suagr" target="_blank">这里</a>。

整个项目实现了基本的博客功能：分类列表页、文章内容页、评论和留言板。全项目模块化的流程也很方便的维护与后期拓展，也很易于与第三方类库结合起来使用，比如代码高亮插件prism、CSS3动画库animate.css和导航插件headroom。

另外，在`project/widget`文件夹下我自己也开发了多语言langugae模块、CSS3动画处理模块和cookie操作模块。

虽说我的博客只是一个功能很简单的一个单页应用，但是通过利用sugar进行模块化开发，整个项目的设计流程、解决方案和架构我觉得对于中大型应用也是可以适用的。

# 二、项目目录结构
 **`boot`** 系统入口启动文件init.js以及系统前端配置文件config.js

 **`controller`** 路由切换响应模块

 **`lang`** 语言包翻译转换文件
 
 **`plugins`** 第三方插件、库以及系统模块入口——路由控制模块router.js

 **`project`** 组件modules、页面pages模块、功能widget以及项目整体布局文件layout.js

 **`resources`** fortawesome图标、字体、LESS和编译后的CSS文件

 **`sugar`** sugar框架目录，一个独立的项目，以<a href="http://git-scm.com/book/en/v2/Git-Tools-Submodules" target="_blank">子模块</a>的形式引入
 
 **`template`** 模板文件目录，存放所有页面以及模块组件的html布局模板文件
 
 **`wheat`** 数据库配置、接口文件（根据WordPress数据库，利用世界上最好的语言php写的数据查询接口）

 **`index.php`** 主页入口文件

 **`glupfile.js`** gulp配置文件，主要运行js语法检查和编译less的任务

 **`package.json`** 依赖的nodejs包
 
# 三、学习、交流和使用
拉取本项目代码到您的电脑：

1. 克隆项目 `git clone https://github.com/tangbc/blog.git`
2. 初始化子库sugar `git submdule init`
3. 更新子库sugar `git submodule update` 

由于我的测试环境是Apache+Mysql+PHP，所以项目拉下来后需要放到同等环境下才能跑起来。另外如果本地没有WorldPress的数据库，将会自动判断，返回测试用的假数据。

整个项目的流程方案是通过我平时工作经验的借鉴和改进而来的，由于水平有限，项目里、框架中难免有些实现方式不是最合适的甚至是错误的地方，如果发现非常欢迎提出来一起探讨。

任何问题或者建议都可以在<a href="https://github.com/tangbc/blog/issues" target="_blank">这里</a>发表，thanks!
