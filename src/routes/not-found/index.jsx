import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Svg from '../../components/svgr/drawkit-error-404-monochrome';
import style from './style.module.scss';

const NotFound = () => (
  <div className={style.notFound}>
    <Helmet>
      <title>Not Found</title>
    </Helmet>

    <Svg className={style.image} />
    <h2 className={style.text}>&quot;I think I'm lost&hellip;&quot;</h2>
    <Link className={style.link} to="/">
      Go back to safety
    </Link>
  </div>
);

export default NotFound;
