import React from 'react'
import styled from 'styled-components'

import { license } from '../../config/website'

const Share = styled.div`
    padding: 2em 0;
`
const License = styled.div`
    padding: 1em;
    background: #f5f5f5;
`
const LicenseImg = styled.img`
    display: block;
`
const LicenseName = styled.div`
    padding: .5em 0;
`

export default class extends React.Component {
    render () {
        return (
            <Share>
                <License>
                    <LicenseImg src="/static/images/license.svg" />
                    <LicenseName>
                        本文采用『<a href={license.link} target="_blank" rel="nofollow noopener">
                            {license.name}
                        </a>』进行许可。
                    </LicenseName>
                </License>
            </Share>
        )
    }
}
