import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { Helmet } from 'react-helmet';
import { Col, Container, Row, ScreenClassRender } from 'react-grid-system';

import Sidebar from '../sidebar';
import style from './style';

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const actionToggleSidebar = () => {
    setShowSidebar((oldShowSidebar) => !oldShowSidebar);
  };

  const renderCols = (screenClass) => (
    screenClass === 'xs' || screenClass === 'sm'
      ? (
        <Fragment>
          <Col xs={1} class={`${style.toggle} ${showSidebar ? style.open : ''}`} onClick={actionToggleSidebar} />
          <Col xs={11} class={`${style.sidebar} ${showSidebar ? '' : style.hidden}`}>
            <Sidebar hideSidebar={actionToggleSidebar} />
          </Col>
          <Col xs={11} class={`${style.content} ${showSidebar ? style.hidden : ''}`}>
            {children}
          </Col>
        </Fragment>
      )
      : (
        <Fragment>
          <Col md={4} lg={3} xl={2} class={style.sidebar}>
            <Sidebar />
          </Col>
          <Col md={8} lg={9} xl={10} class={style.content}>
            {children}
          </Col>
        </Fragment>
      )
  );

  return (
    <Container fluid={true} class={style.container}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Row nogutter={true} class={style.row}>
        <ScreenClassRender render={renderCols} />
      </Row>
    </Container>
  );
};

export default Layout;
