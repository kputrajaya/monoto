import { h } from 'preact';

function SvgComponent(props) {
  return (
    <svg width={10} height={10} viewBox="35 10 50 9" fill="#fff" {...props}>
      <circle cx={60} cy={15} r={15} fillOpacity={0.5}>
        <animate
          attributeName="fill-opacity"
          from={0.5}
          to={0.5}
          begin="0s"
          dur="1.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export default SvgComponent;
