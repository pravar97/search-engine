import PieceStore from './PieceStore';

class RootStore {
  constructor() {
    this.pieceStore = new PieceStore(this);
  }
}

export default RootStore;
