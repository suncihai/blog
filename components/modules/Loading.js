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
const LoadingIcon = styled.img`
    animation: ${LoadingAnimation} 1s infinite linear;
    animation-fill-mode: both;
`

export default () => (
    <Loading>
        <LoadingIcon src="/static/images/loading.svg" />
    </Loading>
)
