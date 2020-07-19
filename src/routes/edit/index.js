import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { useHotkeys } from 'react-hotkeys-hook';
import { Helmet } from 'react-helmet';
import { UnControlled  as CodeMirror } from 'react-codemirror2';
import marked from 'marked';

import { TreeContext } from '../../components/context';
import firebase from '../../components/firebase';
import { hashString, HOME_PATH } from '../../components/utils';
import style from './style';

require('codemirror/keymap/sublime.js');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/markdown/markdown');
require('codemirror/theme/dracula.css');

const Edit = ({ id }) => {
  const tree = useContext(TreeContext);
  const [title, setTitle] = useState();
  const [editor, setEditor] = useState();
  const [editorBody, setEditorBody] = useState();
  const [editedBody, setEditedBody] = useState();
  const [htmlContent, setHtmlContent] = useState();
  const [syncingHash, setSyncingHash] = useState();

  useEffect(() => {
    console.debug('Resetting');
    setTitle(null);
    setEditorBody(null);
    setEditedBody(null);
    setHtmlContent(null);
    setSyncingHash(null);
  }, [id]);

  useEffect(() => {
    if (!id || !tree) return;

    let found = false;
    tree.forEach((doc) => {
      if (doc.id !== id) return;

      found = true;
      const { title: newTitle, body: newBody } = doc.data();
      const newBodyHash = hashString(newBody);
      console.debug('Received', newBodyHash);

      setTitle(newTitle);
      setEditedBody((oldBody) => {
        if (newBodyHash === syncingHash) {
          console.debug('Not replacing, same hash');
          return newBody;
        }
        if (newBody === oldBody) {
          console.debug('Not replacing, same body');
          return newBody;
        }

        // Only update editor on remote changes, add 0 timeout for proper "reset"
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
    if (!id | !editor) return;

    editor.focus();
  }, [id, editor]);

  useEffect(() => {
    if (!id || typeof editedBody !== 'string') return;

    const timer = setTimeout(() => {
      const editedBodyHash = hashString(editedBody);
      console.debug('Syncing', editedBodyHash);

      setSyncingHash(editedBodyHash);
      firebase.firestore().collection('tree').doc(id).update({
        body: editedBody
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, editedBody]);

  useHotkeys('esc', () => setHtmlContent(null), {}, []);

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
          </div>
        }
        <div class={style.actions}>
          <button class={htmlContent ? style.buttonSecondary : style.buttonPrimary} onClick={actionPreview}>
            {htmlContent ? 'Close' : 'Preview'}
          </button>
        </div>
      </div>
      <CodeMirror
        autoCursor={true}
        autoScroll={true}
        className={style.editor}
        value={editorBody}
        options={{
          autofocus: true,
          mode: 'markdown',
          keyMap: 'sublime',
          tabSize: 2,
          theme: 'dracula'
        }}
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
