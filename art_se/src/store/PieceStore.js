import { observable, action, computed } from "mobx";

export class Piece {
  @observable title = [];
  @observable artist;
  @observable type;
  @observable image;

  constructor (title, artist, type, image) {
    this.title = title;
    this.artist = artist;
    this.type = type;
    this.image = image;
  }
}

export default class PieceStore {

  @observable selectedPiece = observable();
  @observable pieces = observable.array();

  @action searchPiece(query) {
    console.log("making request")
    fetch('/result')
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json =>
      console.log(json)
      //this.pieces.replace(new Piece(json[0], "test", "test", "https://news.artnet.com/app/news-upload/2018/04/pablopicasso18811973lemarin1943.jpg"));
      )

//    const p = new Piece(query, "Picasso", "Painting", "https://news.artnet.com/app/news-upload/2018/04/pablopicasso18811973lemarin1943.jpg");
//    const p2 = new Piece(query, "Picasso", "Painting", "https://static01.nyt.com/images/2018/03/02/arts/design/02picasso-print/01picasso1-superJumbo.jpg");
//    const pie = observable([p, p2]);
//    this.pieces.replace(pie);
  }

  @action getSelectedPiece() {
    return this.selectedPiece;
  }
}
