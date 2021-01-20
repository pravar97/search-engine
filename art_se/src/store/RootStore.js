import PieceStore from './PieceStore';
import SearchStore from './SearchStore';

class RootStore {
  constructor() {
    this.pieceStore = new PieceStore();
    this.searchStore = new SearchStore(this);
  }
}

export default RootStore;
