import { createRef, Fragment, h } from 'preact';
import {
  useEffect,
  useContext,
  useMemo,
  useState,
} from 'preact/hooks';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import Autocomplete from '../autocomplete';
import { TreeContext, UserContext } from '../context';
import SidebarNode from '../sidebar-node';
import {
  EDIT_PATH,
  treeBuild,
  treeCreateFolder,
  treeCreateNote,
  treeDeleteNode,
  treeMoveNode,
  treeRenameNode,
  treeSearchNote,
  TREE_MAX_LEVEL,
  useShortcut,
} from '../utils';
import style from './style';

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
    setShownMenu((oldShownMenu) => (oldShownMenu?.node?.id === newShownMenu?.node?.id
      ? null
      : newShownMenu
    ));
  };

  const actionMenuNewNote = () => treeCreateNote(shownMenu?.node, user, tree);
  const actionMenuNewFolder = () => treeCreateFolder(shownMenu?.node, user, tree);
  const actionMenuRename = () => treeRenameNode(shownMenu?.node);
  const actionMenuMove = () => treeMoveNode(shownMenu?.node, tree);
  const actionMenuDelete = () => treeDeleteNode(shownMenu?.node, user);

  const menuShortcutArgs = (key, ref) => [
    key,
    () => (ref.current ? ref.current.click() : null),
    [ref],
  ];
  useShortcut(...menuShortcutArgs('e', menuNewNoteRef));
  useShortcut(...menuShortcutArgs('f', menuNewFolderRef));
  useShortcut(...menuShortcutArgs('r', menuRenameRef));
  useShortcut(...menuShortcutArgs('v', menuMoveRef));
  useShortcut(...menuShortcutArgs('d', menuDeleteRef));
  useShortcut('esc', actionMenuClose, [shownMenu]);
  useShortcut('ctrl+shift+s', () => (searchRef.current ? searchRef.current.focus() : null), [searchRef]);
  useShortcut('ctrl+shift+e', () => treeCreateNote(null, user, tree), [user, tree]);
  useShortcut('ctrl+shift+f', () => treeCreateFolder(null, user, tree), [user, tree]);

  const renderNodesRecursive = (nodes, level = 1) => (
    nodes
      ? nodes.map((node) => (
        <SidebarNode
          node={node}
          level={level}
          parentRef={sidebarRef}
          onLinkClick={actionLinkClick}
          onMenuClick={actionMenuClick}
        >
          {renderNodesRecursive(node.children, level + 1)}
        </SidebarNode>
      ))
      : null
  );

  return (
    <div class={style.sidebar} ref={sidebarRef}>
      <div class={style.content}>
        <div class={style.search}>
          <Autocomplete
            placeholder="Search ..."
            getChoices={(query) => treeSearchNote(tree, query)}
            getLabel={(choice) => choice.title}
            setChoice={(choice) => {
              route(EDIT_PATH + choice.id);
              actionLinkClick();
            }}
            resultMaxHeight="calc(100vh - 60px)"
            ref={searchRef}
          />
        </div>

        <ul class={style.nav}>
          <li class={`${style.item} ${style.tree}`}>
            {renderNodesRecursive(nodeTree)}
          </li>
          <li class={style.item}>
            <Link href="/" onClick={actionLinkClick}><h3>Home</h3></Link>
          </li>
          <li class={style.item}>
            <Link href="/shortcuts" onClick={actionLinkClick}><h3>Shortcuts</h3></Link>
          </li>
          <li class={style.item}>
            <Link href="/logout" onClick={actionLinkClick}><h3>Logout</h3></Link>
          </li>
        </ul>
      </div>

      <div class={`${style.menu} ${shownMenu ? style.open : ''}`} style={shownMenu?.position}>
        {
          shownMenu?.node?.isFolder
          && <Fragment>
            <div class={style.item} ref={menuNewNoteRef} onClick={actionMenuNewNote}>
              New Not<u>e</u>&hellip;
            </div>
            {
              shownMenu?.level < TREE_MAX_LEVEL
              && <div class={style.item} ref={menuNewFolderRef} onClick={actionMenuNewFolder}>
                New <u>F</u>older&hellip;
              </div>
            }
          </Fragment>
        }
        {
          (shownMenu?.node?.id && shownMenu?.node?.isFolder)
          && <hr />
        }
        {
          shownMenu?.node?.id
          && <Fragment>
            <div class={style.item} ref={menuRenameRef} onClick={actionMenuRename}>
              <u>R</u>ename&hellip;
            </div>
            <div class={style.item} ref={menuMoveRef} onClick={actionMenuMove}>
              Mo<u>v</u>e&hellip;
            </div>
            <div class={style.item} ref={menuDeleteRef} onClick={actionMenuDelete}>
              <u>D</u>elete
            </div>
          </Fragment>
        }
      </div>
    </div>
  );
};

export default Sidebar;
