import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Helmet } from 'react-helmet';
import { UnControlled  as CodeMirror } from 'react-codemirror2';

import { TreeContext } from '../../components/context';
import firebase from '../../components/firebase';
import { HOME_PATH } from '../../components/utils';
import style from './style';

require('codemirror/keymap/sublime.js');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/dracula.css');

const Edit = ({ id }) => {
  const tree = useContext(TreeContext);
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [editor, setEditor] = useState();
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    if (!id || !tree) return;

    let found = false;
    tree.forEach((doc) => {
      if (doc.id !== id) return;

      found = true;
      const { title: newTitle, body: newBody } = doc.data();
      setTitle(newTitle);
      setBody((oldBody) => {
        // Update editor if the change comes from another window
        if (oldBody !== newBody) {
          setEditorValue(newBody);
        }
        return newBody;
      })
    });
    if (!found) {
      route(HOME_PATH);
    }
  }, [id, tree]);

  useEffect(() => {
    if (!id || typeof body !== 'string') return;

    const timer = setTimeout(() => {
      firebase.firestore().collection('tree').doc(id).update({body});
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, body]);

  useEffect(() => {
    if (!id || !editor) return;

    editor.focus();
  }, [id, editor]);

  const actionChange = (editor, data, value) => {
    // Ignore if it's a programmatic change
    if (!data.origin) return;

    setBody(value);
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
      </div>
      <CodeMirror
        autoCursor={true}
        autoScroll={true}
        className={style.editor}
        value={editorValue}
        options={{
          autofocus: true,
          keyMap: 'sublime',
          lineNumbers: true,
          tabSize: 2,
          theme: 'dracula'
        }}
        editorDidMount={setEditor}
        onChange={actionChange}
      />
    </div>
  );
};

export default Edit;
