import React from 'react'
import { observer } from 'mobx-react'

import Card from 'react-bootstrap/Card';

const PieceList = observer(({ piece, onSelect }) => (
  <Card tag="a" onClick={onSelect} style={{ cursor: "pointer" }}>
    <Card.Img variant="top" src={piece.image} />
    <Card.Body>
      <Card.Title>{piece.title}</Card.Title>
      <Card.Text>
        {piece.artist}
        {piece.type}
      </Card.Text>
    </Card.Body>
  </Card>
));

export default PieceList;
