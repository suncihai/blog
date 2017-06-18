
export default () => (
    <div className="loading center">
        <div className="white"></div>
        <style jsx>{`
            @keyframes loading {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            .loading {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid #6495ed;
                animation: loading 1s infinite linear;
                animation-fill-mode: both;
            }
            .white {
                width: 30px;
                height: 20px;
                background: #fff;
                position: absolute;
                left: -5px;
                top: 6px;
            }
        `}</style>
    </div>
)
