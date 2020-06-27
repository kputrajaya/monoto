import { h } from 'preact';
import { Link } from 'preact-router/match';
import { Helmet } from 'react-helmet';

import Svg from '../../components/svgr/drawkit-support-notes-monochrome';
import style from './style';

const Shortcuts = () => {
  return (
    <div class={style.shortcuts}>
      <Helmet>
        <title>Shortcuts</title>
      </Helmet>

      <Svg class={style.image} />
      <h2 class={style.text}>&quot;I'm working on it&hellip;&quot;</h2>
      <Link class={style.link} href="/">Go back to safety</Link>
    </div>
  );
};

export default Shortcuts;
