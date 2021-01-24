import { observable, action, computed } from "mobx";

export default class SearchStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable query = "";

  @action setQuery(query) {
    this.query = query;
  }

  @action getPieces() {
    return this.rootStore.pieceStore.pieces;
  }

  @action getQuery() {
    return this.query;
  }

  @action selectPiece(piece) {
    this.rootStore.pieceStore.selectedPiece = piece;
  }

  @action searchPieces() {
    if(this.query != ""){
      this.rootStore.pieceStore.searchPiece(this.query);
    }
  }

  @action clearQuery() {
    this.query = "";
  }
}
