import { useContext } from 'react';
import { Helmet } from 'react-helmet';

import { TreeContext, UserContext } from '../../components/context';
import { treeCreateNote } from '../../components/utils';
import Svg from '../../components/svgr/drawkit-nature-man-monochrome';
import style from './style.module.scss';

const Home = () => {
  const user = useContext(UserContext);
  const tree = useContext(TreeContext);

  return (
    <div className={style.home}>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <Svg className={style.image} />
      <h2 className={style.text}>&quot;Nothing to see here&hellip;&quot;</h2>
      <a className={style.link} onClick={() => treeCreateNote(null, user, tree)}>
        Start a new note
      </a>
    </div>
  );
};

export default Home;
