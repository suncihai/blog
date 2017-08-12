import React from 'react'
import config from '../config'

export default class extends React.Component {

    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className="global-head">
                <div className="common-head center">
                    <div className="logo head-item">
                        <a href="/" className="site-name">{ '<TANGBC/>' }</a>
                    </div>
                    <ul className="ul-clear-list head-item nav">
                    { config.NAVS.map((nav) => (
                        <li className="nav-item" key={ nav.href }>
                            <a href={ nav.href } className={ 'link' + ('/' + this.props.active === nav.href ? ' active' : '') }>
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
                        padding: 0 2.4em;
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
