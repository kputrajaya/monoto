import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';

import { EDIT_PATH, TREE_MAX_LEVEL } from '../utils';
import style from './style';

const SidebarNode = ({ node, level, parentRef, onLinkClick, onMenuClick, children }) => {
  const [open, setOpen] = useState(!!node.open);

  const actionOpen = () => {
    if (node.isFolder) {
      setOpen((oldOpen) => !oldOpen);
    } else {
      route(EDIT_PATH + node.id);
      onLinkClick();
    }
  };

  const actionMenuOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const sidebarScroll = parentRef?.current?.scrollTop || 0;
    const nodePosition = e.target.getBoundingClientRect().top;
    const nodeHeight = e.target.offsetHeight;
    onMenuClick({
      node,
      level,
      position: {
        top: sidebarScroll + nodePosition + nodeHeight,
      },
    });
  };

  return (
    <Fragment>
      <div
        class={`${style.node} ${style[`level${Math.min(level, TREE_MAX_LEVEL)}`]}`}
        title={node.title}
        onClick={actionOpen}
        onContextMenu={actionMenuOpen}
      >
        {node.isFolder ? (
          <span class={`${style.folder} ${open ? style.open : ''}`}>{node.title}</span>
        ) : (
          <span class={`${style.note}  ${node.public ? style.danger : ''}`}>{node.title}</span>
        )}
        <div class={style.actions} onClick={actionMenuOpen}>
          &bull;&thinsp;&bull;&thinsp;&bull;
        </div>
      </div>
      {open && children}
    </Fragment>
  );
};

export default SidebarNode;
