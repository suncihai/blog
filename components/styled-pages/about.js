import styled from 'styled-components'
import { auxColor, fontAuxColor } from '../styled-global/constant'

export const About = styled.div`
    padding: 1em 0;
`
export const AboutDesc = styled.p`
    text-align: justify;
    &:first-letter {
        font-size: 2.4rem;
    }
`
export const AboutDeclaration = styled.p`
    color: #999;
    font-style: italic;
    text-align: justify;
`
export const AboutMessage = styled.div`
    padding-bottom: 2em;
`
export const AboutMessageTitle = styled.h3`
    border-left: 4px solid ${auxColor};
    padding: .25em 1em;
    background: #fcfcfc;
`
export const AboutMessageSub = styled.span`
    color: ${fontAuxColor};
`
