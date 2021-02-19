import PieceCard from '../components/PieceCard';
import NavigBar from '../components/NavigBar';
import { observer,inject } from 'mobx-react';

import { useState } from 'react';

import { Ellipsis, Ring } from 'react-spinners-css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import CardColumns from 'react-bootstrap/CardColumns';
import Button from 'react-bootstrap/Button';

import {BottomScrollListener} from 'react-bottom-scroll-listener';

const ColoredLine = ({ color }) => (
    <hr fluid="true"
        style={{
            color: color,
            backgroundColor: color,
            height: 0.01
        }}
    />
);


const ResultsPage = inject("pieceStore")(
  observer(({ pieceStore, history}) => {
    const pieces = pieceStore.pieces;
    const [query, setQuery] = useState(pieceStore.query);
    return (
      <div>
        <div style={{padding: "0 0em 0em 1em", marginBottom: "-1em"}}>
          <NavigBar
            onChange={e => setQuery(e.target.value)}
            getQuery = {query}
            onSearch={() => {
               pieceStore.clear();
               pieceStore.setQuery(query);
               pieceStore.searchPieces();
               history.push("/result");
            }}
            onClick={() => history.push("/")}
          />
        </div>
        <ColoredLine color = "LightGrey" />
        <Container fluid style={{padding: "0 10% 0em 10%"}}>
          <Row>
            <Col>
              {pieces.length == 0 ?
                <div>
                  <span style={{float:'left'}}>
                    <h6 style={{color:"gray"}}> Retrieving results </h6>
                  </span>
                  <span style={{paddingLeft:".5em"}}>
                    <Ellipsis color = "gray" size = {24}/>
                  </span>
                </div>:
                <h6 style={{color:"LightGrey"}}> Retrieved {pieceStore.ids.length} results in {(pieceStore.timeTaken+"").substring(0, 4)} seconds</h6>
              }
            </Col>
          </Row>
          <Row style={{paddingBottom: "1em"}}>
            <Col>
            <CardColumns>
              { pieces.map(piece => {
                  if (piece) {
                    return (
                      <PieceCard
                        piece = {piece}
                        onSelect = {() => {
                          pieceStore.selectPiece(piece);
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {pieces.length != pieceStore.ids.length &&
          <Ring color = "gray" size = {35}/>
        }
        </div>
        <BottomScrollListener onBottom={() => pieceStore.loadMore()} />;
      </div>
    );
  })
);

export default ResultsPage;
