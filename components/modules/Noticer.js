import styled from 'styled-components'

import { AppBodyStyle} from '../styled-global'

const Noticer = styled.div`
    padding-top: 2em;
    ${AppBodyStyle};
    > i {
        font-size: 2rem;
    }
`

export default props => (
    <Noticer>
        {props.children}
    </Noticer>
)
