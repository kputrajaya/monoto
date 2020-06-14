import { h } from 'preact';
import { Helmet } from 'react-helmet';

import style from './style';

const Home = () => {
  return (
    <div class={style.home}>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <h2>Home</h2>
      <p>This is the Home component.</p>
    </div>
  );
};

export default Home;
