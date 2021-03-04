import React from 'react';
import SearchBar from '../components/SearchBar';
import { observer,inject } from 'mobx-react';

import { useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';

import logo from '../resources/images/logo.png';

const SearchPage = inject("pieceStore")(
  observer(({ pieceStore, history }) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    pieceStore.clear();
    pieceStore.clearQuery();
    return (
      <div className="hero_image">
        <Container>
          <Row className="text-center">
            <Col class="align-self-center">
              <img
                width = "120" height="120"
                alt="logo"
                src={logo}
              />
            </Col>
          </Row>
          <Row className="text-center" style = {{paddingTop: '1em'}}>
            <Col>
              <h2> Art Search </h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <SearchBar
               onChange={e => setQuery(e.target.value)}
               query = {query}
               onSearch={(e) => {if (query !== "" ){
                  pieceStore.setQuery(query);
                  pieceStore.searchPieces();
                  history.push("/result");
                }
              }}
              />
            </Col>
          </Row>

          <Row className="text-center">
            <Col class="align-self-center">
              <button
                onClick={() => {if (query !== ""){
                   pieceStore.setQuery(query)
                   pieceStore.searchPieces();
                   history.push("/result");
                 }
                }}
                className="btn btn-outline-primary"
                type="button"
                style = {{backgroundColor: "#E8E8E8", color: "black", borderColor:"white", width:"9em", height:"2.2em"}}
              >
              Art search
              </button>
              <button
                onClick={() => {if (query !== ""){
                  pieceStore.setQuery(query)
                  pieceStore.feelingArtsy();
                  history.push("/piece");
                }
                }}
                className="btn btn-outline-primary"
                type="button"
                style = {{backgroundColor: "#E8E8E8", color: "black", borderColor:"white", width:"9em", height:"2.2em", marginLeft:"2em"}}
              >
              I'm feelin artsy
              </button>
            </Col>
          </Row>

          <Row className="text-center" style = {{paddingTop:"1em"}}>
            <Col class="align-self-center">
              <p
                style = {{fontSize: "10%"}}
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
                style = {{cursor:'pointer', color:"Gray"}}
              >
                Advanced Search
              </p>
              <Collapse in={open}>
              <Form style = {{paddingLeft:"20%", paddingRight:"20%"}} >
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail" >
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="email" placeholder="Enter title" />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Artist</Form.Label>
                    <Form.Control type="password" placeholder="Enter artist" />
                  </Form.Group>
                </Form.Row>
                </Form>
              </Collapse>
            </Col>
          </Row>
        </Container>
      </div>
    );
  })
);

export default SearchPage;
