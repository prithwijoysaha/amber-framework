import logger from './logger.js';

export const captureException = async (err) => {
	try {
		logger.error(err);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log('Exception :>> ', err.message, err.stack);
	}
	return true;
};

export const captureErrorMessage = async (message) => {
	// eslint-disable-next-line no-console
	console.log('Message :>> ', message);
	return true;
};
