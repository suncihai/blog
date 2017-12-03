import React from 'react'
import styled from 'styled-components'

import { license } from '../../config/website'
import { mediaEdge } from '../styled-global/constant'
import track from '../../helpers/track'

const Share = styled.div`
    padding: 2em 0;
    @media (max-width: ${mediaEdge}) {
        padding: 1em 0;
    }
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
                        本文采用『<a href={license.link} target="_blank" rel="nofollow noopener"
                            onClick={() => track('license.click')}
                        >
                            {license.name}
                        </a>』进行许可。
                    </LicenseName>
                </License>
            </Share>
        )
    }
}
