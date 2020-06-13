import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import { getNoteUrl, TREE_MAX_LEVEL } from '../utils';
import style from './style';

const SidebarNode = ({ node, level, parentRef, parentMenuOpen, children }) => {
  const [open, setOpen] = useState(!!node.open);

  const noteUrl = getNoteUrl(node.id);

  const actionOpen = () => {
    if (node.isFolder) {
      setOpen((oldOpen) => !oldOpen);
    } else {
      route(noteUrl);
    }
  };

  const actionMenuOpen = (e) => {
    e.stopPropagation();

    const sidebarScroll = parentRef?.current?.scrollTop || 0;
    const nodePosition = e.target.getBoundingClientRect().top;
    const nodeHeight = e.target.offsetHeight;
    parentMenuOpen({
      node,
      level,
      position: {
        top: sidebarScroll + nodePosition + nodeHeight
      }
    });
  };

  return (
    <Fragment>
      <div class={`${style.node} ${style[`level-${Math.min(level, TREE_MAX_LEVEL)}`]}`} title={node.title} onClick={actionOpen}>
        {
          node.isFolder
            ? <span class={`${style.folder} ${open ? style.open : ''}`}>{node.title}</span>
            : <Link className={style.note} activeClassName={style.active} href={noteUrl}>{node.title}</Link>
        }
        <div class={style.nodeActions} onClick={actionMenuOpen}>
          &bull;&thinsp;&bull;&thinsp;&bull;
        </div>
      </div>
      {open && children}
    </Fragment>
  );
};

export default SidebarNode;
