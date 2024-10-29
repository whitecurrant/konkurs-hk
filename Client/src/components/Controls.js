import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResultForm from './ResultForm';

const Controls = class Controls extends Component {

  renderStartButton(){
    return (
      <button
        className="button"
        onClick={this.props.onVotingStarted}
      >
        {
          !this.props.votingInProgress
            ? 'Rozpocznij głosowanie'
            : 'Zmień'
        }
      </button>
    );
  }

  renderConfirmButton(){
    return (
      <button
        className="button buttonConfirmed"
        onClick={this.props.onVotesConfirmed}>
        Potwierdź
      </button>
    );
  }

  renderResultForm() {
    const { votedPhotosIds, votesConfirmed, onFormSubmit } = this.props;
    return (
        <ResultForm
          onFormSubmit={onFormSubmit}
          visible={votesConfirmed}
          votedPhotosIds={votedPhotosIds}
        />
    );
  }

  render() {
    if (!this.props.visible) return null;
    const {
      votingInProgress,
      voteLimitReached,
      votesConfirmed
    } = this.props;

    return votesConfirmed
      ? this.renderResultForm()
      : (
          <div>
            { this.renderStartButton() }
            { votingInProgress && voteLimitReached && this.renderConfirmButton()}
          </div>
        );
  }
}

Controls.PropTypes = {
  voteLimitReached: PropTypes.bool.isRequired,
  votedPhotosIds: PropTypes.array.isRequired,
  votingInProgress: PropTypes.bool.isRequired,
  votesConfirmed: PropTypes.bool.isRequired,
  onVotingStarted: PropTypes.func.isRequired,
  onVotesConfirmed: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default Controls;
