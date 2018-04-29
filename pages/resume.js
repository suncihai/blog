import React from 'react'

import track from '../helpers/track'

import HeadMeta from '../components/modules/HeadMeta'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import { App, AppBody } from '../components/styled-global'
import {
    // Header,
    // HeaderOperator,
    // HeaderDivision,
    Footer,
    Title,
    TitleSub,
    TitleExp,
    Desc,
    End,
    Table,
    Tbody,
    Tr,
    Td,
    Ul,
    Li
} from '../components/styled-pages/resume'

const mobileRE = /iPhone|iPad|iPod|Android/i

export default class extends React.Component {
    eventPrint () {
        if (mobileRE.test(navigator.userAgent)) {
            alert('请使用 PC 浏览器点击打印')
            track('resume.m.print')
        } else {
            window.print()
            track('resume.print')
        }
    }

    eventDownload () {
        alert('请点击左侧的 [打印简历] ，然后在打印窗口选择保存为 PDF 即可。')
        track('resume.download')
    }

    render () {
        return (
            <div>
                <HeadMeta
                    title="个人简历"
                    keywords="简历,唐比昌,前端开发工程师"
                    description="唐比昌的个人简历：Web 前端开发工程师" />
                <App>
                    <ComponentHeader />
                    <AppBody>
                        {/* <Header>
                            <HeaderOperator onClick={this.eventPrint.bind(this)}>[打印简历]</HeaderOperator>
                            <HeaderDivision />
                            <HeaderOperator onClick={this.eventDownload.bind(this)}>[下载 PDF 简历]</HeaderOperator>
                        </Header> */}

                        {/* <Title>前端开发工程师</Title> */}

                        <Title>个人信息</Title>
                        <Table>
                            <Tbody>
                                <Tr>
                                    <Td className="key">姓名</Td>
                                    <Td className="value">唐比昌</Td>
                                    <Td className="key">家乡籍贯</Td>
                                    <Td className="value">广西桂林</Td>
                                </Tr>
                                <Tr>
                                    <Td className="key">所在地</Td>
                                    <Td className="value">广东深圳</Td>
                                    <Td className="key">毕业院校</Td>
                                    <Td className="value">桂林电子科技大学 · 本科</Td>
                                </Tr>
                                <Tr>
                                    <Td className="key">Github</Td>
                                    <Td className="value"><a href="https://github.com/tangbc" target="_blank">https://github.com/tangbc</a></Td>
                                    <Td className="key">工作年限</Td>
                                    <Td className="value">2014 年 7 月至今（Web 前端开发）</Td>
                                </Tr>
                            </Tbody>
                        </Table>

                        <Title>简单介绍</Title>
                        <Desc>
                            性格：谦虚随和慢热型；
                            爱好：NBA 、羽毛球；
                            风格：空格缩进无分号党。
                        </Desc>
                        <Title>个人履历</Title>
                        <Ul>
                            <Li>
                                2010·09 至 2014·07 就读于&nbsp;
                                <a target="_blank" rel="nofollow noopener noreferrer" href="http://www.gliet.edu.cn">
                                    桂林电子科技大学
                                </a>。
                            </Li>
                            <Li>
                                2014·07 至 2017·02 就职于&nbsp;
                                <a target="_blank" rel="nofollow noopener noreferrer" href="http://www.sunteng.com">
                                    广州舜飞科技
                                </a>。
                            </Li>
                            <Li>
                                2017·02 至 2018·03 就职于金山&nbsp;
                                <a target="_blank" rel="nofollow noopener noreferrer" href="https://drive.wps.cn">
                                    WPS
                                </a>。
                            </Li>
                            <Li>
                                2018·03 至今就职于腾讯&nbsp;
                                <a target="_blank" rel="nofollow noopener noreferrer" href="http://www.alloyteam.com/">
                                    AlloyTeam
                                </a>。
                            </Li>
                        </Ul>

                        <Title>工作经历</Title>
                        <TitleSub>舜飞科技（2014·07 ~ 2017·02）</TitleSub>
                        <Desc>
                            舜飞科技（互联网广告程序化购买行业）是一个有创造力的技术公司，
                            舜飞前端是一个非常融洽的技术团队。
                        </Desc>
                        <Desc>
                            在舜飞两年多的工作中，我主要负责一个叫 SSP (媒体资源管理平台，
                            一个管理中大型站长和媒体主广告位资源的平台系统) 项目的所有前端开发和维护工作，
                            该项目主要服务于互联网广告的投放优化、流量变现和实时竞价（RTB 服务）等。
                            是一个 toB 的中大型单页面应用，系统核心业务部分主要是由大量数据指标报表和复杂表单逻辑组成。
                            平时的工作主要是根据产品迭代下的需求开发，包括前端的业务报表、表单数据模块和一些通用组件的开发，
                            以及和后端开发伙伴进行数据的联调和对接等。这个项目的前端大部分开发工作都是我一个人全权负责的，
                            团队内部人员分配采用的是项目制，但有时也会抽出来帮助其他项目组进行攻坚。
                        </Desc>
                        <Desc>
                            公司所有项目使用的前端框架均是团队自主研发，我也参与了其中的一些模块的标准接口和 API 的设计。
                            另外，前端框架中的 MVVM 部分是由我独自开发和维护的（详见作品介绍），
                            指令绑定名称借鉴了 Vue 的设计风格，大大提升了开发的效率和体验，
                            承载了多个项目绝大部分表单和页面逻辑的交互实现，并且拥有很好的稳定性和团队成员使用反馈。
                        </Desc>
                        <TitleSub>金山 WPS（2017·03 ~ 2018.03）</TitleSub>
                        <Desc>
                            <a target="_blank" href="https://drive.wps.cn">WPS 云文档</a>
                            &nbsp;是 WPS Office 生态系统中的一个重要部分（网页版文档管理应用），
                            这个项目主要处理 WPS Office Windows 客户端用户文档的漫游存储、
                            网页端协作文档共享和文档对外分享等功能。
                        </Desc>
                        <Desc>
                            加入 WPS 以来我主要负责云文档项目 从 React 到 Vue 的重构工作以及后期的维护和需求迭代开发，
                            在整个重构过程中改掉了旧代码混乱的业务逻辑和一些糟糕的结构设计，采用了一些更好的技术方案（如服务端渲染等），
                            大大的提高了重构后代码的可拓展性和可读性。
                            在各大模块的业务实现中，也提出了一些建设性的改进方案，优化了页面的加载速度和整体的可维护性。
                        </Desc>

                        <Title>主要作品</Title>
                        <TitleExp>
                            以下作品均可以查看源码（框架设计、通用组件、简单的项目架构）或在线阅读社区文章。
                        </TitleExp>
                        <TitleSub>
                            <a target="_blank" href="https://github.com/tangbc/sugar">sugar.js</a>
                            一个用于开发前端模块化 UI 组件的轻量级 MVVM 框架
                        </TitleSub>
                        <Desc>
                            这是我的第一个开源作品，也是我自己实现的一个比较完整的框架轮子。独立分离了组件系统和 MVVM 指令系统，
                            方便按需移植到所需开发业务中。使用场景定位为快速实现一些中小型前端应用的工具，有着体积小和无依赖的特点，
                            目前处在一个相对很稳定的版本。起初只是为了写个简单的组件系统练练手，后来发现使用伴随着繁琐头疼的 DOM 操作，
                            用第三方 MVVM 框架又觉得太冗余和拘束，于是自己就开发了一个只实现指令系统（纯粹 ViewModel）
                            的超级轻量且功能齐全的 MVVM 框架（压缩后仅 25K）。再后来经过舜飞前端团队考量之后（业务契合度、体积小和可定制需求等优点）
                            把我写的 MVVM 作为一个重要部分嵌入到了前端团队的生产框架中，给团队项目带来了开发的便利和效率的提升，
                            至今前公司的业务项目仍在大面积使用中。
                        </Desc>
                        <Desc>
                            sugar.js 具备构建前端组件的基本能力，如组件间消息通信、组件嵌套、组件复用和继承等，API 简单易懂。
                            200 多个测试用例、99% 的测试覆盖率以及通过各种平台浏览器下的测试保证了较高的稳定性和兼容性。
                        </Desc>
                        <TitleSub>
                            <a target="_blank" href="https://github.com/tangbc/vue-virtual-scroll-list">vue-virtual-scroll-list</a>
                            一个基于 Vue2 的大数据虚拟列表组件
                        </TitleSub>
                        <Desc>
                            这是我第二个比较受欢迎的开源作品，通过 Vue2 虚拟 DOM
                            构建组件的特性处理大数据列表渲染的性能问题和无限数据加载问题，
                            可无压力渲染十万条列表数据。代码实现和文档编写都得到了不少赞美和肯定，
                            目前已为许多国内外的开发者所使用和验证，通过 NPM 包下载量最多的时候达到 10K/月。
                            同时也收到了很多的 issue 反馈、改进建议和 pull request，目前这个 repo 处于一个使用稳定的状态。
                        </Desc>
                        <TitleSub>
                            <a target="_blank" href="https://www.tangbc.com">www.tangbc.com</a>我的博客网站
                        </TitleSub>
                        <Desc>这个域名是我在大学时一次偶然的机会注册的，也正是因为这个域名才机缘巧合的喜欢上了前端开发。</Desc>
                        <Desc>
                            目前主要用来记录一些与技术有关或无关的点点滴滴，希望在浩瀚的互联网留下自己的一点点痕迹。
                            后台文章发布用的是 WordPress 数据库，但是主站没有用默认 PHP 模板的搭建方式，
                            而是利用 Next + React + Nodejs 构建服务端渲染的 ReactApp，
                            整个项目结构为前后端都共用一套 JavaScript 代码，这样就可以更灵活地发挥。
                            服务端渲染不仅利于页面的直出和 SEO 收录，而且还可以很好的控制输出数据和缓存方式，以达到更快的首屏访问速度。
                            虽然是一个简单的博客，但是拥有用户交互埋点统计、错误上报、服务端日志等功能，算是一个小型的完整自由架构应用。
                        </Desc>
                        <TitleSub>社区原创技术文章分享</TitleSub>
                        <Ul>
                            <Li>
                                <a href="http://weibo.com/1761511274/DptIkhcbT?type=comment" target="_blank">
                                    利用 JavaScript 数据绑定实现一个简单的 MVVM 库
                                </a> or&nbsp;
                                <a href="https://segmentfault.com/a/1190000004847657" target="_blank">SegmentFault</a>.&nbsp;
                                当我的 MVVM 第一版本初步实现后，我在 SegmentFault 分享了我的这篇文章，
                                将 MVVM 的基本实现思路试图用最简单易懂的方式写出来。那个时候国内社区关于分析 MVVM 完整底层实现原理细节的文章不多，
                                所以得到了很多网友的收藏与推荐，包括尤小右大神的点赞转发。
                            </Li>
                            <Li>
                                <a href="https://www.zhihu.com/question/53176471/answer/134004234" target="_blank">
                                    开发 vue（或类似的 MVVM 框架）的过程中，需要面对的主要问题有哪些？
                                </a> 我在知乎上的发表的一个高赞回答。
                            </Li>
                            <Li>其他的详见我的博客“技术文章”专栏。</Li>
                        </Ul>

                        <Desc></Desc>

                        <End>
                            End.
                        </End>

                        <Footer></Footer>
                    </AppBody>
                    <ComponentFooter visible={true} />
                </App>
            </div>
        )
    }
}
