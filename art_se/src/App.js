import './App.css';
import React from 'react';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import PiecePage from './pages/PiecePage';
import RootStore from './store/RootStore';
import { Provider } from "mobx-react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
//import { Switch, Route, withRouter } from "react-router-dom";

class App extends React.Component {
  stores = new RootStore();

  render() {
    return (
      <Provider {...this.stores}>
        <Router onUpdate={() => window.scrollTo(0, 0)}>
          <div>
            <Switch>
              <Route exact path="/" component={SearchPage} />
              <Route path="/results" component={ResultsPage} />
              <Route path="/piece" component={PiecePage} />
              <Route component={SearchPage} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
