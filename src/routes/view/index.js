import { createRef, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Helmet } from 'react-helmet';
import marked from 'marked';

import firebase from '../../components/firebase';
import { DOWNLOAD_PATH } from '../../components/utils';
import style from './style';

const View = ({ id }) => {
  const [node, setNode] = useState();

  const downloadFormRef = createRef();
  const downloadBodyRef = createRef();

  useEffect(() => {
    if (!id) return null;
    const unsubscribe = firebase.firestore().collection('tree').doc(id).onSnapshot((doc) => {
      setNode(doc.data());
    });
    return unsubscribe;
  }, [id]);

  const actionDownload = async () => {
    downloadBodyRef.current.value = marked(node.body);
    downloadFormRef.current.submit();
  };

  return (
    <div class={style.view}>
      {
        node
        && <div>
          <Helmet>
            <title>{node.title}</title>
          </Helmet>

          <h1>{node.title}</h1>
          <button class={style.button} onClick={actionDownload}>Download</button>

          {/* eslint-disable-next-line react/no-danger */}
          <div class={style.content} dangerouslySetInnerHTML={{__html: marked(node.body)}} />

          <form class={style.hidden} action={DOWNLOAD_PATH} method="POST" ref={downloadFormRef}>
            <input name="title" value={node.title} />
            <input name="markdown" ref={downloadBodyRef} />
          </form>
        </div>
      }
    </div>
  );
};

export default View;
