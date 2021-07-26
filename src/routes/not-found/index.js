import { h } from 'preact';
import { Link } from 'preact-router/match';
import { Helmet } from 'react-helmet';

import Svg from '../../components/svgr/drawkit-error-404-monochrome';
import style from './style';

const NotFound = () => (
  <div class={style.notFound}>
    <Helmet>
      <title>Not Found</title>
    </Helmet>

    <Svg class={style.image} />
    <h2 class={style.text}>&quot;I think I'm lost&hellip;&quot;</h2>
    <Link class={style.link} href="/">
      Go back to safety
    </Link>
  </div>
);

export default NotFound;
