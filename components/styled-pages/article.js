import styled from 'styled-components'
import { auxColor, fontAuxColor, fontFamilyNumber } from '../styled-global/constant'

export const Article = styled.div`
    padding: 2em 0;
`
export const ArticleHeader = styled.h1`
    font-size: 2.8rem;
    font-weight: 400;
    > a {
        color: #2f4f4f;
    }
`
export const ArticleDate = styled.div`
    padding-bottom: 2em;
    font-style: italic;
    color: ${fontAuxColor};
    font-family: ${fontFamilyNumber};
`
export const ArticleBody = styled.div`
    text-align: justify;
    h2 {
        font-weight: 400;
        padding: 0.5em 0;
        border-bottom: 1px dashed ${auxColor};
    }
    h3 {
        font-weight: 400;
        padding-top: .5em;
    }
    code {
        padding: 0 0.3em;
        border-radius: 0.2em;
        background: #f5f5f5;
        color: #800080;
    }
    img {
        border-radius: 1px;
        max-width: 100%;
        height: auto;
        border: 1px solid ${auxColor};
    }
    pre {
        border-radius: .15em;
        position: relative;
        padding-left: 2.8em;
        font-size: 1.4rem;
        font-weight: bold;
    }
    blockquote {
        background: #f8f8f8;
        margin: 0;
        padding: 0.2rem 2rem;
        border-left: 5px solid ${auxColor};
    }
    .line-nubmer {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        padding: 0;
        width: 24px;
        background: #000;
        user-select: none;
    }
    .line-number-box {
        position: absolute;
        left: 0;
        right: 0;
        top: .5em;
        bottom: .5em;
        padding: 0;
        color: #696969;
        font-size: 1.2rem;
        text-align: center;
    }
`
export const ArticleComment = styled.div`
`
export const ArticleCommentTitle = styled.h4``