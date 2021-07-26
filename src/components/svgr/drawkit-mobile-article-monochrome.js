import { h } from 'preact';

import withDrawkitStyle from './with-drawkit-style';

function SvgComponent(props) {
  return (
    <svg viewBox="0 0 1200 1200" {...props}>
      <defs>
        <pattern
          id="prefix__New_Pattern"
          data-name="New Pattern"
          width={12}
          height={12}
          patternUnits="userSpaceOnUse"
          viewBox="0 0 12 12"
        >
          <path fill="none" d="M0 0h12v12H0z" />
          <circle className="prefix__cls-2" cx={12} cy={9} r={2} />
          <circle className="prefix__cls-2" cx={6} cy={12} r={2} />
          <circle className="prefix__cls-2" cy={9} r={2} />
          <circle className="prefix__cls-2" cx={12} cy={3} r={2} />
          <circle className="prefix__cls-2" cx={6} cy={6} r={2} />
          <circle className="prefix__cls-2" cy={3} r={2} />
          <circle className="prefix__cls-2" cx={6} r={2} />
        </pattern>
        <style>
          {
            '.prefix__cls-7{fill:none}.prefix__cls-2{fill:#949494}.prefix__cls-4{fill:#f3f3f3}.prefix__cls-6{fill:url(#prefix__New_Pattern)}.prefix__cls-7{stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.5px}'
          }
        </style>
      </defs>
      <g id="prefix__Background_elements" data-name="Background elements">
        <path
          d="M876.41 595.49v496.24a65.66 65.66 0 01-65.66 65.66H425a65.66 65.66 0 01-65.66-65.66V107A65.67 65.67 0 01425 41.34h385.75A65.67 65.67 0 01876.41 107v488.49"
          fill="#fff"
        />
        <rect className="prefix__cls-4" x={488.92} y={15.42} width={257.9} height={64.39} rx={15.72} ry={15.72} />
        <path
          className="prefix__cls-4"
          d="M405.91 149.31h423.93v207.6H405.91zM429.63 525.61H995.2v19.53H429.63zM429.63 576.97H995.2v19.53H429.63zM429.63 628.32H995.2v19.53H429.63zM429.63 679.68H995.2v19.53H429.63zM429.63 731.04H995.2v19.53H429.63zM429.63 782.4H995.2v19.53H429.63zM429.63 833.76H995.2v19.53H429.63zM429.63 885.12H995.2v19.53H429.63zM540.74 974.2H807.8v19.53H540.74zM540.74 1015.26h294.41v19.53H540.74zM403.44 472.93h63.86v20.28h-63.86zM483.08 472.93h63.86v20.28h-63.86zM568.07 472.93h63.86v20.28h-63.86z"
        />
        <circle className="prefix__cls-4" cx={475.67} cy={1001.8} r={42.45} />
        <path fill="#e2e2e2" d="M429.63 394.62h525.91v41.69H429.63z" />
      </g>
      <g id="prefix__Vector">
        <path
          className="prefix__cls-6"
          d="M139.71 459.43c-2.83 4.11-7.73 36.26-3.81 56.23 5.63 4.83 27.68 21.55 27.68 21.55l-2.07-64zM286.86 520c-10.14-26.85-17.74-77.59-20-100.25l-10.14-3.42c0 8.57 19.33 166.57-36 229.44 12.93.76 27.73.68 42 .21 7.93-41.32 20.95-109.54 24.14-125.98zM328.36 582c-8 19.09-18 41.57-27.18 61.87 13.14-1 21.9-1.87 21.9-1.87l.77-11.56.79-4.51 3-3.27 1.54-4.36 2.69-21.77 2-26.11-5.49 11.76z"
        />
        <path
          className="prefix__cls-4"
          d="M330.83 1088.66l13.75-19 14.75 8.92V107A65.67 65.67 0 01425 41.34h385.75A65.67 65.67 0 01876.41 107v830.8c10.37-25.88 21.91-50.3 31.38-70.61V101.06A95.06 95.06 0 00812.73 6H423a95.06 95.06 0 00-95 95.06v216.53c16 31.87 19.93 84.56 15.27 91.09a11.44 11.44 0 01-4.6 3.11c2.43 25.91 8 109.24 5.11 128.12-.72 4.75-4.39 15.05-9.69 28.28v-.05c-1.78 28.64-4.15 48.55-5.39 52.4a8.75 8.75 0 01-.73 1.63v475.45a94.68 94.68 0 0023.72 62.81l6.7-55.1z"
        />
        <path
          className="prefix__cls-4"
          d="M857.8 1137.5a65.42 65.42 0 01-47 19.89H425a65.52 65.52 0 01-51.22-24.6l-18.85 31.15a94.75 94.75 0 0068.07 28.74h389.73a94.63 94.63 0 0055.61-18 288.17 288.17 0 01-10.54-37.18z"
        />
        <path d="M175.54 629.41s-81.61 278.7-81.61 284.35 227.78 191.79 232 191.79 21.75-34 21.75-39.91-54.22-50.64-54.22-50.64z" />
        <path
          className="prefix__cls-7"
          d="M161.51 473.2c-29.36-18.48-111.43-71.35-126.67-71.35-17.74 0-16.28 10.46-16.28 13.62s2.18 24.06 51.77 36.94c4.07 5 67.1 68.92 93.25 84.8M304.34 294c-9.4-17.12-21.36-29.05-36.49-33.23M305.78 633.7c12.31-2.88 21-7.15 22.9-13.16 1.24-3.85 3.61-23.76 5.39-52.4"
        />
        <path
          className="prefix__cls-7"
          d="M223.12 267.49c-94 54.15-54.29 352.51-47.58 361.92 4.12 5.76 48.62 10.52 88.66 9"
        />
        <path fill="#333" d="M61.11 436.3L2.12 397.84l32.25-17.83 57.54 36.21-30.8 20.08z" />
        <path
          className="prefix__cls-7"
          d="M266.9 419.78c2.22 22.66 9.82 73.4 20 100.25-4.66 24-30.27 158.33-30.27 158.33l18 23.28s65.86-139.86 69.19-161.73c2.87-18.88-2.68-102.21-5.11-128.12"
        />
        <path
          className="prefix__cls-7"
          d="M278.58 303.79c5.55-6.36 12.16-10.29 19.94-10.46 40.17-.88 51.47 105.87 44.7 115.35s-78.33 16.71-86.46 7.68c-1.73-1.93-2.76-8.58-2.9-17.87M245.48 283.36c11.18-.06 22.37-2.3 22.37-6.54v-61.28M223.12 244.4v23.09M223.12 244.4c-19.05-7.35-32.1-37.31-30.28-72.41M269.37 212c-.49 1.22-1 2.42-1.52 3.59"
        />
        <path
          className="prefix__cls-7"
          d="M177 175c-5 0-30-6-30-23 0-7 4-15 4-23 0-7-3-15-3-25 0-17 17-25 26-25 17 0 21 12 48 12 16 0 23-4 32-4 28 0 32 35 32 39 0 17 23 18 23 36 0 13.31-11 28.46-22.54 34.41M269.5 191a10.5 10.5 0 010 21"
        />
        <path
          d="M1156.76 845.33c-37.49 0-41.48 40.22-66.85 40.22-9.79 0-12.5-10.33-12.5-20.11 0-16.67 26.93-78.55 29.19-118.29a44 44 0 01-8 .72c-17.74 0-32.13-10.31-32.13-23s14.39-23 32.13-23c.8 0 1.59 0 2.37.07-8.49-29.27-28.35-59.82-72-59.82-71.74 0-91.31 127.18-102.18 178.81-6.73 32-78.33 146.75-78.33 231.68 0 74.86 23 138.71 29 138.71h72.13c0-23 44.73-65.49 55.37-77.12 73.62-80.47 195-117.07 195-211.2.04-20.71-5.21-57.67-43.2-57.67z"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          fill="#fff"
        />
        <path
          className="prefix__cls-7"
          d="M207.9 182.67c0 4.07-.94 11.59-3.61 14.88M223.88 203.08c0 2.95-2.39 8.87-7.73 8.87"
        />
        <ellipse cx={218.53} cy={182.91} rx={1.93} ry={3.24} />
        <path d="M274.55 701.64l-18-23.28 7.46-39.1a273.72 273.72 0 01-88.51-9.85c5.36 44.32 81 503 81 503h43.78l.2-2.7 25.42-504.87c-3.2 2.3-10 5.24-19.69 7.9-16.27 36.26-31.66 68.9-31.66 68.9z" />
        <path
          className="prefix__cls-7"
          d="M294.69 1132.37v57.67h-84.22l60.82-27.39v-32.2M344.58 1069.64l49.34 29.85-43.6 72.05 8.05-66.21-27.54-16.67"
        />
        <path d="M735.33 908.29c32.87 127.39 94.85 228.72 138.38 278.64-8.72-15.53-25.19-71-25.19-134.38 0-34.41 11.75-73.71 26.18-110.42-47.58-116.51-112.69-236-152.54-236-6.35 0-9.33 16.25-9.33 29.7a674.67 674.67 0 0011.15 121c1.37 0 2.76-.09 4.17-.09 19.12 0 34.62 5.37 34.62 12s-15.18 11.88-34 12c.29 1.32.57 2.63.87 3.94 18.43.27 33.15 5.53 33.15 12-.02 5.65-11.79 10.47-27.46 11.61z" />
        <path
          className="prefix__cls-7"
          d="M1029 642.06c-71.74 0-91.31 127.18-102.18 178.81-6.73 32-78.33 146.75-78.33 231.68"
        />
      </g>
    </svg>
  );
}

export default withDrawkitStyle(SvgComponent);
