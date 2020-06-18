import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Helmet } from 'react-helmet';
import { UnControlled  as CodeMirror } from 'react-codemirror2';

import { QueryContext } from '../../components/context';
import firebase from '../../components/firebase';
import style from './style';

require('codemirror/keymap/sublime.js');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/dracula.css');

const Edit = ({ id }) => {
  const query = useContext(QueryContext);
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [editorValue, setEditorValue] = useState('');

  useEffect(() => {
    if (!id || !query) return;

    query.forEach((doc) => {
      if (doc.id !== id) return;

      const data = doc.data();
      setTitle(data.title);
      setBody((oldBody) => {
        // Update editor if the change comes from another window
        if (oldBody !== data.body) {
          setEditorValue(data.body);
        }
        return data.body;
      })
    });
  }, [id, query]);

  useEffect(() => {
    if (!id || body === null) return;

    const timer = setTimeout(() => {
      firebase.firestore().collection('tree').doc(id).update({body});
    }, 1000);

    return () => clearTimeout(timer);
  }, [id, body]);

  const actionChange = (editor, data, value) => {
    // Ignore if it's a programmatic change
    if (!data.origin) return;

    setBody(value);
  };

  return (
    <div class={style.edit}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

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
        onChange={actionChange}
      />
    </div>
  );
};

export default Edit;
