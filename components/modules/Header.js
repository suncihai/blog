import React from 'react'
import styled, { css, keyframes } from 'styled-components'

import ComponentIcon from './Icon'
import { navMenus } from '../../config/website'
import { FormStyle, AppBodyStyle, PrintHideStyle } from '../styled-global'
import { headHeight, auxAnchorColor, mediaEdge, onePixelBorder } from '../styled-global/constant'
import track from '../../helpers/track'

const MobileFullWidthStyle = css`
    @media (max-width: ${mediaEdge}) {
        width: 100%;
    }
`
const Header = styled.div`
    width: 100%;
    height: ${headHeight};
    line-height: ${headHeight};
    background: #f8f8ff;
    border-bottom: 1px solid #efefef;
    ${PrintHideStyle};
    ${MobileFullWidthStyle};
    @media (max-width: ${mediaEdge}) {
        ${onePixelBorder}
    }
`
const Nav = styled.div`
    margin: 0 auto;
    ${AppBodyStyle};
    ${MobileFullWidthStyle};
`
const Menu = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: inline-block;
    @media (max-width: ${mediaEdge}) {
        width: 100%;
        display: block;
    }
`
const MenuItem = styled.li`
    display: inline-block;
    @media (max-width: ${mediaEdge}) {
        text-align: center;
        position: relative;
        width: ${1 / navMenus.length * 100}%;
    }
`
const MenuItemAnchor = styled.a`
    color: #808080;
    &.active {
        color: inherit;
        font-weight: bold;
        text-decoration: underline;
    }
`
const MenuItemDivision = styled.span`
    padding: 0 1em;
    color: #808080;
    :after {
        content: '·';
        color: ${auxAnchorColor};
    }
    @media (max-width: ${mediaEdge}) {
        display: none;
    }
`
const Right = styled.div`
    top: 0;
    right: 0;
    position: absolute;
    & > div {
        display: inline-block;
    }
    @media (max-width: ${mediaEdge}) {
        display: none;
    }
`
const RightSearch = styled.div`
    vertical-align: top;
    min-width: 1.5em;
`
const RightSearchAnimate = keyframes`
    from {
        width: 0;
    }
    to {
        width: 150px;
    }
`
const RightSearchInput = styled.input`
    ${FormStyle};
    display: inline-block;
    position: relative;
    top: -2px;
    width: 0;
    padding-right: 2.4em;
    box-sizing: border-box;
    animation: ${RightSearchAnimate} 300ms ease-in-out forwards;
`
const RightSearchIcon = styled.span`
    cursor: pointer;
    position: absolute;
    right: .5em;
    color: ${props => props.active ? '#000' : auxAnchorColor};
`

const ComponentMenuList = ({ path, statusCode }) => navMenus.map((menu, index) => (
    <MenuItem key={menu.path} onClick={() => track('nav.click', `${menu.name}${statusCode}`)}>
        <MenuItemAnchor
            href={menu.path}
            className={`${path === menu.path ? 'active' : ''}`}
        >{menu.name}</MenuItemAnchor>
        {index === navMenus.length - 1 ? null : <MenuItemDivision />}
    </MenuItem>
))

export default class extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            searchValue: '',
            searchVisible: false
        }
    }

    activeSearch (value) {
        if (this.refInput) {
            this.refInput.focus()
            this.refInput.value = value
        }
    }

    clickSearch (e) {
        let { searchVisible, searchValue } = this.state

        // 再次点击去到搜索页面
        if (searchVisible) {
            searchValue = searchValue.trim()
            if (searchValue) {
                track('search.go.click', searchValue)
                this.gotoSearch(searchValue)
            } else {
                this.activeSearch(searchValue)
            }
        } else {
            this.setState({
                searchVisible: true
            })
            track('search.open')
        }
    }

    gotoSearch (searchValue) {
        window.location.href = `/search/${encodeURIComponent(searchValue)}`
    }

    componentDidMount () {
        document.addEventListener('click', e => {
            if (e.timeStamp !== this.ckTimeStamp) {
                if (this.state.searchVisible) {
                    track('search.cancel', e.target.className)
                }

                this.setState({
                    searchVisible: false
                })
            }
        })

        document.addEventListener('keyup', e => {
            let { searchValue } = this.state
            searchValue = searchValue.trim()

            if (e.keyCode === 13 && searchValue) {
                track('search.go.enter', searchValue)
                this.gotoSearch(searchValue)
            }
        })
    }

    render () {
        const { statusCode } = this.props
        const { searchVisible } = this.state

        return (
            <Header>
                <Nav>
                    <Menu>
                        <ComponentMenuList
                            path={this.props.path}
                            statusCode={statusCode ? '·' + statusCode : ''} />
                    </Menu>
                    <Right>
                        <RightSearch onClick={e => { this.ckTimeStamp = e.timeStamp }}>
                            {!searchVisible ? null
                                : <RightSearchInput
                                    placeholder="搜索文章、内容"
                                    onAnimationEnd={e => e.target.focus()}
                                    ref={input => { this.refInput = input }}
                                    onChange={e => this.setState({ searchValue: e.target.value })} />
                            }
                            <RightSearchIcon
                                active={searchVisible}
                                onClick={this.clickSearch.bind(this)}>
                                <ComponentIcon type="search" />
                            </RightSearchIcon>
                        </RightSearch>
                    </Right>
                </Nav>
            </Header>
        )
    }
}
