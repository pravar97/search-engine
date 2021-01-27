import React from 'react';
import { observer,inject } from 'mobx-react';

import NavigBar from '../components/NavigBar';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Jumbotron from 'react-bootstrap/Jumbotron';

const PiecePage = inject("searchStore", "pieceStore")(
  observer(({ searchStore, pieceStore, history}) => {
    const piece = pieceStore.getSelectedPiece();
    return (
      <div>
        <NavigBar
          onChange={e => searchStore.setQuery(e.target.value)}
          getQuery = {searchStore.getQuery()}
          onSearch={() => {
             searchStore.searchPieces();
             history.push("/results");
          }}
          onClick={() => history.push("/")}
        />
        <Container fluid>
          <Row>
            <Col xs={2}>
              <img style = {{cursor:'pointer'}} width = "50" height="50" onClick = {() => history.push("/results")} src="https://www.materialui.co/materialIcons/navigation/arrow_back_black_192x192.png" />
            </Col>
            <Col xs={10}>
              <div class="bg-light" style={{padding: "2em"}}>
                <Row>
                  <Col>
                    <h2> {piece.title} </h2>
                    <h4> {piece.author} </h4>
                    <h5> {piece.form} </h5>
                    <h5> {piece.technique} </h5>
                    <h5> {piece.date} </h5>
                  </Col>
                  <Col>
                    <Image src={piece.image} fluid />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  })
);

export default PiecePage;

//
// <div>
//
//   <img src = {piece.image} alt="image"/>
//   <h2> {piece.title} </h2>
// </div>
