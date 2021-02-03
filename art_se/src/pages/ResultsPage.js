import PieceCard from '../components/PieceCard';
import NavigBar from '../components/NavigBar';
import { observer,inject } from 'mobx-react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';

const ResultsPage = inject("searchStore")(
  observer(({ searchStore, history}) => {
    const pieces = searchStore.getPieces();
    return (
      <div>
        <div style={{padding: "0 0em 0em 1em"}}>
          <NavigBar
            onChange={e => searchStore.setQuery(e.target.value)}
            getQuery = {searchStore.getQuery()}
            onSearch={() => {
               searchStore.searchPieces();
               history.push("/results");
            }}
            onClick={() => history.push("/")}
          />
        </div>
        <Container fluid style={{padding: "0 10% 0em 10%"}}>
          <Row>
            <Col>
              <h6 style={{color:"gray"}}> Retrieved {pieces.length} results </h6>
            </Col>
          </Row>
          <Row>
            <Col>
            <CardColumns>
              { pieces.map(piece => {
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
            </Col>
          </Row>
        </Container>
      </div>
    );
  })
);

export default ResultsPage;
