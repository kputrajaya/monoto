import { Fragment } from 'react';
import { useState } from 'react';
import { Col, Container, Row, ScreenClassRender } from 'react-grid-system';

import Sidebar from '../sidebar';
import style from './style.module.scss';

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const actionToggleSidebar = () => {
    setShowSidebar((oldShowSidebar) => !oldShowSidebar);
  };

  const renderCols = (screenClass) =>
    screenClass === 'xs' || screenClass === 'sm' ? (
      <Fragment>
        <Col xs={1} className={`${style.toggle} ${showSidebar ? style.open : ''}`} onClick={actionToggleSidebar} />
        <Col xs={11} className={`${style.sidebar} ${showSidebar ? '' : style.hidden}`}>
          <Sidebar hideSidebar={actionToggleSidebar} />
        </Col>
        <Col xs={11} className={`${style.content} ${showSidebar ? style.hidden : ''}`}>
          {children}
        </Col>
      </Fragment>
    ) : (
      <Fragment>
        <Col md={4} lg={3} xl={2} className={style.sidebar}>
          <Sidebar />
        </Col>
        <Col md={8} lg={9} xl={10} className={style.content}>
          {children}
        </Col>
      </Fragment>
    );

  return (
    <Container fluid={true} className={style.container}>
      <Row nogutter={true} className={style.row}>
        <ScreenClassRender render={renderCols} />
      </Row>
    </Container>
  );
};

export default Layout;
