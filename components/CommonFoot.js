import React from 'react'

const COPY = {
    TEXT: '别往下看了，我就是底线~'
}

export default class extends React.Component {

    componentDidMount () {
        var _hmt = _hmt || []
        var hm = document.createElement('script')
        hm.src = 'https://hm.baidu.com/hm.js?76cc38ce96fc554bf5b6ca4047bfd629'
        var s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(hm, s)
    }

    render () {
        return (
            <div className="global-foot center">
                <div className="foot-line"></div>
                <div className="foot-text center">{ COPY.TEXT }</div>

                <style jsx>{`
                    .foot-line {
                        width: 100%;
                        height: 0;
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        border-top: 1px solid #eee;
                    }
                    .foot-text {
                        width: 150px;
                        user-select: none;
                        background: #fff;
                        text-align: center;
                        font-size: 1.2rem;
                        color: #9b9b9b;
                    }
                `}</style>
            </div>
        )
    }
}
