import React from 'react';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import PiecePage from './pages/PiecePage';
import RootStore from './store/RootStore';
import { Provider } from "mobx-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollIntoView from "./components/ScrollUp";

class App extends React.Component {
  stores = new RootStore();

  render() {
    return (
      <Provider {...this.stores}>
        <BrowserRouter>
          <div>
            <ScrollIntoView>
              <Switch>
                <Route exact path="/" component={SearchPage} />
                <Route path="/result" component={ResultsPage} />
                <Route path="/piece" component={PiecePage} />
                <Route component={SearchPage} />
              </Switch>
            </ScrollIntoView>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
