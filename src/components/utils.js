import { route } from 'preact-router';
import { useHotkeys } from 'react-hotkeys-hook';

import firebase from './firebase';

export const HOME_PATH = '/';
export const EDIT_PATH = '/e/';
export const VIEW_PATH = '/v/';
export const LOGOUT_PATH = '/logout';
export const SHORTCUTS_PATH = '/shortcuts';
export const DOWNLOAD_PATH = '/api/download';

export const TREE_MAX_LEVEL = 4;
export const TREE_ROOT_NAME = 'Notes';

export const EDIT_DEBOUNCE_DURATION = 750;

// eslint-disable-next-line no-alert
export const userAlert = ({ title }) => window.alert(title);

export const userInput = ({ title, defaultValue, transform, error }) => {
  // eslint-disable-next-line no-alert
  let input = window.prompt(title, defaultValue);
  if (input === null) return null;

  input = (input || '').trim();
  if (transform) {
    input = transform(input);
  }
  if (!input && error) {
    userAlert({ title: error });
  }
  return input;
};

// eslint-disable-next-line no-alert
export const userConfirm = ({ title }) => window.confirm(title);

// eslint-disable-next-line no-console
export const log = console.debug;

export const hashString = (input) => {
  let hash = 0;
  if (!input.length) return hash;

  for (let i = 0; i < input.length; i += 1) {
    const char = input.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // Convert to 32-bit integer
    // eslint-disable-next-line no-bitwise
    hash &= hash;
  }
  return hash;
};

export const hashNote = (id, body) => hashString(`${id}: ${body}`);

export const useShortcut = (key, action, deps) =>
  useHotkeys(
    key,
    (e) => {
      action();
      e.preventDefault();
      return false;
    },
    { filter: () => true, keydown: false, keyup: true },
    deps
  );

export const treeBuild = (tree) => {
  const treeRoot = {
    id: null,
    title: TREE_ROOT_NAME,
    isFolder: true,
    open: true,
    children: [],
  };
  if (!tree) return [treeRoot];

  // Build parent-children map
  const nodeMap = {};
  tree.forEach((node) => {
    const data = node.data();
    nodeMap[data.parentId] = nodeMap[data.parentId] || [];
    nodeMap[data.parentId].push({
      ...data,
      id: node.id,
    });
  });

  // Build sorted tree
  const getSortableString = (node) => `${node.isFolder ? '0' : '1'} - ${node.title}`;
  const getChildrenRecursive = (parentId) =>
    nodeMap[parentId]
      ? nodeMap[parentId]
          .map((node) => ({ ...node, children: node.isFolder ? getChildrenRecursive(node.id) : null }))
          .sort((a, b) => getSortableString(a).localeCompare(getSortableString(b)))
      : null;
  treeRoot.children = getChildrenRecursive(null);
  return [treeRoot];
};

const prvGetNewName = (isFolder, defaultValue) => {
  const nodeType = isFolder ? 'folder' : 'note';
  return userInput({
    title: `Enter new ${nodeType} name:`,
    defaultValue,
    error: 'Entered an invalid name!',
  });
};

const prvGetNewParentId = (tree, currentNode = null) => {
  const getFoldersRecursive = (nodes, level = 1) =>
    nodes
      .map(({ id, title, children }) => {
        // Exclude notes and itself
        const childFolders = children
          ? getFoldersRecursive(
              children.filter((childNode) => childNode.isFolder && childNode.id !== currentNode?.id),
              level + 1
            )
          : [];
        childFolders.splice(0, 0, { id, title, level });
        return childFolders;
      })
      .reduce((acc, childFolders) => acc.concat(childFolders), []);

  // Check if root is the only valid option
  const folders = getFoldersRecursive(treeBuild(tree));
  if (folders.length === 1) return null;

  // Get user input
  const minNumber = 1;
  const maxNumber = folders.length;
  const folderText = folders
    .map((folder, index) => {
      let result = '';
      for (let i = 1; i < folder.level; i += 1) {
        result += '   ';
      }
      result += ` ${index + 1} : ${folder.title}\n`;
      return result;
    })
    .reduce((acc, row) => acc + row, '');
  const number = userInput({
    title: `${folderText} Choose folder [${minNumber}-${maxNumber}]:`,
    defaultValue: '1',
    transform: (input) => {
      const inputNumber = Math.floor(input);
      return Number.isNaN(inputNumber) || inputNumber < minNumber || inputNumber > maxNumber ? null : inputNumber;
    },
    error: 'Chosen an invalid folder!',
  });

  // Get parent ID, mark unchanged parent as no-op by returning undefined
  const parentId = number ? folders[number - 1].id : undefined;
  return parentId !== currentNode?.parentId ? parentId : undefined;
};

export const treeCreateNote = async (node, user, tree) => {
  const parentId = node ? node.id : prvGetNewParentId(tree);
  if (parentId === undefined) return;

  const name = prvGetNewName(false, 'New Note');
  if (!name) return;

  const doc = await firebase.firestore().collection('tree').add({
    userId: user.uid,
    parentId,
    title: name,
    isFolder: false,
    body: '',
  });
  route(EDIT_PATH + doc.id);
};

export const treeCreateFolder = async (node, user, tree) => {
  const parentId = node ? node.id : prvGetNewParentId(tree);
  if (parentId === undefined) return;

  const name = prvGetNewName(true, 'New Folder');
  if (!name) return;

  firebase.firestore().collection('tree').add({
    userId: user.uid,
    parentId,
    title: name,
    isFolder: true,
  });
};

export const treeRenameNode = async (node) => {
  if (!node) return;

  const name = prvGetNewName(node.isFolder, node.title);
  if (!name) return;

  firebase.firestore().collection('tree').doc(node.id).update({ title: name });
};

export const treeMoveNode = async (node, tree) => {
  if (!node) return;

  const parentId = prvGetNewParentId(tree, node);
  if (parentId === undefined) return;
  if (parentId === node.parentId) {
    userAlert({ title: 'No valid folders found!' });
    return;
  }

  firebase.firestore().collection('tree').doc(node.id).update({ parentId });
};

export const treeDeleteNode = async (node, user) => {
  if (!node || !userConfirm({ title: `Delete "${node.title}"${node.isFolder ? ' and its contents' : ''}?` })) return;

  const deleteRecursive = (docs) => {
    docs.forEach(async (doc) => {
      const { id } = doc;
      doc.ref.delete();
      const childDocs = await firebase
        .firestore()
        .collection('tree')
        .where('userId', '==', user.uid)
        .where('parentId', '==', id)
        .get();
      deleteRecursive(childDocs);
    });
  };
  deleteRecursive([await firebase.firestore().collection('tree').doc(node.id).get()]);
  route(HOME_PATH);
};

export const treePublicNode = (node) => {
  if (!node) return;

  firebase.firestore().collection('tree').doc(node.id).update({ public: !node.public });
};

export const treeLinkNode = (node) => {
  if (!node) return;

  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;
  const host = currentUrl.substring(0, currentUrl.length - currentPath.length);
  const viewUrl = `${host}${VIEW_PATH}${node.id}`;
  window.navigator.clipboard.writeText(viewUrl).then(
    () => userAlert({ title: 'Link copied!' }),
    () => userAlert({ title: 'Link copying is not supported!' })
  );
};

export const treeSearchNote = (tree, query) => {
  let result = [];
  if (!query || query.length < 2) return result;

  const lowercaseQuery = query.toLowerCase();
  tree.forEach((node) => {
    const data = node.data();
    if (data.isFolder) return;

    let score = 0;
    if (data.title.toLowerCase().indexOf(lowercaseQuery) >= 0) {
      score += 2;
    }
    if (data.body.toLowerCase().indexOf(lowercaseQuery) >= 0) {
      score += 1;
    }
    if (score > 0) {
      result.push({
        id: node.id,
        title: data.title,
        score,
      });
    }
  });

  result = result.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (b.score > a.score) return 1;
    return a.title.localeCompare(b.title);
  });
  return result;
};
