import styled from 'styled-components'
import { fontColor, fontAuxColor, auxColor, fontFamilyNumber, footerHeight } from '../styled-global/constant'

export const List = styled.div`
    padding: 2em 0;
`
export const ListItem = styled.div`
    margin-bottom: 2em;
    padding-bottom: 2em;
    border-bottom: 1px dashed ${auxColor};
    &:last-child {
        border: none;
        margin-bottom: 0;
    }
`
export const ArticleTitle = styled.h2`
    font-weight: 300;
    &:before {
        content: '•';
        padding-right: .5em;
    }
    > a {
        color: ${fontColor};
        &:hover {
            text-decoration: underline;
        }
    }
`
export const ArticleInfo = styled.div`
    font-size: 1.4rem;
    padding-left: 1.9em;
    color: ${fontAuxColor};
    font-style: italic;
    font-family: ${fontFamilyNumber};
`
export const ArticleInfoItem = styled.span`
    margin-right: 2.5em;
    vertical-align: top;
    > i {
        margin-right: .35em;
    }
`
export const NoMoreBottom = styled.div`
    font-size: small;
    text-align: center;
    color: ${fontAuxColor};
    margin-bottom: ${footerHeight};
    > i {
        top: 1px;
        position: relative;
    }
`
