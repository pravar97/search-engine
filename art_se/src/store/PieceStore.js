import { observable, action, computed } from "mobx";

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function printText(txt) {
  if (txt == undefined) {
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

  constructor (author,title,date,timeframe,technique,location,description,form,school, image) {
    this.author = printText(author.split(',')[1]) + " " + printText(author.split(',')[0].toProperCase());
    this.author_no_format = author;
    this.title = title;
    this.date = date;
    this.timeframe = timeframe;
    this.technique = technique;
    this.location = location;
    this.description = description;
    this.form = form;
    this.school = school;
    this.image = image;
  }
}

export default class PieceStore {

  @observable selectedPiece = observable();
  @observable pieces = observable.array();
  @observable artist_pieces = observable.array();

  @action clear() {
    this.pieces = observable.array();
  }

  @action searchPiece(query) {
    console.log("making request")
    fetch('/result?q=' + query)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => this.addPieces(json, this.pieces))
  }

  @action getArtistPieces(artist) {
    console.log("making request")
    fetch('https://ttds-group-1-project.nw.r.appspot.com/artist?artist=' + artist)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => this.addPieces(json, this.artist_pieces))
  }

  @action addPieces(json,array) {
    const pieces = [];
    Object.values(json).forEach((piece) => {
      pieces.push(new Piece(
        piece.AUTHOR,
        piece.TITLE,
        piece.DATE,
        piece.TIMEFRAME,
        piece.TECHNIQUE,
        piece.LOCATION,
        piece.DESCRIPTIONS,
        piece.FORM,
        piece.SCHOOL,
        piece.IMAGE_URL))
    });
    array.replace(pieces)
  }

  @action getSelectedPiece() {
    return this.selectedPiece;
  }
}
