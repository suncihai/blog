import React from 'react'

const NAVS = [
    {
        href: '',
        text: '博客首页'
    },
    {
        href: 'essay',
        text: '我的随笔'
    },
    {
        href: 'message',
        text: '给我留言'
    },
    // {
    //     href: 'resume',
    //     text: '个人简历'
    // },
]

export default class extends React.Component {

    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className="global-head">
                <div className="common-head center">
                    <div className="logo head-item constantia">
                        <a className="site-name" href="/">{ '<TANGBC/>' }</a>
                    </div>
                    <ul className="ul-clear-list head-item nav">
                    { NAVS.map((nav) => (
                        <li className="nav-item" key={ nav.href }>
                            <a
                                className={ 'link' + (this.props.active === nav.href ? ' active' : '') }
                                href={ '/' + nav.href }
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
                        max-width: 1200px;
                        position: relative;
                    }
                    .head-item {
                        display: inline-block;
                        vertical-align: text-bottom;;
                    }

                    .logo {
                        font-size: 2rem;
                    }
                    .site-name, .link {
                        color: #fffaf0;
                    }
                    .active {
                        border-bottom: 2px solid;
                    }

                    .nav {
                        padding: 0 30px;
                        display: inline-block;
                    }
                    .nav-item {
                        padding: 0 30px;
                        text-align: center;
                        display: inline-block;
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
                            width: 33%;
                            padding: 0;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
