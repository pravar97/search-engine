import React from 'react';
import SearchBar from '../components/SearchBar';
import PieceCard from '../components/PieceCard';
import { observer,inject } from 'mobx-react';

import CardColumns from 'react-bootstrap/CardColumns'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ResultsPage = inject("searchStore")(
  observer(({ searchStore, history}) => {

    return (
      <Row>
        <Col>
          <h2
            style={{padding: "0.4em 0 1em 0.5em"}}
            role="button"
            onClick={() => history.push("/")}
          >
            LOGO
          </h2>
        </Col>
        <Col xs={9}>
          <div>
            <SearchBar
             onChange={e => searchStore.setQuery(e.target.value)}
             query = {searchStore.getQuery()}
             onSearch={() => {
                searchStore.searchPieces();
                history.push("/results");
             }}
            />
          </div>
          <div className="d-flex flex-wrap justify-content-center">
            <CardColumns>
              { searchStore.getPieces().map(piece => {
                  if (piece) {
                    return (
                      <PieceCard
                        piece = {piece}
                        onSelect = {() => {
                          searchStore.selectPiece(piece);
                          history.push("/piece");
                        }}
                      />
                   )
                 }
                 return null
              }) }
            </CardColumns>
          </div>
        </Col>
        <Col/>
      </Row>
    );
  })
);

export default ResultsPage;
