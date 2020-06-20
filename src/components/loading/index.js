import { h } from 'preact';

import Svg from '../svgr/svg-loaders-puff';
import style from './style';

const Loading = () => {
  return (
    <div class={style.loading}>
      <Svg />
    </div>
  );
};

export default Loading;
