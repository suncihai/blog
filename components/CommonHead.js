import React from 'react'
import config from '../config'
import Link from 'next/link'
import NProgress from 'nprogress'
import Router from 'next/router'

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeError = () => NProgress.done()
Router.onRouteChangeComplete = () => NProgress.done()

const NAVS = [
    { href: '/', text: '主页' },
    { href: '/essay', text: '我的随笔' },
    { href: '/message', text: '给我留言' },
    { href: '/resume', text: '个人简历' }
]

export default class extends React.Component {

    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className="global-head">
                <div className="common-head center">
                    <div className="logo head-item">
                        <Link href="/">
                            <a className="site-name">{ '<TANGBC/>' }</a>
                        </Link>
                    </div>
                    <ul className="ul-clear-list head-item nav">
                    { NAVS.map((nav) => (
                        <li className="nav-item" key={ nav.href }>
                            <Link prefetch href={ nav.href }>
                                <a className={ 'link' + (this.props.active === nav.href ? ' active' : '') }>
                                    { nav.text }
                                </a>
                            </Link>
                        </li>
                    )) }
                    </ul>
                </div>

                <style jsx>{`
                    .common-head {
                        width: 85%;
                        height: 100%;
                        max-width: 1000px;
                        position: relative;
                    }
                    .head-item {
                        display: inline-block;
                        vertical-align: text-bottom;;
                    }

                    .logo {
                        font-size: 2rem;
                        font-family: Constantia, Georgia;
                    }
                    .site-name {
                        color: #fabf31;
                    }

                    .nav {
                        padding: 0 30px;
                        display: inline-block;
                    }
                    .nav-item {
                        margin: 0 2em;
                        text-align: center;
                        display: inline-block;
                    }
                    .link {
                        color: #fffaf0;
                    }
                    .active {
                        color: #fabf31;
                    }

                    @media (max-width: 880px) {
                        .nav-item {
                            padding: 0 1em;
                        }
                    }

                    @media (max-width: 768px) {
                        .logo {
                            display: none;
                        }
                        .common-head {
                            width: 100%;
                        }
                        .nav {
                            display: block;
                            padding: 0;
                        }
                        .nav-item {
                            width: 25%;
                            padding: 0;
                            font-size: 1.5rem;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
