import React from "react";
import { observer } from "mobx-react";

import Form from 'react-bootstrap/Form';

const SearchBar = observer(({ onSearch, onChange, query }) => (
  <div style={{padding: "1em 5em 1em 5em"}}>
    <Form.Control
     type="text"
     key="random1"
     placeholder={"Search"}
     onChange={onChange}
     onKeyPress={event => event.key === "Enter" && onSearch()}
    />
  </div>
));


export default SearchBar;
