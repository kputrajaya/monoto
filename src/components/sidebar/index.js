import { createRef, Fragment, h } from 'preact';
import { useEffect, useContext, useMemo, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import { QueryContext, UserContext } from '../context';
import firebase from '../firebase';
import SidebarNode from '../sidebar-node';
import { getNoteUrl, TREE_MAX_LEVEL, TREE_ROOT_NAME } from '../utils';
import style from './style';

const Sidebar = ({ hideSidebar }) => {
  const user = useContext(UserContext);
  const query = useContext(QueryContext);
  const [shownMenu, setShownMenu] = useState();
  const sidebarRef = createRef();

  useEffect(() => {
    document.addEventListener('click', actionMenuClose);
    return () => document.removeEventListener('click', actionMenuClose);
  }, []);

  const nodeTree = useMemo(() => {
    const treeRoot = {
      id: null,
      title: TREE_ROOT_NAME,
      isFolder: true,
      open: true,
      children: []
    };
    if (!query) return [treeRoot];

    // Build parent-children map
    const nodeMap = {};
    query.forEach((doc) => {
      const data = doc.data();
      nodeMap[data.parentId] = nodeMap[data.parentId] || [];
      nodeMap[data.parentId].push({
        ...data,
        id: doc.id
      });
    });

    // Build sorted tree
    const getSortableString = (node) => `${node.isFolder ? '0' : '1'} - ${node.title}`;
    const getChildrenRecursive = (parentId) => (
      nodeMap[parentId]
        ? nodeMap[parentId]
          .map((node) => ({...node, children: node.isFolder ? getChildrenRecursive(node.id) : null}))
          .sort((a, b) => getSortableString(a).localeCompare(getSortableString(b)))
        : null
    );
    treeRoot.children = getChildrenRecursive(null);
    return [treeRoot];
  }, [query]);

  const actionLinkClick = () => {
    if (hideSidebar) {
      hideSidebar();
    }
  };

  const actionMenuClick = (newShownMenu) => {
    setShownMenu((oldShownMenu) => oldShownMenu?.node?.id === newShownMenu?.node?.id ? null : newShownMenu);
  };

  const actionMenuClose = () => {
    setShownMenu(null);
  };

  const actionMenuNewNote = async () => {
    if (!shownMenu) return;
    const name = window.prompt('Enter note name:', 'New Note').trim();
    if (!name) return;

    const doc = await firebase.firestore().collection('tree').add({
      userId: user.uid,
      parentId: shownMenu.node.id,
      title: name,
      isFolder: false,
      body: ''
    });
    route(getNoteUrl(doc.id));
  };

  const actionMenuNewFolder = () => {
    if (!shownMenu) return;
    const name = window.prompt('Enter folder name:', 'New Folder').trim();
    if (!name) return;

    firebase.firestore().collection('tree').add({
      userId: user.uid,
      parentId: shownMenu.node.id,
      title: name,
      isFolder: true
    });
  };

  const actionMenuRename = () => {
    if (!shownMenu) return;
    const nodeType = shownMenu.node.isFolder ? 'folder' : 'note';
    const name = window.prompt(`Enter new ${nodeType} name:`, shownMenu.node.title).trim();
    if (!name) return;

    firebase.firestore().collection('tree').doc(shownMenu.node.id).update({
      title: name
    });
  };

  const actionMenuMove = async () => {
    if (!shownMenu) return;
    const getFoldersRecursive = (nodes, level=1) => nodes
      .map(({ id, title, children }) => {
        const childFolders = children
          ? getFoldersRecursive(children.filter((childNode) => childNode.isFolder), level + 1)
          : [];
        childFolders.splice(0, 0, {id, title, level});
        return childFolders;
      })
      .reduce((acc, folders) => acc.concat(folders), []);
    const folders = getFoldersRecursive(nodeTree);
    const minNumber = 1;
    const maxNumber = folders.length;
    const folderText = folders
      .map((folder, index) => {
        let result = '';
        for (let i = 1; i < folder.level; i++) {
          result += '   ';
        }
        result += ` ${index + 1} : ${folder.title}\n`;
        return result;
      })
      .reduce((acc, row) => acc + row, '');
    const number = Math.floor(window.prompt(`${folderText} Choose folder [${minNumber}-${maxNumber}]:`).trim());
    if (isNaN(number) || number < minNumber || number > maxNumber) return;

    const parentId = folders[number - 1].id;
    firebase.firestore().collection('tree').doc(shownMenu.node.id).update({
      parentId
    });
  };

  const actionDelete = async () => {
    if (!shownMenu) return;
    const confirm = window.confirm(`Delete ${shownMenu.node.isFolder ? 'folder and all its contents' : 'note'}?`);
    if (!confirm) return;

    const deleteRecursive = (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const id = doc.id;
        doc.ref.delete();
        const childQuerySnapshot = await firebase.firestore()
          .collection('tree')
          .where('userId', '==', user.uid)
          .where('parentId', '==', id)
          .get();
        deleteRecursive(childQuerySnapshot);
      });
    };
    const doc = await firebase.firestore().collection('tree').doc(shownMenu.node.id).get();
    deleteRecursive([doc]);
    const homeUrl = '/';
    route(homeUrl)
  };

  const renderNodesRecursive = (nodes, level=1) => (
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
        <ul class={style.nav}>
          <li class={`${style.item} ${style.tree}`}>
            {renderNodesRecursive(nodeTree)}
          </li>
          <li class={style.item}>
            <Link href="/logout" onClick={actionLinkClick}><h3>Logout</h3></Link>
          </li>
        </ul>
      </div>

      <div class={`${style.menu} ${shownMenu ? style.open : ''}`} style={shownMenu?.position}>
        {
          shownMenu?.node?.isFolder &&
          <Fragment>
            <div class={style.item} onClick={actionMenuNewNote}>
              New Note&hellip;
            </div>
            {
              shownMenu?.level < TREE_MAX_LEVEL &&
              <div class={style.item} onClick={actionMenuNewFolder}>
                New Folder&hellip;
              </div>
            }
          </Fragment>
        }
        {
          (shownMenu?.node?.id && shownMenu?.node?.isFolder) &&
          <hr />
        }
        {
          shownMenu?.node?.id &&
          <Fragment>
            <div class={style.item} onClick={actionMenuRename}>
              Rename&hellip;
            </div>
            <div class={style.item} onClick={actionMenuMove}>
              Move&hellip;
            </div>
            <div class={style.item} onClick={actionDelete}>
              Delete
            </div>
          </Fragment>
        }
      </div>
    </div>
  );
};

export default Sidebar;
