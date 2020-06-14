import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Col, Container, Hidden, Row, Visible } from 'react-grid-system';

import Sidebar from '../sidebar';
import style from './style';

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const actionToggleSidebar = () => {
    setShowSidebar((oldShowSidebar) => !oldShowSidebar);
  };

  return (
    <Container fluid={true} class={style.container}>
      <Row nogutter={true} class={style.row}>
        <Visible xs sm>
          <Col xs={1} class={style.toggle} onClick={actionToggleSidebar} />
        </Visible>
        <Hidden xs={!showSidebar} sm={!showSidebar}>
          <Col xs={11} md={4} lg={3} xl={2} class={style.sidebar}>
              <Sidebar />
          </Col>
        </Hidden>
        <Hidden xs={showSidebar} sm={showSidebar}>
          <Col xs={11} md={8} lg={9} xl={10} class={style.content}>
            {children}
          </Col>
        </Hidden>
      </Row>
    </Container>
  );
};

export default Layout;
