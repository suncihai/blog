import React from 'react'
import styled from 'styled-components'

import { icp, copyright, source } from '../../config/website'
import { AppBodyStyle, PrintHideStyle } from '../styled-global'
import { mediaEdge, footerHeight, auxAnchorColor } from '../styled-global/constant'
import track from '../../helpers/track'

const Footer = styled.div`
    width: 100%;
    height: ${footerHeight};
    line-height: ${footerHeight};
    position: ${props => props.scrollBar ? '' : 'fixed'};
    bottom: 0;
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
`
const FooterCopyright = styled.small`
    float: left;
`
const FooterSource = styled.small`
    float: left;
    &:before {
        content: '·';
        margin: .5em;
    }
    @media (max-width: ${mediaEdge}) {
        position: absolute;
        right: 0;
        &:before {
            display: none;
        }
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
                    <FooterCopyright>{copyright}</FooterCopyright>
                    <FooterSource>
                        <a rel="nofollow noopener" target="_blank" href={source}
                            onClick={() => track('source.click')}>源代码</a>
                    </FooterSource>
                    <FooterIcp>
                        <a rel="nofollow noopener" target="_blank" href="http://www.miitbeian.gov.cn/">{icp}</a>
                    </FooterIcp>
                </FooterBody>
            </Footer>
        )
    }
}
