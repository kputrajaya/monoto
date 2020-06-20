import { h } from 'preact';

import style from './style';

const withDrawkitStyle = (SvgComponent) => {
  const StyledSvgComponent = (props) => (
    <SvgComponent {...props} class={`${style.drawkitSvg} ${props.class || ''}`} />
  );
  return StyledSvgComponent;
};

export default withDrawkitStyle;
