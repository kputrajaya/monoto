import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { Helmet } from 'react-helmet';

import { TreeContext, UserContext } from '../../components/context';
import { treeCreateNote } from '../../components/utils';
import Svg from '../../components/svgr/drawkit-nature-man-monochrome';
import style from './style';

const Home = () => {
  const user = useContext(UserContext);
  const tree = useContext(TreeContext);

  return (
    <div class={style.home}>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <Svg class={style.image} />
      <h2 class={style.text}>&quot;Nothing to see here&hellip;&quot;</h2>
      <a class={style.link} onClick={() => treeCreateNote(null, user, tree)}>
        Start a new note
      </a>
    </div>
  );
};

export default Home;
