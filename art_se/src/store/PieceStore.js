import { observable, action, computed } from "mobx";


String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function printText(txt) {
  if (txt === undefined) {
    return "";
  } else {
    return txt;
  }
}

export class Piece {

  @observable author
  @observable title
  @observable date
  @observable century
  @observable technique
  @observable size
  @observable location
  @observable description
  @observable form
  @observable school
  @observable image
  @observable source
  @observable source_url

  constructor (author,title,date,technique,description,form,school, image, source, source_url) {
    this.author = printText(author.split(',')[1]) + " " + printText(author.split(',')[0].toProperCase());
    this.author_no_format = author;
    this.title = title;
    this.date = date;
    this.technique = technique;
    this.description = description;
    this.form = form;
    this.school = school;
    this.image = image;
    this.source=source;
    this.source_url = source_url;
  }
}

export default class PieceStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable selectedPiece = observable();
  @observable pieces = observable.array();
  @observable artist_pieces = observable.array();
  @observable pieceArr = observable.array();
  @observable scroll_ind: number = 0;
  @observable ids = observable.array();
  @observable query = "";
  @observable timeTaken = 0;
  @observable lucky = false;

  @action setQuery(query) {
    this.query = query;
  }

  @action clearQuery() {
    this.query = ""
  }

  @action clearSelectedPiece() {
    this.selectedPiece = observable();
    this.artist_pieces = observable.array();
  }


  @action clear() {
    console.log("Clearing pieces")
    this.pieces = observable.array();
    this.artist_pieces = observable.array();
    this.pieceArr = observable.array();
    this.selectedPiece = null;
    this.scroll_ind = 0
    this.timeTaken = null;
    this.ids = observable.array();
    this.lucky = false;
  }

  @action selectPiece(piece) {
    this.getArtistPieces(piece.author_no_format);
    this.pieceArr.push("0")
    console.log(this.artist_pieces)
    this.selectedPiece = piece;
  }

  @action searchPieces() {
    console.log("Searching pieces")
    if(this.query !== ""){
      const time =  performance.now();
      this.searchPiece(this.query);
      this.timeTaken =  performance.now() - time;
    }
  }

  @action searchPiece() {
    console.log("making request for ids")
    fetch('/get_results?q=' + this.query)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => {
        const ids = Object.values(json)
        console.log(json)
        const sliced_ids = ids.slice(this.scroll_ind,this.scroll_ind+12)
        this.scroll_ind = this.scroll_ind + 12;
        this.ids = ids;
        this.getPieces(sliced_ids)
      })
  }

  @action feelingArtsy() {
    this.lucky = true
    console.log("making request for ids")
    fetch('/get_results?q=' + this.query)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => {
        const ids = Object.values(json)
        this.ids = ids;
        this.getLuckyPiece([this.ids[0]])
      })
  }

  @action getLuckyPiece(piece_id){
    console.log("making request for lucky piece")
    fetch('/results2db?r=' + JSON.stringify(piece_id))
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => {
        this.addSelectedPiece(json);
        this.pieceArr.push("0")
      })
  }

  @action loadMore() {
    const sliced_ids = this.ids.slice(this.scroll_ind,this.scroll_ind+12)
    this.scroll_ind = this.scroll_ind + 12;
    this.getPieces(sliced_ids)
  }

  @action getPieces(ids) {
    console.log("making request for pieces")
    fetch('/results2db?r=' + JSON.stringify(ids))
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => this.addPieces(json, this.pieces))
  }

  @action getArtistPieces(artist) {
    console.log("making request")
    fetch('/artist?artist=' + artist)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => this.addPieces(json, this.artist_pieces))
  }

  @action addSelectedPiece(json) {
    console.log(json)
    const pieces = [];
    Object.values(json).forEach((piece) => {
      pieces.push(new Piece(
        piece.author,
        piece.title,
        piece.date,
        piece.medium,
        piece.description,
        piece.form,
        piece.school,
        piece.image_url,
        piece.source,
        piece.source_url,
      ))
    });
    this.selectedPiece = pieces[0];
    this.getArtistPieces(pieces[0].author_no_format);
  }

  @action addPieces(json,array) {
    const pieces = [];
    console.log(  Object.values(json))
    Object.values(json).forEach((piece) => {
      pieces.push(new Piece(
        piece.author,
        piece.title,
        piece.date,
        piece.medium,
        piece.description,
        piece.form,
        piece.school,
        piece.image_url,
        piece.source,
        piece.source_url,
      ))
    });
    array.replace(array.concat(pieces))
  }

  @action getSelectedPiece() {
    return this.selectedPiece;
  }
}

// this.pieces = observable.array();
// this.artist_pieces = observable.array();
// this.pieceArr = observable.array();
// this.selectedPiece = null;
// this.scroll_ind = 0
// this.timeTaken = null;
// this.ids = observable.array();
// this.lucky = false;
