import React from 'react'
import styled from 'styled-components'

import { icp, copyright, source } from '../../config/website'
import { bodyWidth, bodyMaxWidth, footerHeight, auxAnchorColor } from '../styled-global/constant'

const Footer = styled.div`
    width: 100%;
    height: ${footerHeight};
    line-height: ${footerHeight};
    position: ${props => props.scrollBar ? '' : 'fixed'};
    bottom: 0;
    `
const FooterBody = styled.div`
    margin: 0 auto;
    text-align: center;
    color: ${auxAnchorColor};
    width: ${bodyWidth};
    max-width: ${bodyMaxWidth};
    border-top: 1px solid #efefef;
    a {
        color: ${auxAnchorColor};
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
`
const FooterIcp = styled.small`
    float: right;
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
                        <a rel="nofollow noopener" target="_blank" href={source}>源代码</a>
                    </FooterSource>
                    <FooterIcp>
                        <a rel="nofollow noopener" target="_blank" href="http://www.miitbeian.gov.cn/">{icp}</a>
                    </FooterIcp>
                </FooterBody>
            </Footer>
        )
    }
}
