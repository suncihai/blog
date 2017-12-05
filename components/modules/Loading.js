import styled, { keyframes } from 'styled-components'

import ComponentIcon from './Icon'

const Animate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`
const LoadingIcon = styled.span`
    display: inline-block;
    animation: ${Animate} 1s infinite linear;
    animation-fill-mode: both;
    height: ${props => props.size}px;
    line-height: ${props => props.size}px;
    color: ${props => props.color};
    > i {
        font-size: ${props => props.size}px;
    }
`
const Loading = styled.div`
    padding: 1em 0;
    text-align: center;
`

export const Icon = ({ size, color }) => ((
    <LoadingIcon size={size || 16} color={color}>
        <ComponentIcon type="loading" />
    </LoadingIcon>
))

export default ({ size, color }) => ((
    <Loading>
        <Icon size={size || 32} color={color || '#6495ed'} />
    </Loading>
))
