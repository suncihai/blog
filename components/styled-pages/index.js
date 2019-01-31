import styled from 'styled-components'
import {
    fontColor,
    fontAuxColor,
    auxColor,
    mediaEdge,
    onePixelBorder
} from '../styled-global/constant'

export const Preface = styled.div`
    margin-top: 2em;
    @media (max-width: ${mediaEdge}) {
        padding: 1em;
        margin-top: 1em;
    }
`
export const PrefaceContent = styled.p`
    margin: 0;
    padding: 1em;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: #fff8dc;
    font-size: 1.4rem;
    font-weight: 100;
    border-radius: .1em;
`

export const List = styled.div`
    padding: 2em 0;
    @media (max-width: ${mediaEdge}) {
        padding: 0;
    }
`
export const ListItem = styled.div`
    margin-bottom: 2em;
    padding-bottom: 2em;
    border-bottom: 1px dashed ${auxColor};
    &:last-child {
        border: none;
        margin-bottom: 0;
        @media (max-width: ${mediaEdge}) {
            margin-bottom: 2em;
        }
    }
    @media (max-width: ${mediaEdge}) {
        margin: 0;
        padding: 1em;
        user-select: none;
        ${onePixelBorder}
        &:active {
            background: #f4f4f4;
        }
    }
`
export const ArticleTitle = styled.h2`
    font-weight: 400;
    font-size: 2.2rem;
    &:before {
        content: '•';
        padding-right: .5em;
    }
    > a {
        color: ${fontColor};
        &:hover {
            text-decoration: underline;
            @media (max-width: ${mediaEdge}) {
                text-decoration: none;
            }
        }
    }
    @media (max-width: ${mediaEdge}) {
        font-size: 1.8rem;
        &:before {
            display: none;
        }
    }
`
export const ArticleInfo = styled.div`
    font-size: 1.4rem;
    padding-left: 1.9em;
    color: ${fontAuxColor};
    @media (max-width: ${mediaEdge}) {
        padding: 0;
    }
`
export const ArticleInfoItem = styled.span`
    margin-right: 2.5em;
    vertical-align: top;
    @media (max-width: ${mediaEdge}) {
        &:first-child {
            display: none;
        }
    }
    > i {
        margin-right: .35em;
    }
`
