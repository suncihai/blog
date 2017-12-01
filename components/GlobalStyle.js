import {
    fontSize,
    fontColor,
    fontFamily,
    anchorColor
} from './styled-global/constant'

export default () => (
    <style jsx global>{`
        html {
            font-size: 62.5%;
        }
        body {
            background: #fff;
            line-height: 180%;
            color: ${fontColor};
            font-size: ${fontSize};
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
    `}</style>
)
