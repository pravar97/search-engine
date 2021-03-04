import React from 'react'
import { observer } from 'mobx-react'

import Card from 'react-bootstrap/Card';

import placeholder from '../resources/images/placeholder.png';

const PieceList = observer(({ piece, onSelect }) => (
  <Card
    bg="light"
    tag="a"
    onClick={onSelect}
    border="light"
    style={{ cursor: "pointer", margin: "0.em 0 0 0"}}
    className="mb-2"
     key= {parseInt(piece.id)}
  >
    <Card.Img variant="top" src={piece.image} onError={(e) => {
     e.target.src = placeholder // some replacement image
    }}
   style={{
    maxHeight: 600,
    }}/>
    <Card.Body>
      <p>{piece.author}</p>
      <h4 style={{fontStyle: 'italic'}}>
        {piece.title.length < 70 ? piece.title : piece.title.substring(0,70) + "..."}
      </h4>
      <p>{piece.date}</p>
    </Card.Body>
  </Card>
));

export default PieceList;
