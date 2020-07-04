import { route } from 'preact-router';

import firebase from './firebase';

export const HOME_PATH = '/';
export const EDIT_PATH ='/e/';

export const TREE_MAX_LEVEL = 4;
export const TREE_ROOT_NAME = 'Notes';

export const cleanString = (input) => (input || '').trim();
export const hashString = (input) => {
  let hash = 0;
  if (!input.length) return hash;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};


export const treeBuild = (tree) => {
  const treeRoot = {
    id: null,
    title: TREE_ROOT_NAME,
    isFolder: true,
    open: true,
    children: []
  };
  if (!tree) return [treeRoot];

  // Build parent-children map
  const nodeMap = {};
  tree.forEach((doc) => {
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
};

export const treeCreateNote = async (node, user, tree) => {
  const parentId = node ? node.id : _getNewParentId(tree);
  if (parentId === undefined) return;

  const name = _getNewName(false, 'New Note');
  if (!name) return;

  const doc = await firebase.firestore().collection('tree').add({
    userId: user.uid,
    parentId,
    title: name,
    isFolder: false,
    body: ''
  });
  route(EDIT_PATH + doc.id);
};

export const treeCreateFolder = async (node, user, tree) => {
  const parentId = node ? node.id : _getNewParentId(tree);
  if (parentId === undefined) return;

  const name = _getNewName(true, 'New Folder');
  if (!name) return;

  firebase.firestore().collection('tree').add({
    userId: user.uid,
    parentId,
    title: name,
    isFolder: true
  });
};

export const treeRenameNode = async (node) => {
  if (!node) return;

  const name = _getNewName(node.isFolder, node.title);
  if (!name) return;

  firebase.firestore().collection('tree').doc(node.id).update({
    title: name
  });
};

export const treeMoveNode = async (node, tree) => {
  if (!node) return;

  const parentId = _getNewParentId(tree);
  if (parentId === undefined) return;

  firebase.firestore().collection('tree').doc(node.id).update({
    parentId
  });
};

export const treeDeleteNode = async (node, user) => {
  if (!node) return;

  const confirmed = window.confirm(`Delete ${node.isFolder ? 'folder and all its contents' : 'note'}?`);
  if (!confirmed) return;

  const deleteRecursive = (docs) => {
    docs.forEach(async (doc) => {
      const id = doc.id;
      doc.ref.delete();
      const childDocs = await firebase.firestore()
        .collection('tree')
        .where('userId', '==', user.uid)
        .where('parentId', '==', id)
        .get();
      deleteRecursive(childDocs);
    });
  };
  const doc = await firebase.firestore().collection('tree').doc(node.id).get();
  deleteRecursive([doc]);
  route(HOME_PATH);
};

const _getNewName = (isFolder, defaultName) => {
  const nodeType = isFolder ? 'folder' : 'note';
  const name = cleanString(window.prompt(`Enter new ${nodeType} name:`, defaultName));
  if (!name) {
    window.alert('Entered an invalid name!');
  }
  return name;
};

const _getNewParentId = (tree) => {
  const getFoldersRecursive = (nodes, level=1) => nodes
    .map(({ id, title, children }) => {
      const childFolders = children
        ? getFoldersRecursive(children.filter((childNode) => childNode.isFolder), level + 1)
        : [];
      childFolders.splice(0, 0, {id, title, level});
      return childFolders;
    })
    .reduce((acc, folders) => acc.concat(folders), []);

  const nodeTree = treeBuild(tree);
  const folders = getFoldersRecursive(nodeTree);
  if (folders.length == 1) return null;

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
  const number = Math.floor(cleanString(window.prompt(`${folderText} Choose folder [${minNumber}-${maxNumber}]:`, '1')));
  const parentId = isNaN(number) || number < minNumber || number > maxNumber
    ? undefined
    : folders[number - 1].id;
  if (parentId === undefined) {
    window.alert('Chosen an invalid folder!');
  }
  return parentId;
};
