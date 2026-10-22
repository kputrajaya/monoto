
import style from './style.module.scss';

const withDrawkitStyle = (SvgComponent) =>
  function StyledSvgComponent(props) {
    return <SvgComponent {...props} className={`${style.drawkitSvg} ${props.className || ''}`} />;
  };

export default withDrawkitStyle;
