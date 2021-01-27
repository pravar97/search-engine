import { observable, action, computed } from "mobx";

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

  constructor (author,title,date,century,technique,size,location,description,form,school, image) {
    this.author = author;
    this.title = title;
    this.date = date;
    this.century = century;
    this.technique = technique;
    this.size = size;
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


  @action searchPiece(query) {
    const p2 = new Piece(query, "Picasso", "Painting", "https://static01.nyt.com/images/2018/03/02/arts/design/02picasso-print/01picasso1-superJumbo.jpg");
    const pie = observable([p2]);
    console.log("making request")
    fetch('/result')
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => this.addPieces(json, query))
  }

  @action addPieces(json, query) {
    const pieces = []
    Object.values(json).forEach((piece) => {
      pieces.push(new Piece(
        piece.author,
        piece.title,
        piece.date,
        piece.century,
        piece.technique,
        piece.size,
        piece.location,
        piece.description,
        piece.form,
        piece.school,
        "https://static01.nyt.com/images/2018/03/02/arts/design/02picasso-print/01picasso1-superJumbo.jpg"))
    });
    this.pieces.replace(pieces)
  }

  @action getSelectedPiece() {
    return this.selectedPiece;
  }
}
