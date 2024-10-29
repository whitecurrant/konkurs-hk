import React, { Component } from 'react';
import firebase from 'firebase';

const LoginPage = class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: '',
      isLoading: false,
    }
  }

  onLoginChange(e) {
    this.setState({
      username: e.target.value,
    })
  }

  onPasswordChange(e) {
    this.setState({
      password: e.target.value,
    })
  }

  onFormSubmit() {
    this.setState({ isLoading: true, message: null });
    firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
      .then(x => {
        this.setState({ isLoading: false })
      })
      .catch(e => {
        console.error(e);
        this.setState({ isLoading: false, message: e.message })
      });
  }

  renderLoader(){
    return this.state.isLoading && (
      <div className="loader"/>
    )
  }

  renderMessage() {
    return this.state.message && (
      <h3 style={{ fontSize: 12 }}> {this.state.message} </h3>
    );
  }

  renderControls() {
    return !this.state.isLoading && (
      <div>
        <input
          placeholder="email"
          value={this.state.username}
          onChange={(this.onLoginChange.bind(this))}
        />
        <input
          placeholder="password"
          type="password"
          onChange={(this.onPasswordChange.bind(this))}
          value={this.state.password}
        />
        <button className="button" onClick={this.onFormSubmit.bind(this)}>
          Zaloguj się
        </button>
      </div>
    );
  }

  render(){
    return (
      <div>
        {this.renderLoader()}
        {this.renderMessage()}
        {this.renderControls()}
      </div>
    );
  }
}

export default LoginPage;
