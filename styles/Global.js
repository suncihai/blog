
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
            color: #1e90ff;
            text-decoration: none;
            transition: color 500ms ease-out;
        }
        a:hover{
            color: #a52a2a;
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
            background: #6495ed;
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
            max-width: 1200px;
            overflow: hidden;
        }
        .global-left {
            float: left;
            width: 70%;
            max-width: 900px;
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
        pre {
            font-size: 1.4rem;
            border-radius: 2px;
            position: relative;
            font-family: 'Roboto Mono', Monaco, courier, monospace;
        }
        .hljs.javascript:after {
            position: absolute;
            content: 'JS';
            top: 0;
            right: .5em;
            font-weight: bold;
            font-family: monospace, sans-serif;
        }
        .hljs.html:after {
            position: absolute;
            content: 'HTML';
            top: 0;
            right: .5em;
            font-weight: bold;
            font-family: monospace, sans-serif;
        }
        .hljs.css:after {
            position: absolute;
            content: 'CSS';
            top: 0;
            right: .5em;
            font-weight: bold;
            font-family: monospace, sans-serif;
        }
        .hljs.php:after {
            position: absolute;
            content: 'PHP';
            top: 0;
            right: .5em;
            font-weight: bold;
            font-family: monospace, sans-serif;
        }
        .hljs.json:after {
            position: absolute;
            content: 'JSON';
            top: 0;
            right: .5em;
            font-weight: bold;
            font-family: monospace, sans-serif;
        }
        .article-content h2 {
            padding-top: 1em;
            padding-bottom: .5em;
            font-weight: 400;
            font-size: 2.4rem;
            border-bottom: 1px dashed #c3c3c3;
        }
        .article-content h3 {
            padding-top: .8em;
            padding-bottom: .4em;
            font-weight: 400;
            font-size: 2rem;
            border-bottom: 1px dashed #e3e3e3;
        }
        .article-content img {
            border-radius: 2px;
            max-width: 100%;
            height: auto;
            transition: 500ms ease-out;
        }
        .article-content img:hover {
            transform: scale(1.02);
        }
        .article-content blockquote {
            background: #f8f8f8;
            margin: 0;
            padding: 0.2rem 2rem;
            border-left: 5px solid #b4cfff;
        }
        .article-content ol li, .article-content ul li {
            margin: 0.5rem 0;
        }
        .article-content code {
            padding: 0 0.2rem;
            border-radius: 3px;
            display: inline-block;
            background: #ffebcd;
            font-family: 'Roboto Mono', Monaco, courier, monospace;
        }
        .constantia {
            font-style: italic;
            font-family: Constantia, Georgia;
        }
        .pageins {
            padding: 15px;
            margin-bottom: 30px;
            border-radius: 2px;
            background: #f0f8ff;
            border-left: 5px solid #b4cfff;
        }

        @media (max-width: 1024px) {
            .global-right {
                display: none;
            }
            body {
                font-size: 1.4rem;
            }
            pre {
                font-size: 1.2rem;
            }
            input, textarea {
                appearance: none;
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
        }
    `}</style>
)
