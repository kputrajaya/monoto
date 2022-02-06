import { h } from 'preact';

import style from './style';

const withDrawkitStyle = (SvgComponent) =>
  function StyledSvgComponent(props) {
    return <SvgComponent {...props} class={`${style.drawkitSvg} ${props.class || ''}`} />;
  };

export default withDrawkitStyle;
