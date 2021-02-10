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

  @action clear() {
    this.rootStore.pieceStore.clear();
  }

  @action clearQuery() {
    this.query = "";
  }

  @action getPieces() {
    return this.rootStore.pieceStore.pieces;
  }

  @action getArtistPieces() {
    return this.rootStore.pieceStore.artist_pieces;
  }

  @action getQuery() {
    return this.query;
  }

  @action selectPiece(piece) {
    this.rootStore.pieceStore.getArtistPieces(piece.author_no_format);
    this.rootStore.pieceStore.selectedPiece = piece;
  }

  @action searchPieces() {
    if(this.query != ""){
      this.rootStore.pieceStore.searchPiece(this.query);
    }
  }
}
