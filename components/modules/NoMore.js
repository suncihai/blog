import styled from 'styled-components'

import ComponentIcon from './Icon'
import {
    fontAuxColor,
    footerHeight
} from '../styled-global/constant'

const NoMore = styled.div`
    font-size: small;
    text-align: center;
    color: ${fontAuxColor};
    margin-bottom: ${footerHeight};
    > i {
        top: 1px;
        position: relative;
    }
`

export default () => ((
    <NoMore>
        <ComponentIcon type="over" /> 加载完毕，没有更多了~
    </NoMore>
))
