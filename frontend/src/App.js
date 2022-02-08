import React, { Component } from 'react';
import { Link, HashRouter as Router, Route } from 'react-router-dom';

import Artist from './components/Artist';
import Landing from './components/Landing';
import Series from './components/Series';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header>
            <Link to="/" className="logo">
              <img src='img/logo.svg' alt="logo" className="desktop" />
              <img src='img/logo-mobile.svg' alt="logo" className="mobile" />
            </Link>
          </header>
          <Route exact path="/" component={Landing} />
          <Route path="/artists/:id" component={Artist} />
          <Route path="/series/:id" component={Series} />
        </div>
      </Router>
    );
  }
}

export default App;

