import React from 'react'

const NAVS = [
    {
        href: '/',
        text: '博客首页'
    },
    {
        href: '/essay',
        text: '我的随笔'
    },
    {
        href: '/message',
        text: '给我留言'
    },
    {
        href: '/resume',
        text: '我的简历'
    },
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
                        <a className="site-name" href="/">{ '<TANGBC/>' }</a>
                    </div>
                    <ul className="ul-clear-list head-item nav">
                    { NAVS.map((nav) => (
                        <li className="nav-item" key={ nav.href }>
                            <a
                                className={ 'link' + ('/' + this.props.active === nav.href ? ' active' : '') }
                                href={ nav.href }
                            >
                                { nav.text }
                            </a>
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
                        text-shadow: 0px 0px 1px #f7c346;
                    }

                    .nav {
                        padding: 0 30px;
                        display: inline-block;
                    }
                    .nav-item {
                        padding: 0 30px;
                        text-align: center;
                        display: inline-block;
                        font-weight: bold;
                    }
                    .link {
                        color: #fffaf0;
                    }
                    .active {
                        color: #fabf31;
                    }

                    @media (max-width: 1024px) {
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
                        }
                    }
                `}</style>
            </div>
        )
    }
}
