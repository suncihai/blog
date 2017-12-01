import styled, { css } from 'styled-components'
import { bodyWidth, bodyMaxWidth } from './constant'

// 全局布局
export const App = styled.div`
    width: 100%;
    background: #fff;
`
export const AppBody = styled.div`
    margin: 0 auto;
    width: ${bodyWidth};
    max-width: ${bodyMaxWidth};
`

// 统一表单样式
export const Input = css`
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
