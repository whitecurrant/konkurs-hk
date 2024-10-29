import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../react-images/src/Lightbox';
import Icon from '../react-images/src/components/Icon';
import Thumbnails from '../react-images/src/components/Thumbnails';
import { css, StyleSheet } from 'aphrodite/no-important';

class Gallery extends Component {
	constructor (props) {
		super(props);

		this.state = {
			lightboxIsOpen: false,
			currentImage: 0,
		};

		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
		this.gotoImage = this.gotoImage.bind(this);
		this.handleClickImage = this.handleClickImage.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
	}
	openLightbox (index, event) {
		event && event.preventDefault();
		this.setState({
			currentImage: index,
		});
		this.props.onOpen();
	}

	closeLightbox () {
		// this.setState({
		// 	currentImage: 0,
		// 	lightboxIsOpen: false,
		// });
	}
	gotoPrevious () {
		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	}
	gotoNext () {
		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	}
	gotoImage (index) {
		this.setState({
			currentImage: index,
		});
	}
	handleClickImage () {
		this.props.onPhotoSelected(this.props.images[this.state.currentImage]);
		// this.gotoNext();
	}

	renderTopControls() {
		const emptyHearts = [];
		const fullHearts = [];
		for (let i = this.props.remainingVotes; i > 0 ; i--){
			fullHearts.push(
				<Icon type='heartFull' className={css(classes.heart)} key={`heartFull${i}`}/>
			);
		}
		for (let i = 12 - this.props.remainingVotes ; i > 0 ; i--){
			emptyHearts.push(
				<Icon type='heartEmpty' className={css(classes.heart)} key={`heartEmpty${i}`} />
			);
		}
		return (
			<div key="hearts">
				{emptyHearts}
				{fullHearts}
			</div>
		);
	}

	renderGallery () {
		const { votedPhotosIds, votingInProgress, votesConfirmed } = this.props;
		return (
			<div>
				<Thumbnails
					onClickThumbnail={(id) => !votesConfirmed && this.openLightbox(id)}
					images={
						this.props.images
							.map((image, pos) => Object.assign({},{ image, pos }))
							.filter((obj) => votedPhotosIds.indexOf(obj.image.id) > -1)
					}
				/>
				{votingInProgress && votedPhotosIds.length < 12 && <p>Musisz zagłosować na 12 zdjęć</p>}
			</div>

		);
	}

	render () {
		return (
			<div className="section">
				{this.props.heading && <h2>{this.props.heading}</h2>}
				{this.renderGallery()}
				<Lightbox
					votedPhotosIds={this.props.votedPhotosIds}
          width={1783}
					closeButtonTitle="Zamknij"
					backdropClosesModal
					customControls={[this.renderTopControls()]}
					currentImage={this.state.currentImage}
					images={this.props.images}
					isOpen={this.props.lightboxIsOpen}
					onClickImage={this.handleClickImage}
					onClickNext={this.gotoNext}
					onClickPrev={this.gotoPrevious}
					onClickThumbnail={this.gotoImage}
					onClose={this.props.onClose}
					showThumbnails
					theme={this.props.theme}
				/>
			</div>
		);
	}
}

Gallery.displayName = 'Gallery';
Gallery.propTypes = {
	votedPhotosIds: PropTypes.array.isRequired,
	votingInProgress: PropTypes.bool.isRequired,
	heading: PropTypes.node,
	images: PropTypes.array,
	showThumbnails: PropTypes.bool,
	subheading: PropTypes.string,
};

const gutter = {
	small: 2,
	large: 4,
};

const classes = StyleSheet.create({
	gallery: {
		display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
		width: '100%',
		marginRight: -gutter.small,
		overflow: 'hidden',

		'@media (min-width: 500px)': {
			marginRight: -gutter.large,
		},
	},

	// anchor
	thumbnail: {
		boxShadow: '2px 2px 15px #888888',
		margin: 10,
		boxSizing: 'border-box',
		display: 'block',
		float: 'left',
		lineHeight: 0,
		padding: 5,
		overflow: 'hidden',

		'@media (min-width: 500px)': {
			paddingRight: gutter.large,
			paddingBottom: gutter.large,
		},
	},

	// orientation
	landscape: {
		width: '22%',
	},
	square: {
		paddingBottom: 0,
		width: '40%',

		'@media (min-width: 500px)': {
			paddingBottom: 0,
		},
	},

	heart: {
		margin: 4,
		opacity: 0.8,
	},

	// imageDiv: {
	// 	overflow: 'hidden',
	// 	width: '300px',
	// 	height: '300px',
	// 	position: 'relative',
	// },
	//
	// divImage: {
	// 	position: 'absolute',
	// 	margin: 'auto',
	// 	minHeight: '100%',
	// 	minWidth: '100%'
	// },

	// actual <img />
	source: {
		border: 0,
		display: 'block',
		height: 'auto',
		maxWidth: '100%',
		width: '100',
	},
});


export default Gallery;
