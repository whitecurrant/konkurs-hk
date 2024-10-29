import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

const ResultsPage = class ResultsPage extends Component {

  constructor() {
    super();
    this.state = {
      message: null,
      isLoading: false,
      results: null,
    }
  }
  componentDidMount() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.setState({ isLoading: true, message: null });
    firebase.auth().currentUser.getIdToken()
      .then((authToken) => axios.get('/api/results', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      })
        .then(response => this.setState({
          isLoading: false,
          results: response.data,
        }))
        .catch(e => this.setState({
          isLoading: false,
          message: 'Wystąpił błąd 🤒',
        })))
  }

  renderLoader() {
    return this.state.isLoading && (
      <div className="loader" />
    )
  }

  renderMessage() {
    return this.state.message && (
      <h3>{this.state.message}</h3>
    );
  }

  isAuthenticated() {
    return firebase.apps.length === 1 && firebase.auth().currentUser;
  }

  renderResults() {
    return this.state.results && (
      <div>
        <p>{`Liczba oddanych głosów: ${this.state.results.voters}`}</p>
        <table style={{ margin: '0 auto' }}>
          {
            this.state.results.photos.map((photo, i) => {
              return (
                <tr key={photo.id} style={i < 12 ? { fontWeight: 'bold', opacity: 1 } : { opacity: 0.5 }}>
                  <td>
                    <a
                      style={{ textDecoration: 'none', color: 'black' }}
                      href={photo.src}
                    >
                      {photo.author} - {photo.caption}
                    </a>
                  </td>
                  <td>
                    {photo.score}
                  </td>
                </tr>
              );
            }
            )
          }
        </table>
      </div>
    );
  }

  render() {
    if (!this.isAuthenticated()) {
      return <Redirect to="/admin" />
    }
    return (
      <div>
        {this.renderLoader()}
        {this.renderMessage()}
        {this.renderResults()}
      </div>
    );
  }
}

ResultsPage.PropTypes = {
  user: PropTypes.object,
}

export default ResultsPage;
