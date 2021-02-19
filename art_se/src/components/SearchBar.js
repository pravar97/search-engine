import React from "react";
import { observer } from 'mobx-react';

import Form from 'react-bootstrap/Form';

//import search_icon from '../resources/images/search_icon.png';

const SearchBar = observer(({ onSearch, onChange, query }) => (
  <div style={{padding: "1em 5em 1em 5em"}}>
  <Form>
    <Form.Control
     style={{borderRadius: '100px', paddingLeft:'1.2em'}}
     //style = {{background: "#fbfbfb"}}
     type="text"
     key="random1"
     value={query}
     placeholder={query != "" ? "": "Search"}
     onChange={onChange}
     onKeyPress={event => event.key === "Enter" && onSearch()}
    />
  </Form>
  </div>
));




export default SearchBar;
