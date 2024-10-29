import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ResultForm = class ResultForm extends Component {

  constructor() {
    super();
    this.state = {
      nick: '',
    }
  }

  onInputChange(event) {
    this.setState({
      nick: event.target.value,
    });
  }

  submitForm() {
    this.props.onFormSubmit(this.state.nick);
  }

  render() {
    return (
      <div>
        <input
          maxLength={40}
          onChange={this.onInputChange.bind(this)}
          value={this.state.nick}
          placeholder="Twój nick/imię i nazwisko"
          style={{ width: 200 }}
        />
        <button
          disabled={this.state.nick.length < 5}
          onClick={this.submitForm.bind(this)}
          className="button"
        >
          Zapisz
        </button>
      </div>
    );
  }
}

export default ResultForm;

ResultForm.PropTypes = {
  votedPhotos: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
}
