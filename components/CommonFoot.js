const COPY = {
    TEXT: '我是有底线的'
}

export default () => (
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
                width: 100px;
                user-select: none;
                background: #fff;
                text-align: center;
                font-size: 1.2rem;
                color: #9b9b9b;
            }
        `}</style>
    </div>
)
