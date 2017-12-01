import styled from 'styled-components'

import { bodyWidth, bodyMaxWidth } from '../styled-global/constant'

const Noticer = styled.div`
    width: ${bodyWidth};
    max-width: ${bodyMaxWidth};
    padding-top: 2em;
    > i {
        font-size: 2rem;
    }
`

export default props => (
    <Noticer>
        {props.children}
    </Noticer>
)
