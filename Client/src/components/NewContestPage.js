import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactFileReader from 'react-file-reader';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import firebase from 'firebase';
import { Redirect, Link } from 'react-router-dom';
import AdminTips from './AdminTips';
import Thumbnails from '../react-images/src/components/Thumbnails';
import 'react-datepicker/dist/react-datepicker.css';

const NewContestPage = class NewContestPage extends Component {
  constructor() {
    super();
    this.state = {
      photos: null,
      startDate: null,
      endDate: null,
      isLoading: false,
      isCompleted: false,
      message: null,
    }
  }

  handleFiles(files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const photos = e.target.result.split(/\r?\n/)
        .map(line => line.split(','))
        .filter(parts => parts.length === 3)
        .map((parts, id) => ({
          id,
          author: parts[0],
          caption: parts[1],
          src: parts[2]
        }));
      const thumbnails = photos.map((photo, id) =>
        Object.assign(photo, {
          thumbnailBig: photo.src.replace(/=.*$/, '').concat('=h320-w240')
        })
      ).map((image, pos) => Object.assign({}, { image, pos }));
      this.setState({ photos, thumbnails })
    };
    reader.readAsText(file);
  }

  handleStartDateChange(startDate) {
    this.setState({ startDate });
  }

  handleStopDateChange(endDate) {
    this.setState({ endDate });
  }

  async handleConfirmationButton() {
    this.setState({
      isLoading: true,
    });

    const authToken = await firebase.auth().currentUser.getIdToken();
    axios.post('/api/contest', {
      photos: this.state.photos,
      endDate: this.state.endDate.valueOf(),
      startDate: this.state.startDate.valueOf(),
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })
      .then(response => this.setState({
        isCompleted: true,
        isLoading: false,
        photos: null,
        message: 'Utworzono konkurs 🥳'
      }))
      .catch(e => this.setState({
        message: 'Wystąpił błąd 🤒',
        isLoading: false,
        photos: null,
        isCompleted: true,
      }));
  }

  renderUploadedPhotos() {
    return this.state.photos && (
      <div>
        <p>{`${this.state.photos.length} zdjęć`}</p>
        <Thumbnails images={this.state.thumbnails} gridSize={6} />
      </div>
    );
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

  renderDatePickers() {
    return this.state.photos && !this.state.isLoading && (
      <div style={{ display: 'flex', 'justifyContent': 'center' }}>
        <DatePicker
          style={{ margin: 5 }}
          selected={this.state.startDate}
          onChange={this.handleStartDateChange.bind(this)}
          showTimeSelect
          timeIntervals={60}
          dateFormat="LLL"
          locale="pl"
          placeholderText="Data rozpoczęcia"
        />
        <DatePicker
          selected={this.state.endDate}
          onChange={this.handleStopDateChange.bind(this)}
          showTimeSelect
          timeIntervals={60}
          dateFormat="LLL"
          locale="pl"
          placeholderText="Data zakończenia"
        />
      </div>
    );
  }

  renderSaveButton() {
    return this.state.photos && !this.state.isLoading && (
      <div>
        <p style={{ color: 'red', fontSize: 11 }}>Przy zapisaniu zmian dotychczasowe dane zostaną usunięte!</p>
        <button
          onClick={this.handleConfirmationButton.bind(this)}
          disabled={!(this.state.startDate && this.state.endDate)}
          className="button buttonConfirmed">
          Zapisz konkurs
        </button>
      </div>
    );
  }

  renderFileChooser() {
    return !this.state.photos && !this.state.isCompleted && (
      <div>
        <AdminTips />
        <ReactFileReader fileTypes=".csv" handleFiles={this.handleFiles.bind(this)}>
          <button className='button'>Wczytaj nowy plik z danymi</button>
        </ReactFileReader>
      </div>
    );
  }

  render() {
    if (firebase.apps.length !== 1 || !firebase.auth().currentUser) {
      return <Redirect to="/admin" />
    }
    return (
      <div>
        {this.renderLoader()}
        {this.renderMessage()}
        {this.renderDatePickers()}
        {this.renderSaveButton()}
        {this.renderFileChooser()}
        {this.renderUploadedPhotos()}
        {
          this.state.isCompleted &&
          <Link className="button" to='/'>
            Przejdź do strony konkursu
            </Link>
        }
      </div>
    );
  }
}

NewContestPage.PropTypes = {
  user: PropTypes.object,
}

export default NewContestPage;
