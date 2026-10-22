import { Fragment } from 'react';
import { useState } from 'react';
import { EDIT_PATH, route, TREE_MAX_LEVEL } from '../utils';
import style from './style.module.scss';

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
        className={`${style.node} ${style[`level${Math.min(level, TREE_MAX_LEVEL)}`]}`}
        title={node.title}
        onClick={actionOpen}
        onContextMenu={actionMenuOpen}
      >
        {node.isFolder ? (
          <span className={`${style.folder} ${open ? style.open : ''}`}>{node.title}</span>
        ) : (
          <span className={`${style.note}  ${node.public ? style.danger : ''}`}>{node.title}</span>
        )}
        <div className={style.actions} onClick={actionMenuOpen}>
          &bull;&thinsp;&bull;&thinsp;&bull;
        </div>
      </div>
      {open && children}
    </Fragment>
  );
};

export default SidebarNode;
