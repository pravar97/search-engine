import PieceStore from './PieceStore';

class RootStore {
  constructor() {
    this.pieceStore = new PieceStore();
  }
}

export default RootStore;
