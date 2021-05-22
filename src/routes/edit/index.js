import { h } from 'preact';
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
  log,
  HOME_PATH,
} from '../../components/utils';
import style from './style';

require('codemirror/keymap/sublime.js');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/markdown/markdown');
require('codemirror/theme/dracula.css');

const Edit = ({ id }) => {
  const tree = useContext(TreeContext);
  const [editor, setEditor] = useState();
  const [title, setTitle] = useState();
  const [editorBody, setEditorBody] = useState();
  const [editedBody, setEditedBody] = useState();

  const [syncing, setSyncing] = useState(false);
  const [syncingHash, setSyncingHash] = useState();

  useEffect(() => {
    log('Resetting');
    setTitle(null);
    setEditorBody(null);
    setEditedBody(null);
    setSyncing(false);
    setSyncingHash(null);
  }, [id]);

  useEffect(() => {
    if (!id || !tree) return;

    let found = false;
    tree.forEach((node) => {
      if (node.id !== id) return;

      found = true;
      const { title: newTitle, body: newBody } = node.data();
      const newBodyHash = hashNote(id, newBody);
      log('Received', newBodyHash);

      setTitle(newTitle);
      setEditedBody((oldEditedBody) => {
        if (newBodyHash === syncingHash) {
          log('Not replacing, same hash');
          return oldEditedBody;
        }
        if (newBody === oldEditedBody) {
          log('Not replacing, same body');
          return oldEditedBody;
        }

        // Only update editorBody on remote changes
        // Timeout allows it to reset to null first, ensuring proper clean up
        log('Replacing content');
        setTimeout(() => setEditorBody(newBody), 0);
        return null;
      });
    });
    if (!found) {
      route(HOME_PATH);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tree]);

  useEffect(() => {
    if (typeof editedBody !== 'string') return null;

    setSyncing(true);

    const timeout = setTimeout(async () => {
      const editedBodyHash = hashNote(id, editedBody);
      log('Syncing', editedBodyHash);

      setSyncingHash(editedBodyHash);
      try {
        await firebase.firestore().collection('tree').doc(id).update({
          body: editedBody,
        });
      } catch {
        // TODO: Handle update errors
      }
      setSyncing(false);
    }, EDIT_DEBOUNCE_DURATION);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedBody]);

  useEffect(() => {
    if (!id || !editor) return;

    editor.focus();
  }, [id, editor]);

  const actionChange = (editor, data, value) => {
    // Ignore if it's a programmatic change
    if (!data.origin) return;

    setEditedBody(value);
  };

  return (
    <div class={style.edit}>
      {
        title
        && <Helmet>
          <title>{title}</title>
        </Helmet>
      }

      <div class={style.control}>
        {
          title
          && <div class={style.tab}>
            {title}
            {syncing && <Svg />}
          </div>
        }
        <div class={style.actions}>
          <a class={style.button} href={`/v/${id}`} target="_blank" rel="noreferrer">View</a>
        </div>
      </div>
      <CodeMirror
        className={style.editor}
        value={editorBody}
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
        cursor={{line: 0, ch: 0}}
        autoCursor={true}
        autoScroll={true}
        editorDidMount={setEditor}
        onChange={actionChange}
      />
    </div>
  );
};

export default Edit;
