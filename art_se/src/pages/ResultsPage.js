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
    const init_query = pieceStore.query;
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
              <div style={{padding: "1em 10em 1em 10em", marginRight:"2em"}}>
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
              {pieces.length === 0 && pieceStore.no_results.length === 0 && pieceStore.no_similar.length == 0?
                <div>
                  <span style={{float:'left'}}>
                    <p style={{color:"Gray"}}> Retrieving results </p>
                  </span>
                  <span style={{paddingLeft:".5em"}}>
                    <Ellipsis color = "Gray" size = {24}/>
                  </span>
                </div>:
                <div>
                  {pieceStore.similar.length == 0 ?
                    <div>
                      {pieceStore.no_results.length === 0 ?
                        <p style={{color:"Grey"}}> Retrieved {pieceStore.ids.length} results in {(pieceStore.timeTaken+"").substring(0, 4)} seconds</p>
                        :<div style= {{paddingTop:"1em", paddingLeft:"4em",
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                          <h2 style={{color:"Grey"}}> Art you sure about that? </h2>
                          <p style={{color:"Grey"}}> Your query - <b>{init_query}</b> - did not return any results. <br/> Maybe try again using a different query. </p>
                        </div>
                      }
                    </div> :
                    <div>
                      {pieceStore.no_similar.length === 1 &&
                        <div style= {{paddingTop:"1em", paddingLeft:"4em",
                        alignItems: 'center',
                        justifyContent: 'center'}}>
                          <h2 style={{color:"Grey"}}> Sorry, there are no similar works for this piece! </h2>
                            <p style={{color:"Grey"}}> It seems there are no similar works to show for this piece but feel free to keep exploring other works! </p>
                        </div>
                      }
                    </div>}
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
          <Ring color = "gray" size = {35} style={{marginBottom:"2em"}}/>
        }
        </div>
        {pieceStore.similar.length === 0 &&
          <BottomScrollListener onBottom={() => pieceStore.loadMore()} />
        }
      </div>
    );
  })
);

export default ResultsPage;
