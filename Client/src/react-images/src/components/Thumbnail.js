import PropTypes from 'prop-types';
import React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';

import defaults from '../theme';
import { deepMerge } from '../utils';
import HeartIcon from '../icons/heartFullBig';

function Thumbnail ({ index, src, thumbnail, thumbnailBig, active, onClick, isVoted, bigSize, caption }, { theme }) {
	const url = (bigSize ? thumbnailBig : thumbnail) || src;
	const classes = StyleSheet.create(deepMerge(defaultStyles, theme));

	return (
		<div
			title={caption}
			className={css(classes.thumbnail, active && classes.thumbnail__active, bigSize && classes.thumbnail__big)}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick && onClick(index);
			}}
			style={{ backgroundImage: 'url("' + url + '")' }}>
				<div className={css(classes.bigHeart)}>
					{ isVoted ?	<HeartIcon size={24}/> : null }
				</div>
			</div>
	);
}

Thumbnail.propTypes = {
	active: PropTypes.bool,
	index: PropTypes.number,
	onClick: PropTypes.func,
	src: PropTypes.string,
	size: PropTypes.number,
	thumbnail: PropTypes.string,
};

Thumbnail.contextTypes = {
	theme: PropTypes.object,
};

const defaultStyles = {
	thumbnail: {
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		borderRadius: 2,
		boxShadow: 'inset 0 0 0 1px hsla(0,0%,100%,.2)',
		cursor: 'pointer',
		display: 'inline-block',
		height: defaults.thumbnail.size,
		margin: defaults.thumbnail.gutter,
		overflow: 'hidden',
		width: defaults.thumbnail.size,
	},
	bigHeart: {
		opacity: 0.65,
		height: '100%',
		display:'flex',
		alignItems:'center',
		justifyContent:'center',
	},
	thumbnail__active: {
		boxShadow: `inset 0 0 0 2px ${defaults.thumbnail.activeBorderColor}`,
	},
	thumbnail__big: {
		width: 180,
		height: 180,
	}
};

export default Thumbnail;
