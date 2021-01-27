import React from 'react'
import { observer } from 'mobx-react'

import Card from 'react-bootstrap/Card';

const PieceList = observer(({ piece, onSelect }) => (
  <Card className = "flex-wrap"
    bg="light"
    tag="a"
    onClick={onSelect}
    border="light"
    style={{ cursor: "pointer", margin: "1em"}}
    className="mb-2"
  >
    <Card.Img variant="top" src={piece.image} />
    <Card.Body>
      <h10>{piece.author}</h10>
      <h4 style={{fontStyle: 'italic'}}>{piece.title}</h4>
      <h12>{piece.date}</h12>
    </Card.Body>
  </Card>
));

export default PieceList;
