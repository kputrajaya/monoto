import { h } from 'preact';
import { Helmet } from 'react-helmet';

import Svg from '../../components/svgr/drawkit-nature-man-monochrome';
import style from './style';

const Home = () => {
  return (
    <div class={style.home}>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <Svg class={style.image} />
      <h2 class={style.text}>&quot;Nothing to see here&hellip;&quot;</h2>
      <a class={style.link}>Start a new note.</a>
    </div>
  );
};

export default Home;
