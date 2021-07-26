import { Fragment, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Helmet } from 'react-helmet';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import { TreeContext } from '../../components/context';
import firebase from '../../components/firebase';
import Svg from '../../components/svgr/svg-loaders-dot';
import {
  EDIT_DEBOUNCE_DURATION,
  hashNote,
  HOME_PATH,
  log,
  treeLinkNode,
  treePublicNode,
  VIEW_PATH,
} from '../../components/utils';
import style from './style';

require('codemirror/keymap/sublime.js');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/markdown/markdown');
require('codemirror/theme/dracula.css');

const Edit = ({ id }) => {
  const tree = useContext(TreeContext);
  const [note, setNote] = useState(null);
  const [initialBody, setInitialBody] = useState(null);
  const [editedBody, setEditedBody] = useState(null);
  const [syncingFlag, setSyncingFlag] = useState(false);
  const [syncingHash, setSyncingHash] = useState(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    log('Resetting');
    setNote(null);
    setInitialBody(null);
    setEditedBody(null);
    setSyncingFlag(false);
    setSyncingHash(null);
  }, [id]);

  useEffect(() => {
    if (!id || !tree) return;

    const newNode = tree.find((node) => node.id === id);
    if (!newNode) {
      log('Document not found');
      route(HOME_PATH);
      return;
    }

    const newNote = { id, ...newNode.data() };
    const newHash = hashNote(id, newNote.body);
    log('Received', newHash);
    setNote(newNote);

    if (newHash === syncingHash) {
      log('Not replacing, same hash');
      return;
    }
    if (newNote.body === editedBody) {
      log('Not replacing, same body');
      return;
    }

    log('Replacing content');
    setInitialBody(newNote.body);
    setEditedBody(null);
    setSyncingFlag(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tree]);

  useEffect(() => {
    if (!id || typeof editedBody !== 'string') return null;

    setSyncingFlag(true);
    const timeout = setTimeout(async () => {
      const newHash = hashNote(id, editedBody);
      log('Syncing', newHash);

      setSyncingHash(newHash);
      try {
        await firebase.firestore().collection('tree').doc(id).update({
          body: editedBody,
        });
      } catch (err) {
        log('Error', err);
      }
      setSyncingFlag(false);
    }, EDIT_DEBOUNCE_DURATION);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedBody]);

  useEffect(() => {
    if (!id || !editor) return;

    editor.focus();
  }, [id, editor]);

  const actionChange = (editor, data, value) => {
    // Ignore programmatic change
    if (!data.origin) return;

    setEditedBody(value);
  };

  return (
    <div class={style.edit}>
      {note?.title && (
        <Helmet>
          <title>{note.title}</title>
        </Helmet>
      )}

      <div class={style.control}>
        {note && (
          <Fragment>
            <div class={style.tabs}>
              <div class={style.tab}>
                <div class={style.tabContent}>
                  {note.title}
                  {syncingFlag && <Svg />}
                </div>
              </div>
            </div>
            <div class={style.actions}>
              {note.public && (
                <Fragment>
                  <button type="button" class={style.buttonSecondary} onClick={() => treeLinkNode(note)}>
                    Copy Link
                  </button>
                  <button type="button" class={style.buttonSuccess} onClick={() => treePublicNode(note)}>
                    Make Private
                  </button>
                </Fragment>
              )}
              {!note.public && (
                <button type="button" class={style.buttonDanger} onClick={() => treePublicNode(note)}>
                  Make Public
                </button>
              )}
              <a class={style.buttonPrimary} href={`${VIEW_PATH}${id}`} target="_blank" rel="noreferrer">
                View
              </a>
            </div>
          </Fragment>
        )}
      </div>
      <CodeMirror
        className={style.editor}
        value={initialBody}
        options={{
          autofocus: true,
          lineWrapping: true,
          mode: 'markdown',
          keyMap: 'sublime',
          tabSize: 2,
          theme: 'dracula',
          extraKeys: {
            Tab: (cm) => {
              if (cm.somethingSelected()) {
                cm.indentSelection('add');
              } else {
                cm.replaceSelection('  ', 'end', '+input');
              }
            },
          },
        }}
        cursor={{ line: 0, ch: 0 }}
        autoCursor={true}
        autoScroll={true}
        editorDidMount={setEditor}
        onChange={actionChange}
      />
    </div>
  );
};

export default Edit;
