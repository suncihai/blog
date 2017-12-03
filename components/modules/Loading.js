import styled, { keyframes } from 'styled-components'

import ComponentIcon from './Icon'
import { auxAnchorColor } from '../styled-global/constant'

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

export const Icon = props => ((
    <LoadingIcon size={props.size || 16} color={props.color}>
        <ComponentIcon type="loading" />
    </LoadingIcon>
))

export default props => ((
    <Loading>
        <Icon size={props.size || 32} color={props.color || auxAnchorColor} />
    </Loading>
))
