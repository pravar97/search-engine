import React from 'react';
import { observer,inject } from 'mobx-react';

const PiecePage = inject("pieceStore")(
  observer(({ pieceStore, history }) => {
    const piece = pieceStore.getSelectedPiece();
    return (
      <div>
        <button onClick = {() => history.push("/results")}>
          Back
        </button>
        <img src = {piece.image} alt="image"/>
        <h2> {piece.title} </h2>
      </div>
    );
  })
);

export default PiecePage;
