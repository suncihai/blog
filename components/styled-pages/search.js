import styled from 'styled-components'
import { auxColor } from '../styled-global/constant'

export const Header = styled.h2`
    margin-top: 2em;
`
export const List = styled.div`
    padding-bottom: 2em;
`
export const ListEmpty = styled.div`
    text-align: center;
    font-size: 2rem;
    padding-top: 3em;
    > i {
        font-size: inherit;
    }
`
export const ListHeader = styled.div`
    padding-bottom: 2em;
`
export const ListBody = styled.div``
export const ListItem = styled.div``
export const ListItemTitle = styled.h2`
    font-weight: 400;
    font-size: 2rem;
`
export const ListItemContent = styled.div`
    text-align: justify;
    padding-bottom: 2em;
    font-size: 1.4rem;
    .division {
        margin: 0 1em;
        color: ${auxColor};
    }
`
