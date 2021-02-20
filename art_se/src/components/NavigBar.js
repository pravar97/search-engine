import React from 'react'
import { observer } from 'mobx-react'

import SearchBar from './SearchBar'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import logo from '../resources/images/logo.png';

const NavigBar = observer(({ onSearch, onChange, getQuery, onClick }) => (
  <Container fluid>
    <Row>
      <Col>
        <img
          style = {{cursor:'pointer', marginTop:'0.4em'}}
          width="50"
          onClick={onClick}
          src={logo}
        />
      </Col>
      <Col xs={10}>
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
