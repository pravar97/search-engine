import React from 'react';
import SearchBar from '../components/SearchBar';
import { observer,inject } from 'mobx-react';

import CardColumns from 'react-bootstrap/CardColumns';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const SearchPage = inject("searchStore")(
  observer(({ searchStore, history }) => {

    return (
      <Container class="d-flex align-self-center">
        <Row />
        <Row>
          <Col >
            <h1 class="text-center">LOGO</h1>
            <SearchBar
             onChange={e => searchStore.setQuery(e.target.value)}
             query = {searchStore.getQuery()}
             onSearch={() => {
                searchStore.searchPieces();
                history.push("/results");
             }}
            />
          </Col>
        </Row>
        <Row className="text-center">
          <Col class="align-self-center">
            <button
              onClick={() => {
                 searchStore.searchPieces();
                 history.push("/results");
              }}
              className="btn btn-outline-primary"
              type="button"
            >
            Search
            </button>
          </Col>
        </Row>
      </Container>
    );
  })
);

export default SearchPage;
