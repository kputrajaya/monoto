import { h } from 'preact';

import Sidebar from '../sidebar';
import style from './style';

const Container = ({ children }) => {
  return (
    <div class={style.body}>
      <Sidebar />
      <div class={style.content}>
        {children}
      </div>
    </div>
  );
};

export default Container;
