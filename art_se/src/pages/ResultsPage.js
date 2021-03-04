import PieceCard from '../components/PieceCard';
import { observer,inject } from 'mobx-react';
import Masonry from 'react-masonry-css'
import Form from 'react-bootstrap/Form';
import logo from '../resources/images/logo.png';


import { useState } from 'react';

import { Ellipsis, Ring } from 'react-spinners-css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
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

const breakpointColumnsObj = {
  default: 4,
  1800: 5,
  1100: 4,
  900: 3,
  600: 2,
  300: 1
};


const ResultsPage = inject("pieceStore")(
  observer(({ pieceStore, history}) => {
    const [query, setQuery] = useState(pieceStore.query);
    const pieces = pieceStore.pieces;
    pieceStore.clearSelectedPiece();
    return (
      <div>
        <Container fluid style = {{marginBottom: "-1em"}}>
          <Row>
            <Col>
              <img
                style = {{cursor:'pointer', marginTop:'0.4em'}}
                width="50"
                alt=""
                onClick={() => history.push("/")}
                src={logo}
              />
            </Col>
            <Col xs={10}>
              <div style={{padding: "1em 5em 1em 5em", marginRight:"2em"}}>
                <Form className = "form-custom">
                  <Form.Control
                   style={{borderRadius: '100px', paddingLeft:'1.2em'}}
                   //style = {{background: "#fbfbfb"}}
                   type="text"
                   key="random1"
                   value={query}
                   placeholder={query !== "" ? "": "Search"}
                   onChange={e => setQuery(e.target.value)}
                   onKeyPress={event => {
                     if(query !== "" && event.key === "Enter") {
                        event.preventDefault()
                        pieceStore.clear()
                        pieceStore.setQuery(query);
                        pieceStore.searchPieces();
                       }
                     }}
                  />
                </Form>
              </div>
            </Col>
            <Col/>
          </Row>
        </Container>
        <ColoredLine color = "LightGrey" />
        <Container fluid style={{padding: "0 10% 0em 10%"}}>
          <Row>
            <Col>
              {pieces.length === 0 && pieceStore.no_results.length === 0 ?
                <div>
                  <span style={{float:'left'}}>
                    <p style={{color:"Gray"}}> Retrieving results </p>
                  </span>
                  <span style={{paddingLeft:".5em"}}>
                    <Ellipsis color = "Gray" size = {24}/>
                  </span>
                </div>:
                <div>
                  {pieceStore.no_results.length === 0 ?
                    <p style={{color:"Grey"}}> Retrieved {pieceStore.ids.length} results in {(pieceStore.timeTaken+"").substring(0, 4)} seconds</p>
                    :<p style={{color:"Grey"}}> No Results </p>
                  }
                </div>
                }
            </Col>
          </Row>
          <Row style={{paddingBottom: "1em"}}>
            <Col>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
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
              </Masonry>
            </Col>
          </Row>

        </Container>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {pieces.length !== 0 && pieces.length !== pieceStore.ids.length &&
          <Ring color = "gray" size = {35}/>
        }
        </div>
        <BottomScrollListener onBottom={() => pieceStore.loadMore()} />;
      </div>
    );
  })
);

export default ResultsPage;
