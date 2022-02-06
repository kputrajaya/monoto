import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Helmet } from 'react-helmet';
import marked from 'marked';

import firebase from '../../components/firebase';
import { HOME_PATH, log } from '../../components/utils';
import style from './style';

const View = ({ id }) => {
  const [note, setNote] = useState();

  useEffect(() => {
    if (!id) return null;

    // For unsubscribing
    return firebase
      .firestore()
      .collection('tree')
      .doc(id)
      .onSnapshot(
        (doc) => {
          setNote(doc.data());
        },
        (err) => {
          log('Document not found', err);
          route(HOME_PATH);
        }
      );
  }, [id]);

  return (
    <div class={style.view}>
      {note && (
        <div>
          <Helmet>
            <title>{note.title}</title>
          </Helmet>

          <h1>{note.title}</h1>

          {/* eslint-disable-next-line react/no-danger */}
          <div class={style.content} dangerouslySetInnerHTML={{ __html: marked(note.body) }} />
        </div>
      )}
    </div>
  );
};

export default View;
