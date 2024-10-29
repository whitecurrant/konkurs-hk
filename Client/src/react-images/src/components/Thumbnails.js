import PropTypes from 'prop-types';
import React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import Thumbnail from './Thumbnail';

import theme from '../theme';

function Thumbnails ({ currentImage, images, onClickThumbnail, gridSize }) {
	const rows = []
	const gridStep = gridSize || 4;
	for (let i = 0; i < images.length ; i = i + gridStep){
			rows.push(images.filter((obj, pos) => pos >= i && pos < i + gridStep))
	}
	return (
		<div>
			{
				rows.map((rowOfImages, i) =>
					(
						<div className={css(classes.thumbnails)} key={`row${i}`}>
							{
								rowOfImages.map((imgPos, idx) =>
									(
										<Thumbnail
											{...imgPos.image}
											active={false}
											index={imgPos.pos}
											key={imgPos.pos}
											onClick={onClickThumbnail}
											bigSize
										/>
									)
								)
							}
							</div>
					)
				)
			}
		</div>
	);
}

Thumbnails.propTypes = {
	currentImage: PropTypes.number,
	images: PropTypes.array,
	gridSize: PropTypes.number,
	onClickThumbnail: PropTypes.func,
};

const classes = StyleSheet.create({
	thumbnails: {
		// bottom: theme.container.gutter.vertical,
		color: 'white',
		// height: 50,
		left: theme.container.gutter.horizontal,
		// overflowX: 'scroll',
		// overflowY: 'hidden',
		// position: 'absolute',
		// right: theme.container.gutter.horizontal,
		textAlign: 'center',
		whiteSpace: 'nowrap',
	},
});

export default Thumbnails;
