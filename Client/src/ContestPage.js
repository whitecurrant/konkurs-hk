import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import screenfull from 'screenfull';
import { Link } from 'react-router-dom';
import Gallery from './components/Gallery';
import Controls from './components/Controls';
import './App.css';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      votingInProgress: false,
      photos: [],
      votedPhotosIds: [],
      votesConfirmed: false,
      isLoading: true,
      contestValid: false,
      message: null,
      finished: false,
    };
  }



  setFetchedPhotos(photos) {
    shuffleArray(photos);
    this.setState({
      photos,
      isLoading: false,
      contestValid: true,
    });
  }

  fetchPhotos() {
    axios.get('/api/photos', {
      headers: { 'Cache-Control': 'max-age=45' }
    })
      .then(result => this.setFetchedPhotos(result.data))
      .catch(res => res.status === 304
        ? this.setFetchedPhotos(res)
        : this.handleNetworkError(res)
      );
  }

  onFormSubmit(voter) {
    this.setState({ isLoading: true, message: null });
    axios.post('/api/vote', { voter, votes: this.state.votedPhotosIds })
      .then(result => this.setState({
        isLoading: false,
        finished: true,
        message: 'Twoje głosy zostały zapisane. Dziękujemy!'
      }))
      .catch(e => this.handleNetworkError(e));
  }

  setupCountDown(startDate) {
    const startMoment = moment(startDate);
    const tick = () => {
      const now = moment();
      if (startMoment.isAfter(now)) {
        const duration = moment.duration(startMoment.diff(now));
        const msg = moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
        this.setState({ message: `Głosowanie rozpocznie się za ${msg}` })
      } else {
        clearInterval(tick);
        window.location.reload(true);
      }
    }
    if (moment().add(1, 'day').isAfter(startMoment)) {
      setInterval(tick.bind(this), 1000);
    } else {
      this.setState({
        message: `Głosowanie rozpocznie się ${
          startMoment.format('DD.MM.YYYY H:mm:ss')
          }`
      });
    }
  }

  handleNetworkError(error) {
    console.log(error);
    const status = error.response && error.response.status;
    if (status && status == 410) {
      if (error.response.data.start > new Date().getTime()) {
        this.setState({ contestValid: false });
        this.setupCountDown(error.response.data.start);
      } else {
        this.setState({ contestValid: false, message: error.response.data.error });
      }
    } else if (status && status === 406) {
      this.setState({ message: error.response.data.error, contestValid: true })
    } else {
      this.setState({ message: 'Uups, Wystąpił błąd. 🤒', contestValid: false })
    }
    this.setState({ isLoading: false });
  }

  componentWillMount() {
    this.fetchPhotos();
  }

  onPhotoSelected({ id, ...photo }) {
    if (this.state.votesConfirmed) return;

    const duplicateIndex = this.state.votedPhotosIds.indexOf(id);
    const duplicate = duplicateIndex > -1;
    if (!duplicate && this.state.votedPhotosIds.length === 12) {
      return;
    }
    const votedPhotosIds = duplicate
      ?
      [...this.state.votedPhotosIds.slice(0, duplicateIndex),
      ...this.state.votedPhotosIds.slice(duplicateIndex + 1)]
      :
      [...this.state.votedPhotosIds, id];
    this.setState({
      votedPhotosIds,
    });
  }

  renderControls() {
    return this.state.contestValid && (
      <Controls
        voteLimitReached={this.state.votedPhotosIds.length === 12}
        votedPhotosIds={this.state.votedPhotosIds}
        votesConfirmed={this.state.votesConfirmed}
        votingInProgress={this.state.votingInProgress}
        onVotingStarted={this.onVotingStarted.bind(this)}
        onVotesConfirmed={() => this.setState({ votesConfirmed: true })}
        onFormSubmit={this.onFormSubmit.bind(this)}
        visible={!(this.state.isLoading || this.state.finished)}
      />
    );
  }

  renderMessage() {
    return this.state.message && (
      <h3>{this.state.message}</h3>
    );
  }

  renderLoader() {
    return this.state.isLoading && (
      <div className="loader" />
    )
  }

  onVotingStarted() {
    this.onLightboxOpened();
    this.setState({ votingInProgress: true });
  }

  onLightboxOpened() {
    if (screenfull.enabled) {
      screenfull.request();
    }
    this.setState({ lightboxIsOpen: true });
  }

  onLightboxClosed() {
    if (screenfull.enabled) {
      screenfull.exit();
    }
    this.setState({ lightboxIsOpen: false });
  }

  renderGallery() {
    if (!this.state.contestValid) return false;

    return (
      <Gallery
        votesConfirmed={this.state.votesConfirmed}
        votingInProgress={this.state.votingInProgress}
        votedPhotosIds={this.state.votedPhotosIds}
        heading={this.renderControls()}
        closeButtonTitle="Zakończ"
        onPhotoSelected={this.onPhotoSelected.bind(this)}
        remainingVotes={12 - this.state.votedPhotosIds.length}
        images={this.state.photos}
        onClose={this.onLightboxClosed.bind(this)}
        onOpen={this.onLightboxOpened.bind(this)}
        lightboxIsOpen={this.state.lightboxIsOpen}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderLoader()}
        {this.renderMessage()}
        {this.renderGallery()}
        <Link className="hiddenLink" to='/admin/'> Log in </Link>
      </div>
    );
  }
}

export default App;
