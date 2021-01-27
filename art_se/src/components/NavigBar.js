import React from 'react'
import { observer } from 'mobx-react'

import SearchBar from './SearchBar'

import NavBar from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const NavigBar = observer(({ onSearch, onChange, getQuery, onClick }) => (
  <Container fluid>
    <Row>
      <Col>
        <h2
          style={{padding: "0.5em 0.3em 0em 2em"}}
          role="button"
          onClick={onClick}
        >
          LOGO
        </h2>
      </Col>
      <Col xs={9}>
        <div>
          <SearchBar
           onChange={onChange}
           query = {getQuery}
           onSearch={onSearch}
          />
        </div>
      </Col>
      <Col/>
    </Row>
  </Container>
));

export default NavigBar;
