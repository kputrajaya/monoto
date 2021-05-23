import { createRef, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Helmet } from 'react-helmet';
import marked from 'marked';

import firebase from '../../components/firebase';
import { DOWNLOAD_PATH, HOME_PATH, log } from '../../components/utils';
import style from './style';

const View = ({ id }) => {
  const [note, setNote] = useState();

  const downloadFormRef = createRef();

  useEffect(() => {
    if (!id) return null;
    const unsubscribe = firebase.firestore().collection('tree').doc(id).onSnapshot(
      (doc) => {
        setNote(doc.data());
      },
      (err) => {
        log('Document not found', err);
        route(HOME_PATH);
      },
    );
    return unsubscribe;
  }, [id]);

  const actionDownload = async () => {
    downloadFormRef.current.submit();
  };

  return (
    <div class={style.view}>
      {
        note
        && <div>
          <Helmet>
            <title>{note.title}</title>
          </Helmet>

          <h1>{note.title}</h1>
          <button class={style.button} onClick={actionDownload}>Download</button>

          {/* eslint-disable-next-line react/no-danger */}
          <div class={style.content} dangerouslySetInnerHTML={{__html: marked(note.body)}} />

          <form class={style.hidden} action={DOWNLOAD_PATH} method="POST" ref={downloadFormRef}>
            <input name="title" value={note.title} />
            <textarea name="markdown" value={note.body} />
          </form>
        </div>
      }
    </div>
  );
};

export default View;
