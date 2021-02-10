import React, { useState } from 'react';
import { observer,inject } from 'mobx-react';

import NavigBar from '../components/NavigBar';
import PieceCard from '../components/PieceCard';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import CardColumns from 'react-bootstrap/CardColumns';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 0.05
        }}
    />
);

const DescriptionText = ({tag, value}) => (
  <h6> {tag}: <span style = {{color:"Gray"}}> {value}  </span> </h6>
)

const PiecePage = inject("searchStore", "pieceStore")(
  observer(({ searchStore, pieceStore, history}) => {
    const piece = pieceStore.getSelectedPiece();
    const [open, setOpen] = useState(false);
    const ind = piece.description.indexOf('.')
    //var description = piece.description.substring(0,0.3*piece.description.length) + "...";
    return (
      <div>
      <Container fluid>
          <Row>
            <Col xs={0.05} style={{padding: "1.3em 0em 0em 1em"}}>
              <img style = {{cursor:'pointer'}} width = "30" height="30"
                onClick = {() => history.push("/result")}
                src="https://www.materialui.co/materialIcons/navigation/arrow_back_black_192x192.png"
              />
            </Col>
            <Col>
              <NavigBar
                onChange={e => searchStore.setQuery(e.target.value)}
                getQuery = {searchStore.getQuery()}
                onSearch={() => {
                   searchStore.searchPieces();
                   history.push("/result");
                }}
                onClick={() => history.push("/")}
              />
            </Col>
          </Row>
        </Container>
        <Container style={{paddingTop: "0.7em", paddingLeft: "5%", paddingRight: "5%"}}>
          <Row className="justify-content-center">
            <Image src={piece.image} height="400em"/>
          </Row>
          <Row style={{padding: "2em 0 0.6em 0"}}>
            <Col>
              <h3> {piece.title} </h3>
              <h5 style = {{color:"Gray"}}>
                {piece.author + ", " + piece.date}
              </h5>
              <ColoredLine color="LightGrey" />
            </Col>
          </Row>
          <Row>
            <Col>
              <h4 style={{}}> Details </h4>
              <DescriptionText tag={"Medium"} value={piece.form} />
              <DescriptionText tag={"Technique"} value={piece.technique} />
              <DescriptionText tag={"Timeframe"} value={piece.timeframe} />
              <DescriptionText tag={"Location"} value={piece.location} />
              <DescriptionText tag={"School"} value={piece.school} />
            </Col>
            {piece.description &&
              <Col>
                <h4> About the piece </h4>
                <p style={{display:"inline"}}>
                  {piece.description.substring(0,ind)
                    + (open ? piece.description.substring(ind, piece.description.length) : ".")}
                </p>
                <p
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                  style = {{cursor:'pointer', color:"Gray"}}
                >
                  Read {open ? "Less" : "More"}
                </p>
              </Col>
            }
          </Row>
          <Row style={{paddingTop: "2em"}}>
            <Col>
              <h3>More by {piece.author}</h3>
            </Col>
            <Col style={{paddingTop: "0em"}}>
              <CardColumns>
                {searchStore.getArtistPieces(piece.author).map(piece => {
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

export default PiecePage;

//
// <div>
//
//   <img src = {piece.image} alt="image"/>
//   <h2> {piece.title} </h2>
// </div>
