import PropTypes from 'prop-types';
import React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';

import defaults from '../theme';
import { deepMerge } from '../utils';
import Icon from './Icon';

function Header ({
	customControls,
	onClose,
	showCloseButton,
	closeButtonTitle,
	suggestExit,
	...props,
}, {
	theme,
}) {
	const classes = StyleSheet.create(deepMerge(defaultStyles, theme));

	return (
		<div className={css(classes.header)} {...props}>
			{
				customControls
				? <div className={css(classes.customControls)}> {customControls} </div>
				: <span />
			}
			{ suggestExit
				? <span className={css(classes.closeHint)} onClick={onClose}>
						Zakończ
					</span>
				: null
			}
			{!!showCloseButton && !suggestExit &&(
				<button
					className={css(classes.close)}
					title={closeButtonTitle}
					onClick={onClose}
				>
					<Icon fill={!!theme.close && theme.close.fill || defaults.close.fill} type="close" />
				</button>
			)}
		</div>
	);
}

Header.propTypes = {
	customControls: PropTypes.array,
	onClose: PropTypes.func.isRequired,
	suggestExit: PropTypes.bool,
	showCloseButton: PropTypes.bool,
};
Header.contextTypes = {
	theme: PropTypes.object.isRequired,
};

const defaultStyles = {
	header: {
		display: 'flex',
		justifyContent: 'center',
		// height: defaults.header.height,
	},
	customControls: {
		alignSelf: 'center',
	},
	closeHint: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 100,
		opacity: 0.8,
		verticalAlign: 'bottom',
		color: 'white',
		padding: 10,
		cursor: 'pointer',
    marginRight: -10,
	},
	close: {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		outline: 'none',
		top: 0,
		right:0,
		opacity: 0.25,
		position: 'absolute',
		verticalAlign: 'bottom',
		zIndex: 100,

		// increase hit area
		height: 50,
		marginRight: -10,
		padding: 10,
		width: 50,
	},
};

export default Header;
