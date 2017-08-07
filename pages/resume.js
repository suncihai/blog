import React from 'react'
import ReactDOM from 'react-dom'
import ReactTooltip from 'react-tooltip'
// import oneFixed from '../common/one-fixed'
import { isMobile, getDocumentHeight } from '../common'

import CommonHead from '../components/CommonHead'
import CommonFoot from '../components/CommonFoot'
import DocumentHead from '../components/DocumentHead'

const COPY = {
    TITLE: '我的简历',
    KEYWORDS: '简历, 唐比昌, 前端开发工程师',
    DESCRIPTION: '唐比昌的个人简历，求职 Web 前端开发工程师',
    PAGE_INFO: '目前在职，可考虑更好的机会。'
}

export default class extends React.Component {

    static getInitialProps ({ req }) {
        return {
            isMobile: isMobile(req)
        }
    }

    constructor (props) {
        super(props)
        this.state = {
            shown: false,
            showAside: false
        }
    }

    componentDidMount () {
        // oneFixed({
        //     elements: 'h2',
        //     fixedClass: 'fixed-title'
        // })
        document.addEventListener('scroll', this.onScroll.bind(this))
    }

    onScroll () {
        let scrollTop = window.scrollY

        if (!this.props.isMobile) {
            this.toggleAside(scrollTop)
        }
    }

    toggleAside (scrollTop) {
        let reachShow = scrollTop / getDocumentHeight() > 0.2

        if (reachShow && !this.state.shown) {
            this.setState({
                shown: true
            })
        }

        this.setState({
            showAside: reachShow
        })
    }

    eventPrint () {
        window.print()
    }

    render () {
        let { isMobile } = this.props
        let { shown, showAside } = this.state
        let opclass = `${shown ? 'shown' : ''} ${showAside ? 'fadeInLeft' : 'fadeOutLeft'}`

        return (
            <div className="blog center">
                <DocumentHead
                    title={ COPY.TITLE }
                    keywords={ COPY.KEYWORDS }
                    description={ COPY.DESCRIPTION }
                />

                <CommonHead active="resume" />

                <div className="global-body center resume">
                    <div className="resume-padding"></div>
                    <div className="resume-body">
                        {/*<div className="pageins">{ COPY.PAGE_INFO }</div>*/}
                        <div className="content">
                            <div className="form">
                                <h2>职位意向</h2>
                                <h3>Web 前端开发工程师</h3>
                                <p>接受的工作地点：广州 = 深圳 > 杭州 > 上海</p>
                            </div>

                            <div className="form">
                                <h2>个人信息</h2>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="info-key">姓名</td>
                                            <td className="info-value">唐比昌</td>
                                            <td className="info-key">出生年月</td>
                                            <td className="info-value">1990 · 09 （处女座）</td>
                                        </tr>
                                        <tr>
                                            <td className="info-key">所在地</td>
                                            <td className="info-value">广东省 · 珠海市</td>
                                            <td className="info-key">家乡籍贯</td>
                                            <td className="info-value">广西壮族自治区 · 桂林市</td>
                                        </tr>
                                         <tr>
                                            <td className="info-key">电子邮箱</td>
                                            <td className="info-value">tangbc921@gmail.com</td>
                                            <td className="info-key">社交媒体</td>
                                            <td className="info-value">
                                                <a href="http://weibo.com/tbc0921" target="_blank">微博</a>
                                                <span> · </span>
                                                <a href="https://www.zhihu.com/people/tangbc" target="_blank">知乎</a>
                                                <span> · </span>
                                                <a href="https://segmentfault.com/u/tbc0921" target="_blank"> Segmentfault</a>
                                            </td>
                                        </tr>
                                         <tr>
                                            <td className="info-key">个人网站</td>
                                            <td className="info-value">https://www.tangbc.com</td>
                                            <td className="info-key">毕业院校</td>
                                            <td className="info-value">桂林电子科技大学 · 本科</td>
                                        </tr>
                                         <tr>
                                            <td className="info-key">Github</td>
                                            <td className="info-value"><a href="https://github.com/tangbc" target="_blank">https://github.com/tangbc</a></td>
                                            <td className="info-key">工作年限</td>
                                            <td className="info-value">2014 年 7 月至今（Web 前端开发）</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="form">
                                <h2>简单介绍</h2>
                                <p>一个普普通通的小男生，性格谦虚随和，个性乐观开朗；热爱前端开发和交互设计，喜欢分享、阅读和学习，有轻微代码洁癖；作息规律，业余爱好看书、动物园和运动，羽毛球和乒乓球打得不错；喜欢看 NBA (GSW) 和玩 2K 系列单机游戏。</p>
                            </div>

                            <div className="form">
                                <h2>技术能力</h2>
                                <ul>
                                    <li>熟练掌握运用 JavaScript/CSS/HTML 以及用各种框架方案进行前端的应用或组件开发；</li>
                                    <li>熟悉前端的自动化流程，对于当前流行的单元测试和可持续化集成方案有具体的实践经验；</li>
                                    <li>有较强的学习和团队协作能力，熟悉前后端数据对接及调试，能快速定位和解决常见问题。</li>
                                </ul>
                            </div>

                            <div className="form">
                                <h2>个人履历</h2>
                                <ul>
                                    <li>2010 年 9 月至 2014 年 7 月就读于桂林电子科技大学信息与通信专业，修完本科学士学位。</li>
                                    <li>2014 年 7 月至 2017 年 2 月就职于<a target="_blank" rel="nofollow noopener noreferrer" href="https://www.sunteng.com/">广州舜飞信息科技有限公司</a>，任职 Web 前端开发工程师。</li>
                                    <li>2017 年 3 月至今就职于 WPS <a target="_blank" rel="nofollow noopener noreferrer" href="https://drive.wps.cn">云文档</a>，任职 Web 前端开发工程师。</li>
                                </ul>
                            </div>

                            <div className="form">
                                <h2>工作经历</h2>

                                <h3>舜飞科技（2014·07 ~ 2017·02）</h3>
                                <p>舜飞科技（互联网广告行业，广告的程序化购买服务）是一个有创造力的技术公司，舜飞前端是一个非常融洽的技术团队。</p>
                                <p>在舜飞两年多的工作中，我主要负责一个叫 SSP (媒体资源管理平台，一个管理中大型站长和媒体主广告位资源的平台系统) 项目的所有前端开发和维护工作，该项目主要服务于互联网广告的投放优化、流量变现和实时竞价（RTB 服务）等。是一个 toB 的中大型单页面应用，系统核心业务部分主要是由大量数据指标报表和复杂表单逻辑组成。平时的工作主要是根据产品迭代下的需求开发，包括前端的业务报表、表单数据模块和一些通用组件的开发，以及和后端开发伙伴进行数据的联调和对接等。这个项目的前端大部分开发工作都是我一个人全权负责的，团队内部人员分配采用的是项目制，但有时也会抽出来帮助其他项目组进行攻坚。</p>
                                <p>公司所有项目使用的前端框架均是团队自主研发，我也参与了其中的一些模块的标准接口和 API 的设计。另外，前端框架中的 MVVM 部分是由我独自开发和维护的（详见作品介绍），指令绑定名称借鉴了 Vue 的设计风格，大大提升了开发的效率和体验，承载了项目绝大部分表单和页面逻辑的交互实现，并且拥有很好的兼容性、稳定性和使用反馈。</p>

                                <h3>WPS 云文档（2017· 03 ~ now）</h3>
                                <p>WPS 云文档是 WPS Office 生态系统中的一个重要项目（Web 版文档管理应用），日平均活跃用户达 1000 万左右，主要处理用户文档的云存储、团队协作办公和文件对外分享等功能。我主要负责项目从 React 到 Vue 的重构工作以及后期维护和迭代开发。</p>
                            </div>

                            <div className="form">
                                <h2>主要作品</h2>

                                <h3 className="opus"><a href="https://github.com/tangbc/sugar" target="_blank">sugar.js</a> 一个用于开发前端模块化 UI 组件的轻量级 MVVM 框架</h3>
                                <p>这个框架是我自己实现的一个比较完整的轮子，独立分离了组件系统和 MVVM 指令系统，方便按需移植到所需开发业务中，目前已经开发/维护了一年多，核心也改版过几次，目前处在一个相对很稳定的版本。起初只是为了写个简单的组件系统练练手，后来发现使用伴随着繁琐头疼的 DOM 操作，用第三方 MVVM 框架又觉得太冗余，于是自己就开发了一个只实现指令系统的超级轻量且功能齐全的 MVVM 框架（压缩后仅 28kb）。再后来经过团队考量之后（业务契合度、体积小和可定制需求等优点）把我写的 MVVM 作为一个重要部分嵌入到了前端团队的生产框架中，给团队项目带来了开发的便利和效率的提升，至今仍在大面积使用中。</p>
                                <p>sugar.js 具备构建前端组件应用的基本功能，如组件间消息通信、组件嵌套、组件复用和继承等，API 简单易懂。200 多个测试用例、99% 的测试覆盖率以及通过各种平台浏览器下的测试保证了较高的稳定性和兼容性。项目中也实现了几个完整的有意思的例子，如一个标准的 <a href="https://tangbc.github.io/sugar/demos/todoMVC" target="_blank">TodoMVC</a>（不超过 150 行 JS 代码）等等。</p>
                                <p>sugar.js 不仅是一个实现比较完整的开源项目，同时也体现了我的代码编写风格和组织习惯，写出健壮、漂亮和易读的代码是我一直追求的目标。关于 sugar.js 更多的信息和使用细节可以看下<a href="https://github.com/tangbc/sugar/wiki" target="_blank">文档说明</a>。</p>

                                <h3 className="opus"><a href="https://github.com/tangbc/vue-virtual-scroll-list" target="_blank">vue-virtual-scroll-list</a> 一个基于 Vue 的虚拟列表组件</h3>
                                <p>通过 Vue 的虚拟 DOM 特性处理大数据列表渲染的性能问题和无限数据加载问题，可无压力渲染十万条列表数据。目前 WPS 云文档正在使用这个组件，以及不少的国内外开发者朋友也在使用、提 issue 反馈和 pull request 贡献，目前处于一个使用稳定的版本。</p>

                                <h3 className="opus"><a href="https://www.tangbc.com">www.tangbc.com</a> 我的博客网站</h3>
                                <p>主要记录一些与技术有关或无关的点点滴滴。后台文章发布用的是 WordPress 数据库，主站没有用默认 PHP 模板的搭建方式，而是前后端都用 JavaScript 编写，利用 Next + React + Nodejs 构建服务端渲染的 ReactApp，利于文章的直出和 SEO 收录。</p>

                                <h3 className="opus">社区原创技术文章分享</h3>
                                <p>工作这两年博客写的不多，向社区贡献的干货也很少，厚着脸皮列下觉得还看得过去的几篇原创文章：</p>
                                <ul>
                                    <li><a href="http://weibo.com/1761511274/DptIkhcbT?type=comment" target="_blank">利用 JavaScript 数据绑定实现一个简单的 MVVM 库</a> or <a href="https://segmentfault.com/a/1190000004847657" target="_blank">SegmentFault</a>. 当我的 MVVM 第一版本初步实现后，我在 SegmentFault 分享了这篇文章，将 MVVM 的基本实现思路试图用最简单易懂的方式写出来。那个时候国内社区关于分析 MVVM 完整底层实现原理细节的文章不多，所以得到了很多网友的收藏与推荐，包括小右的点赞转发。</li>
                                    <li><a href="https://www.zhihu.com/question/53176471/answer/134004234" target="_blank">开发 vue（或类似的 MVVM 框架）的过程中，需要面对的主要问题有哪些？</a> 我在知乎上的发表过的一个高票回答。</li>
                                    <li><a href="https://segmentfault.com/a/1190000007246561" target="_blank">简单易操作的跨浏览器 JavaScript 单元测试解决方案</a>。一篇介绍跨平台云测试工具 SauceLabs 的使用方法与心得。</li>
                                </ul>
                            </div>

                            <div className="form">
                                <h2>期望的工作内容</h2>
                                <ul>
                                    <li>如果工作内容是一些类似于 toB 的单页面应用，或者是前端业务/组件/框架的设计与编写，或者是关于测试开发流程等，那么可能会很合适我，上手熟悉会很快；</li>
                                    <li>如果是 NodeJS，虽然在舜飞工作期间也有参与过少量 NodeJS 开发工作，但都是一些简单接口的编写与数据查询（MongoDB），对核心流程了解不多，这一块可能会上手慢点；</li>
                                    <li>目前对于 Mobile 端的开发涉及不多，新工作也希望能有机会往这个方向（React Native, Hybrid App 等）去发展最好。</li>
                                </ul>
                                <p>至于新的工作希望做哪方面的工作，我没有严格的取向，不是非得做擅长的，而排拆不擅长的，如能两者兼顾是最好的，还有就是看重团队的位置安排，做技术解决问题就是快乐所在，即使接触一些之前涉及甚少的开发类型我觉得自己也有能力去快速上手并做好。</p>
                            </div>

                            <div className="form">
                                <h2>期望的公司团队</h2>
                                <p>希望加入一个体系成熟（正规军）、融洽和睦（有团建）、互相学习（有分享）的前端团队之中，一起写痛快的代码，做有成就的项目；</p>
                                <p>工作第一，但工作不是生活的全部，工作之余还有其他兴趣爱好看书和运动等，所以不希望公司是强制 996 的加班制度（有双休或调休）。</p>
                            </div>
                        </div>
                    </div>
                    {
                        isMobile ? '' :
                        <div className="resume-aside">
                            <div className={`op animated ${opclass}`}>
                                <a data-tip="发邮件给我" className="op-item" href="mailto:tangbc921@gmail.com">
                                    <img className="op-img" src="/static/images/gmail.svg" alt="SendEmail"/>
                                </a>
                                <a data-tip="下载 PDF 简历" className="op-item" href="javascript:;">
                                    <img className="op-img" src="/static/images/pdf.svg" alt="DownloadPDF"/>
                                </a>
                                <a data-tip="打印简历" onClick={ this.eventPrint.bind(this) } className="op-item" href="javascript:;">
                                    <img className="op-img" src="/static/images/print.svg" alt="PrintResume"/>
                                </a>
                            </div>
                            <ReactTooltip place="left" type="dark" effect="solid"/>
                        </div>
                    }
                </div>

                <CommonFoot />

                <style jsx>{`
                    .resume {
                        padding: 0 4em;
                        box-sizing: border-box;
                        border: 1px solid #dadada;
                        border-radius: 2px;
                        font-family: Helvetica, Arial;
                    }
                    .resume-padding {
                        height: 40px;
                    }
                    .resume-body {
                        text-align: justify;
                    }
                    .form h2 {
                        padding: 0.5em 0;
                        border-bottom: 1px dashed #999;
                        position: relative;
                        background: #fff;
                        width: 100%;
                        margin: 0;
                    }
                    .form h3 {
                        padding: 0 1em;
                        color: #6a737d;
                        border-left: 0.25em solid #dfe2e5;
                    }
                    table {
                        width: 100%;
                        margin: 1em 0;
                        border-collapse: collapse;
                    }
                    td {
                        white-space: nowrap;
                        padding: .5em 1em;
                        border: 1px solid #dadada;
                    }
                    .info-key {
                        width: 15%;
                        background: #f3f3f3;
                    }
                    .info-value {
                        width: 35%;
                    }
                    ul {
                        padding-left: .5em;
                        list-style-position: inside;
                    }
                    li {
                        padding: .5em 0;
                    }
                    .resume-aside {
                        position: absolute;
                        right: -1em;
                        bottom: 0;
                    }
                    .op {
                        display: none;
                        position: fixed;
                        bottom: 4em;
                    }
                    .op.shown {
                        display: block;
                    }
                    .op-item {
                        display: block;
                        width: 32px;
                        height: 32px;
                        margin-top: 1em;
                    }
                    @keyframes fadeInLeft {
                        from {
                            opacity: 0;
                            transform: translate3d(-100%, 0, 0);
                        }
                        to {
                            opacity: 1;
                            transform: none;
                        }
                    }
                    .fadeInLeft {
                        animation-name: fadeInLeft;
                        animation-fill-mode: both;
                    }
                    @keyframes fadeOutLeft {
                        from {
                            opacity: 1;
                        }
                        to {
                            opacity: 0;
                            transform: translate3d(-100%, 0, 0);
                        }
                    }
                    .fadeOutLeft {
                        animation-name: fadeOutLeft;
                        animation-fill-mode: forwards;
                    }
                    .animated {
                        animation-duration: 1s;
                    }
                    @media (max-width: 1024px) {
                        .resume-padding {
                            height: 30px;
                        }
                        .form h2 {
                            font-size: 1.8rem;
                        }
                        .form h3 {
                            font-size: 1.6rem;
                        }
                        .form h2:first-child {
                            padding-top: 0;
                        }
                        table {
                            overflow: auto;
                            display: block;
                        }
                        .resume {
                            border: none;
                            padding: 0 1em;
                        }
                    }
                `}</style>

                <style jsx global>{`
                    @media print {
                        .pageins,
                        .global-head,
                        .global-foot,
                        .resume-padding,
                        .resume-aside {
                            display: none;
                        }
                    }
                    .global-head {
                        position: relative;
                    }
                    .fixed-title {
                        position: fixed !important;
                        top: 0;
                    }
                `}</style>
            </div>
        )
    }
}
