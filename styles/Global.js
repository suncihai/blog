
export default () => (
    <style jsx global>{`
        html {
            font-size: 62.5%;
        }
        body {
            color: #000;
            background: #fff;
            font-size: 1.6rem;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-family: sans-serif;
        }

        a {
            color: #1b66b6;
            text-decoration: none;
            transition: color 500ms ease-out;
        }
        a:hover{
            color: #fabf31;
        }
        div {
            position: relative;
        }

        .center {
            margin: 0 auto;
        }
        .ul-clear-list {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }

        .blog {
            width: 100%;
            line-height: 170%;
            font-weight: normal;
        }
        .global-head {
            height: 50px;
            line-height: 50px;
            background: #1b66b6;
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 100;
        }
        .global-foot {
            width: 85%;
            height: 85px;
            line-height: 85px;
        }
        .global-body {
            width: 85%;
            max-width: 1000px;
            overflow: hidden;
        }
        .global-left {
            float: left;
            width: 70%;
            max-width: 700px;
            background: #fff;
            padding-top: 90px;
            padding-right: 30px;
            box-sizing: border-box;
        }
        .global-right {
            padding-top: 90px;
            width: 30%;
            max-width: 300px;
            float: right;
            background-color: #fff;
        }

        .global-comments-icon {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            display: inline-block;
            background-image: url(/static/images/comments.png);
            background-repeat: no-repeat;
            background-position: center center;
            transform: scale(.5);
        }
        .constantia {
            font-style: italic;
            font-family: Constantia, Georgia;
        }
        .pageins {
            padding: 15px;
            margin-bottom: 30px;
            background: #f0f8ff;
            border-left: 5px solid #b4cfff;
        }

        @media (max-width: 1024px) {
            .global-right {
                display: none;
            }
            body {
                font-size: 1.6rem;
            }
            input, textarea {
                appearance: none;
            }
            ul, ol {
                padding-left: 2em;
            }
            .global-head {
                height: 35px;
                line-height: 35px;
            }
            .global-foot, .global-body, .global-left {
                width: 100%;
            }
            .global-left {
                padding: 0 1em;
                padding-top: 50px;
                max-width: 1024px;
            }
            .pageins {
                border: none;
            }
            .global-foot {
                height: 45px;
                line-height: 45px;
            }
            .image-with-mobile {
                background: #f5f5f5 url(/static/images/default_image.svg);
                background-repeat: no-repeat;
                background-position: center .5em;
                text-align: center;
                margin-top: .5em;
                padding-top: 40px;
                padding-bottom: .5em;
                font-size: 1.2rem;
                font-weight: 200;
                opacity: 0.5;
                user-select: none;
            }
            .image-with-mobile::after {
                content: '';
                width: 200%;
                height: 200%;
                position: absolute;
                top: 0;
                left: 0;
                border: 1px solid #aaa;
                border-radius: 3px;
                transform: scale(0.5,0.5);
                transform-origin: top left;
            }
        }
    `}</style>
)
