import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import firebase from '../../components/firebase';
import { HOME_PATH, log, route } from '../../components/utils';
import style from './style.module.scss';

const View = ({ id: propId }) => {
  const { id: routeId } = useParams();
  const id = propId || routeId;
  const [note, setNote] = useState();

  useEffect(() => {
    if (!id) return undefined;

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
    <div className={style.view}>
      {note && (
        <div>
          <Helmet>
            <title>{note.title}</title>
          </Helmet>

          <h1>{note.title}</h1>

          {/* eslint-disable-next-line react/no-danger */}
          <div
            className={style.content}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(note.body)) }}
          />
        </div>
      )}
    </div>
  );
};

export default View;
