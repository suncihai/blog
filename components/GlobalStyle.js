import { createGlobalStyle } from 'styled-components'
import {
    fontSize,
    fontColor,
    fontFamily,
    anchorColor,
    lineHeight
} from './styled-global/constant'

export const GlobalStyle = createGlobalStyle`
    html {
        font-size: 62.5%;
    }
    body {
        background: #fff;
        color: ${fontColor};
        font-size: ${fontSize};
        line-height: ${lineHeight};
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        font-family: ${fontFamily};
    }
    a {
        color: ${anchorColor};
        text-decoration: none;
    }
    div {
        position: relative;
    }
    .tooltip {
        opacity: .8 !important;
        padding: 0 1em !important;
        font-size: 1.2rem !important;
    }
`
