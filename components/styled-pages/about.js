import styled from 'styled-components'
import { auxColor, fontAuxColor } from '../styled-global/constant'

export const About = styled.div`
    padding: 1em;
    text-align: justify;
`
export const AboutDesc = styled.p`
    &:first-letter {
        font-size: 2.4rem;
    }
`
export const AboutDeclaration = styled.p`
    padding-top: 1em;
`
export const AboutMessage = styled.div`
    padding: 1em 0 2em 0;
`
export const AboutMessageTitle = styled.h3`
    border-left: 4px solid ${auxColor};
    padding: .25em 1em;
    background: #fcfcfc;
`
export const AboutMessageSub = styled.span`
    color: ${fontAuxColor};
`
