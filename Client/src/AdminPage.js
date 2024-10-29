import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import LoginPage from './components/LoginPage';
import ResultsPage from './components/ResultsPage';
import NewContestPage from './components/NewContestPage';
import 'react-datepicker/dist/react-datepicker.css';

const AdminPage = class AdminPage extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      selectedPage: null,
      authChecked: false,
    }
    if (firebase.apps.length !== 1) {
      firebase.initializeApp({
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: ''
      });
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }

  onAuthStateChanged(user) {
    this.setState({ user, authChecked: true });
  }

  renderNewContestPage() {
    return this.state.selectedPage == 1 && (
      <NewContestPage user={this.state.user} />
    );
  }

  renderResultsPage() {
    return this.state.selectedPage == 2 && (
      <ResultsPage user={this.state.user} />
    );
  }

  renderOptionButtons() {
    return this.state.authChecked && this.state.user && (
      <div>
        <Link className="button" to='/admin/create'>
          Stwórz nowy konkurs
          </Link>

        <Link className="button" to='/admin/results'>
          Zobacz wyniki
          </Link>
      </div>
    );
  }

  render() {
    if (!this.state.user) {
      return <LoginPage />
    }
    return (
      <div>
        <a
          style={{
            position: 'absolute',
            color: 'white',
            cursor: 'pointer',
            fontSize: 13,
            padding: 13,
            top: 0,
            right: 0,
          }}
          onClick={() => firebase.auth().signOut()}
        >
          Wyloguj się
          </a>
        {this.renderOptionButtons()}
        {this.renderResultsPage()}
        {this.renderNewContestPage()}
      </div>
    )
  }
}

export default AdminPage;
