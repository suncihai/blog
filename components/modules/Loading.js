import styled, { keyframes } from 'styled-components'

const LoadingAnimation = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`
const Loading = styled.div`
    width: 20px;
    height: 20px;
    margin: 0 auto;
    border-radius: 50%;
    border: 2px solid #333;
    animation: ${LoadingAnimation} 1s infinite linear;
    animation-fill-mode: both;
`
const LoadingIcon = styled.div`
    width: 30px;
    height: 20px;
    background: #fff;
    position: absolute;
    left: -5px;
    top: 6px;
`

export default () => (
    <Loading>
        <LoadingIcon />
    </Loading>
)
