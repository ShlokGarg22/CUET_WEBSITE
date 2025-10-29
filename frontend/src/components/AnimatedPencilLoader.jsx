export default function AnimatedPencilLoader({ message = "Loading your dashboard..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 opacity-[0.4]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23cbd5e1' stroke-width='0.5'/%3E%3C/svg%3E")`
      }} />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <style jsx>{`
          .pencil {
            display: block;
            width: 10em;
            height: 10em;
          }
          .pencil__body1,
          .pencil__body2,
          .pencil__body3,
          .pencil__eraser,
          .pencil__eraser-skew,
          .pencil__point,
          .pencil__rotate,
          .pencil__stroke {
            animation-duration: 3s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          .pencil__body1,
          .pencil__body2,
          .pencil__body3 {
            transform: rotate(-90deg);
          }
          .pencil__body1 {
            animation-name: pencilBody1;
          }
          .pencil__body2 {
            animation-name: pencilBody2;
          }
          .pencil__body3 {
            animation-name: pencilBody3;
          }
          .pencil__eraser {
            animation-name: pencilEraser;
            transform: rotate(-90deg) translate(49px, 0);
          }
          .pencil__eraser-skew {
            animation-name: pencilEraserSkew;
            animation-timing-function: ease-in-out;
          }
          .pencil__point {
            animation-name: pencilPoint;
            transform: rotate(-90deg) translate(49px, -30px);
          }
          .pencil__rotate {
            animation-name: pencilRotate;
          }
          .pencil__stroke {
            animation-name: pencilStroke;
            transform: translate(100px, 100px) rotate(-113deg);
          }

          @keyframes pencilBody1 {
            from,
            to {
              stroke-dashoffset: 351.86;
              transform: rotate(-90deg);
            }
            50% {
              stroke-dashoffset: 150.8;
              transform: rotate(-225deg);
            }
          }
          @keyframes pencilBody2 {
            from,
            to {
              stroke-dashoffset: 406.84;
              transform: rotate(-90deg);
            }
            50% {
              stroke-dashoffset: 174.36;
              transform: rotate(-225deg);
            }
          }
          @keyframes pencilBody3 {
            from,
            to {
              stroke-dashoffset: 296.88;
              transform: rotate(-90deg);
            }
            50% {
              stroke-dashoffset: 127.23;
              transform: rotate(-225deg);
            }
          }
          @keyframes pencilEraser {
            from,
            to {
              transform: rotate(-45deg) translate(49px, 0);
            }
            50% {
              transform: rotate(0deg) translate(49px, 0);
            }
          }
          @keyframes pencilEraserSkew {
            from,
            32.5%,
            67.5%,
            to {
              transform: skewX(0);
            }
            35%,
            65% {
              transform: skewX(-4deg);
            }
            37.5%,
            62.5% {
              transform: skewX(8deg);
            }
            40%,
            45%,
            50%,
            55%,
            60% {
              transform: skewX(-15deg);
            }
            42.5%,
            47.5%,
            52.5%,
            57.5% {
              transform: skewX(15deg);
            }
          }
          @keyframes pencilPoint {
            from,
            to {
              transform: rotate(-90deg) translate(49px, -30px);
            }
            50% {
              transform: rotate(-225deg) translate(49px, -30px);
            }
          }
          @keyframes pencilRotate {
            from {
              transform: translate(100px, 100px) rotate(0);
            }
            to {
              transform: translate(100px, 100px) rotate(720deg);
            }
          }
          @keyframes pencilStroke {
            from {
              stroke-dashoffset: 439.82;
              transform: translate(100px, 100px) rotate(-113deg);
            }
            50% {
              stroke-dashoffset: 164.93;
              transform: translate(100px, 100px) rotate(-113deg);
            }
            75%,
            to {
              stroke-dashoffset: 439.82;
              transform: translate(100px, 100px) rotate(112deg);
            }
          }
        `}</style>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="200px"
          width="200px"
          viewBox="0 0 200 200"
          className="pencil"
        >
          <defs>
            <clipPath id="pencil-eraser">
              <rect height="30" width="30" ry="5" rx="5" />
            </clipPath>
          </defs>
          <circle
            transform="rotate(-113,100,100)"
            strokeLinecap="round"
            strokeDashoffset="439.82"
            strokeDasharray="439.82 439.82"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            r="70"
            className="pencil__stroke"
          />
          <g transform="translate(100,100)" className="pencil__rotate">
            <g fill="none">
              <circle
                transform="rotate(-90)"
                strokeDashoffset="402"
                strokeDasharray="402.12 402.12"
                strokeWidth="30"
                stroke="hsl(223,90%,50%)"
                r="64"
                className="pencil__body1"
              />
              <circle
                transform="rotate(-90)"
                strokeDashoffset="465"
                strokeDasharray="464.96 464.96"
                strokeWidth="10"
                stroke="hsl(223,90%,60%)"
                r="74"
                className="pencil__body2"
              />
              <circle
                transform="rotate(-90)"
                strokeDashoffset="339"
                strokeDasharray="339.29 339.29"
                strokeWidth="10"
                stroke="hsl(223,90%,40%)"
                r="54"
                className="pencil__body3"
              />
            </g>
            <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
              <g className="pencil__eraser-skew">
                <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)" />
                <rect
                  clipPath="url(#pencil-eraser)"
                  height="30"
                  width="5"
                  fill="hsl(223,90%,60%)"
                />
                <rect height="20" width="30" fill="hsl(223,10%,90%)" />
                <rect height="20" width="15" fill="hsl(223,10%,70%)" />
                <rect height="20" width="5" fill="hsl(223,10%,80%)" />
                <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)" />
                <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)" />
              </g>
            </g>
            <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
              <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)" />
              <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)" />
              <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)" />
            </g>
          </g>
        </svg>
        
        <p className="text-gray-600 font-medium text-lg animate-pulse">{message}</p>
      </div>
    </div>
  );
}
