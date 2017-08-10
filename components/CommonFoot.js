const COPY = {
    TEXT: '别往下看了，我就是底线~'
}

export default () => (
    <div className="global-foot center">
        <div className="foot-line"></div>
        <div className="foot-text center">{ COPY.TEXT }</div>
        <div hidden>
            <script src="https://s19.cnzz.com/z_stat.php?id=5606127&web_id=5606127" type="text/javascript"></script>
        </div>

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
