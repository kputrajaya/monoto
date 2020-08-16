import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Helmet } from 'react-helmet';
import { UnControlled  as CodeMirror } from 'react-codemirror2';
import marked from 'marked';

import { TreeContext } from '../../components/context';
import firebase from '../../components/firebase';
import Svg from '../../components/svgr/svg-loaders-dot';
import { EDIT_DEBOUNCE_DURATION, hashNote, HOME_PATH, useShortcut } from '../../components/utils';
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
  const [htmlContent, setHtmlContent] = useState();
  const [syncing, setSyncing] = useState(false);
  const [syncingHash, setSyncingHash] = useState();

  useEffect(() => {
    console.debug('Resetting');
    setTitle(null);
    setEditorBody(null);
    setEditedBody(null);
    setHtmlContent(null);
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
      console.debug('Received', newBodyHash);

      setTitle(newTitle);
      setEditedBody((oldEditedBody) => {
        if (newBodyHash === syncingHash) {
          console.debug('Not replacing, same hash');
          return oldEditedBody;
        }
        if (newBody === oldEditedBody) {
          console.debug('Not replacing, same body');
          return oldEditedBody;
        }

        // Only update editorBody on remote changes
        // Timeout allows it to reset to null first, ensuring proper clean up
        console.debug('Replacing content');
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
    if (typeof editedBody !== 'string') return;

    setSyncing(true);

    const timeout = setTimeout(async () => {
      const editedBodyHash = hashNote(id, editedBody);
      console.debug('Syncing', editedBodyHash);

      setSyncingHash(editedBodyHash);
      try {
        await firebase.firestore().collection('tree').doc(id).update({
          body: editedBody
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
    if (!id | !editor) return;

    editor.focus();
  }, [id, editor]);

  useShortcut('esc', () => setHtmlContent(null), []);

  const actionChange = (editor, data, value) => {
    // Ignore if it's a programmatic change
    if (!data.origin) return;

    setEditedBody(value);
  };

  const actionPreview = () => {
    setHtmlContent((oldHtmlContent) => oldHtmlContent ? null : marked(editedBody || editorBody));
  };

  return (
    <div class={style.edit}>
      {
        title &&
        <Helmet>
          <title>{title}</title>
        </Helmet>
      }

      <div class={style.control}>
        {
          title &&
          <div class={style.tab}>
            {title}
            {syncing && <Svg />}
          </div>
        }
        <div class={style.actions}>
          <button class={htmlContent ? style.buttonSecondary : style.buttonPrimary} onClick={actionPreview}>
            {htmlContent ? 'Close' : 'Preview'}
          </button>
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
          theme: 'dracula'
        }}
        cursor={{line: 0, ch: 0}}
        autoCursor={true}
        autoScroll={true}
        editorDidMount={setEditor}
        onChange={actionChange}
      />
      {
        htmlContent &&
        <div class={style.preview}>
          {/* eslint-disable-next-line react/no-danger */}
          <div class={style.previewContent} dangerouslySetInnerHTML={{__html: htmlContent}} />
        </div>
      }
    </div>
  );
};

export default Edit;
