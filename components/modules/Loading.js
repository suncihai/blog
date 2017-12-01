import styled, { keyframes } from 'styled-components'

const Loading = styled.div`
    text-align: center;
    padding: 1em;
`
const LoadingAnimation = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`
const LoadingIcon = styled.div`
    animation: ${LoadingAnimation} 1s infinite linear;
    animation-fill-mode: both;
    display: inline-block;
    > i {
        font-size: 2rem;
    }
`

export default () => (
    <Loading>
        <LoadingIcon><i className="iconfont icon-loading"></i></LoadingIcon>
    </Loading>
)
