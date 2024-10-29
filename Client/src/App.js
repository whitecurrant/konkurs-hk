import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import logo from './hk.svg';
import ContestPage from './ContestPage'
import NewContestPage from './components/NewContestPage'
import ResultsPage from './components/ResultsPage'
import AdminPage from './AdminPage'
import './App.css';

const currentYear = (new Date()).getFullYear();

const App = () =>
  (
    <div className="App">
      <div className="App-header">
      <h3> Konkurs kalendarzowy Hawiarskiej Koliby { currentYear } </h3>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <div className="App-intro">
        <BrowserRouter>
          <Switch>
            <Route exact path="/admin" component={AdminPage} />
            <Route exact path="/admin/create" component={NewContestPage}  />
            <Route exact path="/admin/results" component={ResultsPage}  />
            <Route path="/" component={ContestPage} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );

export default App;
