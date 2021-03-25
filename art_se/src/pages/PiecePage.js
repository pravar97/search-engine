import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';

import NavigBar from '../components/NavigBar';
import PieceCard from '../components/PieceCard';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Masonry from 'react-masonry-css'

import { Ellipsis } from 'react-spinners-css';

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
  value != null && <h6> {tag}: <span style = {{color:"Gray"}}> {value}  </span> </h6>
)

const breakpointColumnsObj = {
  default: 4,
  1800: 4,
  1100: 3,
  900: 3,
  600: 2,
  300: 1
}

const PiecePage = inject("pieceStore")(
  observer(({ pieceStore, history}) => {

    const pieceArr = pieceStore.pieceArr
    const piece = pieceStore.selectedPiece
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(pieceStore.query);
    const ind = piece != null ? (piece.description != null ? 0.3*piece.description.length : -1) : -1
    //var description = piece.description.substring(0,0.3*piece.description.length) + "...";
    return (
      <div>
        <Container fluid style = {{marginBottom: "-1em"}}>
            <Row>
              <Col xs={0.05} style={{padding: "1.3em 0em 0em 1em"}}>
                <img style = {{cursor:'pointer'}} width = "30" height="30" alt="back_arrow"
                  onClick = {() => pieceStore.lucky ? history.push("/") : history.push("/result")}
                  src="https://www.materialui.co/materialIcons/navigation/arrow_back_black_192x192.png"
                />
              </Col>
              <Col>
                <NavigBar
                  onChange={e => setQuery(e.target.value)}
                  getQuery = {query}
                  onSearch={() => {if (query !== ""){
                     pieceStore.clear();
                     pieceStore.setQuery(query);
                     pieceStore.searchPieces();
                     history.push("/result");
                   }
                  }}
                  onClick={() => history.push("/")}
                />
              </Col>
            </Row>
          </Container>
          <ColoredLine color = "LightGrey"/>
          {pieceArr.length === 0 && pieceStore.no_results.length === 0 ?
            <div style={{paddingLeft:"10%"}}>
              <span style={{float:'left'}}>
                <p style={{color:"Gray"}}> Retrieving piece </p>
              </span>
              <span style={{paddingLeft:".5em"}}>
                <Ellipsis color = "Gray" size = {24}/>
              </span>
            </div>
            :
            <div style={{paddingLeft:"10%"}}>
              {pieceStore.no_results.length === 1 &&
                <div style= {{paddingTop:"1em", paddingLeft:"4em",
                alignItems: 'center',
                justifyContent: 'center'}}>
                  <h2 style={{color:"Grey"}}> Art you sure about that? </h2>
                  <p style={{color:"Grey"}}> Your query - <b>{query}</b> - did not return any results. <br/> Maybe try again using a different query. </p>
                </div>
              }
            </div>
          }
          {pieceArr.length > 0 &&
          <Container style={{paddingTop: "0.7em", paddingLeft: "5%", paddingRight: "5%"}}>
            <Row className="justify-content-center">
              <Image src={piece.image} height="300em"/>
            </Row>
            <Row style={{padding: "2em 0 0.6em 0"}}>
              <Col>
                <h3> {piece.title} </h3>
                <h5 style = {{color:"Gray"}}>
                  {piece.author.length > 1 && piece.author + ", "} {piece.date.length > 1 && piece.date}
                </h5>
                <ColoredLine color="LightGrey" />
              </Col>
            </Row>
            <Row>
              <Col>
                <h4 style={{}}> Details </h4>
                <DescriptionText tag={"Form"} value={piece.form} />
                <DescriptionText tag={"Medium"} value={piece.medium} />
                <DescriptionText tag={"Dimensions"} value={piece.dimensions} />
                <DescriptionText tag={"Timeframe"} value={piece.timeframe} />
                <DescriptionText tag={"School"} value={piece.school} />
                <DescriptionText tag={"Repository"} value={piece.repository} />
                <h6> Source: <span style = {{color:"Gray"}}> <a href={piece.source_url}>{piece.source.toUpperCase()}</a>  </span> </h6>

              </Col>
              {piece.description &&
                <Col>
                  <h4> About the piece </h4>
                  <p style={{display:"inline"}}>
                    {piece.description.substring(0,ind)
                      + (open ? piece.description.substring(ind, piece.description.length) : "...")}
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
            <Row style = {{paddingTop:"1em"}}>
              {pieceStore.artist_pieces.length > 0 &&
              <Col>
                <h3>More by {piece.author}</h3>
              </Col>
              }
            </Row>
            {pieceStore.artist_pieces.length > 0 &&
            <Row style={{ paddingBottom: "1em", paddingTop:"1em"}}>
              <Col style={{paddingTop: "0em"}}>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                  {pieceStore.artist_pieces.map(piece => {
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
            }
          </Container>
        }
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
