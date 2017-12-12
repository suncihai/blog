import styled from 'styled-components'
import { PrintHideStyle } from '../styled-global'
import { fontAuxColor, auxColor, anchorColor, mediaEdge } from '../styled-global/constant'

export const Header = styled.div`
    padding-top: 2em;
   ${PrintHideStyle};
`
export const Footer = styled.div`
    padding-bottom: 2em;
`
export const HeaderOperator = styled.span`
    cursor: pointer;
    color: ${anchorColor};
    &:hover {
        text-decoration: underline;
    }
`
export const HeaderDivision = styled.span`
    &:after {
        content: '·';
        margin: 0 .5em;
        color: ${fontAuxColor};
    }
`
export const Title = styled.h2`
    margin-top: 1.5em;
`
export const TitleSub = styled.strong`
    > a {
        margin-right: .5em;
    }
`
export const TitleExp = styled.div`
    margin-bottom: 1em;
    border-left: 4px solid ${auxColor};
    padding-left: 0.5em;
    color: ${fontAuxColor};
    font-style: italic;
`
export const Desc = styled.p`
    text-align: justify;
`
export const End = styled.p`
    text-align: right;
    padding: 1em 0;
`
export const Table = styled.table`
    width: 100%;
    margin: 1em 0;
    border-collapse: collapse;
    @media (max-width: ${mediaEdge}) {
        overflow: auto;
        display: block;
        font-size: 1.4rem;
    }
`
export const Tbody = styled.tbody``
export const Tr = styled.tr``
export const Td = styled.td`
    white-space: nowrap;
    padding: .5em 1em;
    border: 1px solid #dadada;
    &.key {
        width: 15%;
        background: #f3f3f3;
    }
    &.value {
        width: 35%;
    }
`
export const Ul = styled.ul``
export const Li = styled.li`
    margin-bottom: .5em;
`
