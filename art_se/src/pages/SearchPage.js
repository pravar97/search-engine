import React from 'react';
import SearchBar from '../components/SearchBar';
import { observer,inject } from 'mobx-react';

import CardColumns from 'react-bootstrap/CardColumns';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import logo from '../resources/images/logo.png';

const SearchPage = inject("searchStore")(
  observer(({ searchStore, history }) => {
    searchStore.clearQuery();
    searchStore.clear();
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
               onChange={e => searchStore.setQuery(e.target.value)}
               query = {searchStore.getQuery()}
               onSearch={() => {
                  searchStore.searchPieces();
                  history.push("/result");
               }}
              />
            </Col>
          </Row>
          <Row className="text-center">
            <Col class="align-self-center">
              <button
                onClick={() => {
                   searchStore.searchPieces();
                   history.push("/result");
                }}
                className="btn btn-outline-primary"
                type="button"
                style = {{backgroundColor: "steelblue", color: "white", borderColor:"white"}}
              >
              Search
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  })
);

export default SearchPage;
