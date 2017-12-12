import styled, { css } from 'styled-components'
import { bodyWidth, mediaEdge, bodyMobileWidth, bodyMaxWidth } from './constant'

export const AppBodyStyle = css`
    width: ${bodyWidth};
    max-width: ${bodyMaxWidth};
    @media (max-width: ${mediaEdge}) {
        width: ${bodyMobileWidth};
    }
`
export const EllipsisStyle = css`
    overflow: hidden;
    word-wrap: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
`
export const PrintHideStyle = css`
    @media print {
        display: none;
    }
`

// 全局布局
export const App = styled.div`
    width: 100%;
    background: #fff;
`
export const AppBody = styled.div`
    margin: 0 auto;
    ${AppBodyStyle};
`

// 统一表单样式
export const FormStyle = css`
    display: block;
    color: #464a4c;
    font-size: 1rem;
    line-height: 1.25;
    padding: .5rem .75rem;
    background-color: #fff;
    border-radius: .2rem;
    border: 1px solid rgba(0, 0, 0, .15);
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    &:focus {
        outline: 0;
        border-color: #5cb3fd;
    }
`
