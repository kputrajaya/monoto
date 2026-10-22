import { createRef, Fragment } from 'react';
import { useEffect, useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Autocomplete from '../autocomplete';
import { TreeContext, UserContext } from '../context';
import SidebarNode from '../sidebar-node';
import {
  EDIT_PATH,
  treeBuild,
  treeCreateFolder,
  treeCreateNote,
  treeDeleteNode,
  treeLinkNode,
  treeMoveNode,
  treePublicNode,
  treeRenameNode,
  treeSearchNote,
  TREE_MAX_LEVEL,
  route,
  useShortcut,
} from '../utils';
import style from './style.module.scss';

const Sidebar = ({ hideSidebar }) => {
  const user = useContext(UserContext);
  const tree = useContext(TreeContext);
  const [shownMenu, setShownMenu] = useState();
  const nodeTree = useMemo(() => treeBuild(tree), [tree]);
  const sidebarRef = createRef();
  const searchRef = createRef();
  const menuNewNoteRef = createRef();
  const menuNewFolderRef = createRef();
  const menuRenameRef = createRef();
  const menuMoveRef = createRef();
  const menuDeleteRef = createRef();
  const menuPublicRef = createRef();
  const menuLinkRef = createRef();

  const actionMenuClose = () => {
    setShownMenu(null);
  };

  useEffect(() => {
    document.addEventListener('click', actionMenuClose);
    return () => document.removeEventListener('click', actionMenuClose);
  }, []);

  const actionLinkClick = () => {
    if (hideSidebar) {
      hideSidebar();
    }
  };

  const actionMenuClick = (newShownMenu) => {
    setShownMenu((oldShownMenu) => (oldShownMenu?.node?.id === newShownMenu?.node?.id ? null : newShownMenu));
  };

  const actionMenuNewNote = () => treeCreateNote(shownMenu?.node, user, tree);
  const actionMenuNewFolder = () => treeCreateFolder(shownMenu?.node, user, tree);
  const actionMenuRename = () => treeRenameNode(shownMenu?.node);
  const actionMenuMove = () => treeMoveNode(shownMenu?.node, tree);
  const actionMenuDelete = () => treeDeleteNode(shownMenu?.node, user);
  const actionMenuPublic = () => treePublicNode(shownMenu?.node);
  const actionMenuLink = () => treeLinkNode(shownMenu?.node);

  const menuShortcutArgs = (key, ref) => [key, () => (ref.current ? ref.current.click() : null), [ref]];
  useShortcut(...menuShortcutArgs('e', menuNewNoteRef));
  useShortcut(...menuShortcutArgs('f', menuNewFolderRef));
  useShortcut(...menuShortcutArgs('r', menuRenameRef));
  useShortcut(...menuShortcutArgs('v', menuMoveRef));
  useShortcut(...menuShortcutArgs('d', menuDeleteRef));
  useShortcut(...menuShortcutArgs('p', menuPublicRef));
  useShortcut(...menuShortcutArgs('c', menuLinkRef));
  useShortcut('esc', actionMenuClose, [shownMenu]);
  useShortcut('ctrl+alt+s', () => (searchRef.current ? searchRef.current.focus() : null), [searchRef]);
  useShortcut('ctrl+alt+e', () => treeCreateNote(null, user, tree), [user, tree]);
  useShortcut('ctrl+alt+f', () => treeCreateFolder(null, user, tree), [user, tree]);

  const renderNodesRecursive = (nodes, level = 1) =>
    nodes
      ? nodes.map((node) => (
          <SidebarNode
            node={node}
            level={level}
            parentRef={sidebarRef}
            onLinkClick={actionLinkClick}
            onMenuClick={actionMenuClick}
            key={node.id || 'root'}
          >
            {renderNodesRecursive(node.children, level + 1)}
          </SidebarNode>
        ))
      : null;

  return (
    <div className={style.sidebar} ref={sidebarRef}>
      <div className={style.content}>
        <div className={style.search}>
          <Autocomplete
            placeholder="Search ..."
            getChoices={(query) => treeSearchNote(tree, query)}
            setChoice={(choice) => {
              route(EDIT_PATH + choice.id);
              actionLinkClick();
            }}
            maxHeight="calc(100vh - 60px)"
            ref={searchRef}
          />
        </div>

        <ul className={style.nav}>
          <li className={`${style.item} ${style.tree}`}>{renderNodesRecursive(nodeTree)}</li>
          <li className={style.item}>
            <Link to="/" onClick={actionLinkClick}>
              <h3>Home</h3>
            </Link>
          </li>
          <li className={style.item}>
            <Link to="/shortcuts" onClick={actionLinkClick}>
              <h3>Shortcuts</h3>
            </Link>
          </li>
          <li className={style.item}>
            <Link to="/logout" onClick={actionLinkClick}>
              <h3>Logout</h3>
            </Link>
          </li>
        </ul>
      </div>

      <div className={`${style.menu} ${shownMenu ? style.open : ''}`} style={shownMenu?.position}>
        {shownMenu?.node?.isFolder && (
          <Fragment>
            <div className={style.item} ref={menuNewNoteRef} onClick={actionMenuNewNote}>
              New Not<u>e</u>&hellip;
            </div>
            {shownMenu?.level < TREE_MAX_LEVEL && (
              <div className={style.item} ref={menuNewFolderRef} onClick={actionMenuNewFolder}>
                New <u>F</u>older&hellip;
              </div>
            )}
            {shownMenu?.node?.id && <hr />}
          </Fragment>
        )}
        {shownMenu?.node?.id && (
          <Fragment>
            <div className={style.item} ref={menuRenameRef} onClick={actionMenuRename}>
              <u>R</u>ename&hellip;
            </div>
            <div className={style.item} ref={menuMoveRef} onClick={actionMenuMove}>
              Mo<u>v</u>e&hellip;
            </div>
            <div className={style.item} ref={menuDeleteRef} onClick={actionMenuDelete}>
              <u>D</u>elete
            </div>

            {!shownMenu?.node?.isFolder && (
              <Fragment>
                <hr />
                {shownMenu?.node?.public && (
                  <Fragment>
                    <div className={style.item} ref={menuLinkRef} onClick={actionMenuLink}>
                      <u>C</u>opy Link
                    </div>
                    <div className={`${style.item} ${style.success}`} ref={menuPublicRef} onClick={actionMenuPublic}>
                      Make <u>P</u>rivate
                    </div>
                  </Fragment>
                )}
                {!shownMenu?.node?.public && (
                  <div className={`${style.item} ${style.danger}`} ref={menuPublicRef} onClick={actionMenuPublic}>
                    Make <u>P</u>ublic
                  </div>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
