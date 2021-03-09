import { observable, action, makeAutoObservable } from "mobx";
import { persistence, StorageAdapter } from 'mobx-persist-store';

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
  @observable medium
  @observable description
  @observable form
  @observable school
  @observable image
  @observable source
  @observable source_url
  @observable repository
  @observable dimensions

  constructor (author,title,date,medium,description,form,school, image, source, source_url, repository, dimensions) {
    this.author = printText(author.split(',')[1]) + " " + printText(author.split(',')[0].toProperCase());
    this.author_no_format = author;
    this.title = title;
    this.date = date;
    this.medium = medium;
    this.description = description;
    this.form = form.toProperCase();
    this.school = school;
    this.image = image;
    this.source=source;
    this.source_url = source_url;
    this.repository = repository;
    this.dimensions = dimensions;
  }
}

function readStore(name) {
  return new Promise((resolve) => {
    const data = localStorage.getItem(name);
    resolve(data);
  });
}

function writeStore(name, content) {
  return new Promise((resolve) => {
    localStorage.setItem(name, content);
    resolve();
  });
}

class PieceStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
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
  @observable no_results = false;

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
    this.no_results =  observable.array();
  }

  @action selectPiece(piece) {
    this.artist_pieces = observable.array();
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

  @action searchPiecesWithQuery(e, query) {
    console.log("Searching pieces")
    this.query = query
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
        const sliced_ids = ids.slice(this.scroll_ind,this.scroll_ind+20)
        this.scroll_ind = this.scroll_ind + 20;
        this.ids = ids;
        console.log(ids)
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
        console.log(json)
        if (json[0] !== null){
          this.addSelectedPiece(json);
          this.pieceArr.push("0")
        }
        else{
          this.no_results.push("1")
        }

      })
  }

  @action loadMore() {
    const sliced_ids = this.ids.slice(this.scroll_ind,this.scroll_ind+20)
    this.scroll_ind = this.scroll_ind + 20;
    this.getPieces(sliced_ids)
  }

  @action getPieces(ids) {
    console.log("making request for pieces")
    fetch('/results2db?r=' + JSON.stringify(ids))
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => {
        this.addPieces(json, this.pieces)
      })
  }

  @action getArtistPieces(artist) {
    console.log("making request for artist pieces")
    fetch('/artist?artist=' + artist)
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => this.addPieces(json, this.artist_pieces))
  }

  @action advancedSearch(title, artist, form) {
    console.log("Doing advanced pieces")
    console.log(form)
    const time =  performance.now();
    this.doAdvancedSearch(title, artist, form);
    this.timeTaken =  performance.now() - time;
  }

  @action doAdvancedSearch(title, artist, form) {
    console.log("making request for advanced search")
    var advanced_query = ""
    if(title !== ""){
      advanced_query += ("?title=" + title)
    }
    if(artist !== ""){
      advanced_query += ("?author=" + artist)
    }
    if(form !== ""){
      advanced_query += ("?form=" + form)
    }
    fetch('/get_advanced_results' + advanced_query)
    .then(response => {
      console.log(response)
      return response.json()
    })
    .then(json => {
      const ids = Object.values(json)
      console.log(json)
      const sliced_ids = ids.slice(this.scroll_ind,this.scroll_ind+20)
      this.scroll_ind = this.scroll_ind + 20;
      this.ids = ids;
      console.log(ids)
      this.getPieces(sliced_ids)
    })
  }

  @action addSelectedPiece(json) {
    console.log("Adding pieces")
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
        piece.repository,
        piece.dimensions
      ))
    });
    this.selectedPiece = pieces[0];
    this.getArtistPieces(pieces[0].author_no_format);
  }

  @action addPieces(json,array) {
    console.log("Adding pieces")
    const pieces = [];
    console.log(json)
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
        piece.repository,
        piece.dimensions
      ))
    });
    if (pieces.length === 0 && this.pieces.length === 0) {
      this.no_results.push("1")
    }
    array.replace(array.concat(pieces))

  }

  @action getSelectedPiece() {
    return this.selectedPiece;
  }
}

export default persistence({
  name: 'PieceStore',
  properties: ['pieces', 'selectedPiece', 'artist_pieces', 'pieceArr', 'ids', 'query', 'timeTaken', 'lucky', 'no_results'],
  adapter: new StorageAdapter({
    read: readStore,
    write: writeStore,
  }),
})(new PieceStore());

// this.pieces = observable.array();
// this.artist_pieces = observable.array();
// this.pieceArr = observable.array();
// this.selectedPiece = null;
// this.scroll_ind = 0
// this.timeTaken = null;
// this.ids = observable.array();
// this.lucky = false;
