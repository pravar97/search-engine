import PieceCard from '../components/PieceCard';
import NavigBar from '../components/NavigBar';
import { observer,inject } from 'mobx-react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';

const ResultsPage = inject("searchStore")(
  observer(({ searchStore, history}) => {

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
        <Container fluid style={{padding: "0 8% 0 8%"}}>
          <Row>
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
          </Row>
        </Container>
      </div>
    );
  })
);

export default ResultsPage;
