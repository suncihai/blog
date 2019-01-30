import React from 'react'
import styled from 'styled-components'

import { icp, copyright } from '../../config/website'
import { AppBodyStyle, PrintHideStyle } from '../styled-global'
import { mediaEdge, footerHeight, auxAnchorColor, onePixelBorder } from '../styled-global/constant'
import track from '../../helpers/track'

const Footer = styled.div`
    width: 100%;
    height: ${footerHeight};
    line-height: ${footerHeight};
    position: ${props => props.scrollBar ? '' : 'fixed'};
    bottom: 0;
    padding: 0 1em;
    box-sizing: border-box;
    ${PrintHideStyle};
`
const FooterBody = styled.div`
    margin: 0 auto;
    text-align: center;
    color: ${auxAnchorColor};
    border-top: 1px solid #efefef;
    ${AppBodyStyle};
    a {
        color: ${auxAnchorColor};
        &:hover {
            text-decoration: underline;
        }
    }
    @media (max-width: ${mediaEdge}) {
        ${onePixelBorder}
    }
`
const FooterCopyright = styled.small`
    float: left;
    &:after {
        content: '·';
        margin: 0 .5em;
    }
    @media (max-width: ${mediaEdge}) {
        &:after {
            display: none;
        }
    }
`
const FooterSocial = styled.div`
    float: left;
    font-size: small;
    > span:first-child:after {
        content: '·';
        margin: 0 .5em;
    }
    @media (max-width: ${mediaEdge}) {
        float: right;
    }
`
const FooterIcp = styled.small`
    float: right;
    @media (max-width: ${mediaEdge}) {
        display: none;
    }
`

export default class extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            scrollBar: false,
            visibility: 'hidden'
        }
    }

    toggleVisible () {
        const de = document.documentElement
        this.setState({
            visibility: 'visible',
            scrollBar: de.clientHeight < de.offsetHeight
        })
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.visible) {
            this.toggleVisible()
        }
    }

    componentDidMount () {
        if (this.props.visible) {
            this.toggleVisible()
        }
    }

    render () {
        const { scrollBar, visibility } = this.state

        return (
            <Footer scrollBar={scrollBar} style={{ visibility: visibility }}>
                <FooterBody>
                    <FooterCopyright>
                        <a href="/">{copyright}</a>
                    </FooterCopyright>
                    <FooterSocial>
                        <span><a rel="nofollow noopener" href="https://www.zhihu.com/people/tangbc"
                            target="_blank" onClick={() => track('footer.zhihu')}>知乎</a></span>
                        <span><a rel="nofollow noopener" href="https://github.com/tangbc"
                            target="_blank" onClick={() => track('footer.github')}>Github</a></span>
                    </FooterSocial>
                    <FooterIcp>
                        <a rel="nofollow noopener" target="_blank" href="http://www.miitbeian.gov.cn/">{icp}</a>
                    </FooterIcp>
                </FooterBody>
            </Footer>
        )
    }
}
