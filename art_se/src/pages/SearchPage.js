import React from 'react';
import SearchBar from '../components/SearchBar';
import { observer,inject } from 'mobx-react';

import { useState } from 'react';

import CardColumns from 'react-bootstrap/CardColumns';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import logo from '../resources/images/logo.png';

const SearchPage = inject("pieceStore")(
  observer(({ pieceStore, history }) => {
    pieceStore.clear();
    pieceStore.clearQuery();
    const [query, setQuery] = useState("");
    return (
      <div class="hero_image">
        <Container>
          <Row className="text-center">
            <Col class="align-self-center">
              <img
                width = "120" height="120"
                src={logo}
              />
            </Col>
          </Row>
          <Row className="text-center" style = {{paddingTop: '1em'}}>
            <Col>
              <h2> Art Search </h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <SearchBar
               onChange={e => setQuery(e.target.value)}
               query = {query}
               onSearch={() => {
                  pieceStore.setQuery(query);
                  pieceStore.searchPieces();
                  history.push("/result");
               }}
              />
            </Col>
          </Row>
          <Row className="text-center">
            <Col class="align-self-center">
              <button
                onClick={() => {
                   pieceStore.setQuery(query)
                   pieceStore.searchPieces();
                   history.push("/result");
                }}
                className="btn btn-outline-primary"
                type="button"
                style = {{backgroundColor: "#E8E8E8", color: "black", borderColor:"white", width:"9em", height:"2.2em"}}
              >
              Art search
              </button>
              <button
                onClick={() => {
                  pieceStore.setQuery(query)
                  pieceStore.searchPieces();
                  history.push("/piece");
                }}
                className="btn btn-outline-primary"
                type="button"
                style = {{backgroundColor: "#E8E8E8", color: "black", borderColor:"white", width:"9em", height:"2.2em", marginLeft:"2em"}}
              >
              I'm feelin artsy
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  })
);

export default SearchPage;
