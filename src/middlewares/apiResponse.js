import { API_RESPONSE_CODES } from '../config/constant.js';

const metaResponseBuilder = (meta = {}) => ({
	apiVersion: meta.apiVersion,
	requestId: meta.requestId,
	tokenType: meta.tokenType,
	token: meta.token,
	tokenExpiresIn: meta.tokenExpiresIn,
	xTokenType: meta.xTokenType,
	xToken: meta.xToken,
	xTokenExpiresIn: meta.xTokenExpiresIn,
	cacheResult: meta.cacheResult,
	shouldRetry: meta.shouldRetry,
	retryAfter: meta.retryAfter, // in milliseconds
	responseType: meta.responseType,
	xRateLimitLimit: meta.xRateLimitLimit,
	xRateLimitRemaining: meta.xRateLimitRemaining,
	xRateLimitReset: meta.xRateLimitReset,
});

const successResponseBuilder = (responseType, result = {}, meta = {}) => {
	const { defaultMessage } = API_RESPONSE_CODES[responseType];
	return {
		meta: metaResponseBuilder(meta),
		message: result.message || defaultMessage,
		errors: [],
		data: result.data,
	};
};

const errorResponseBuilder = (responseType, errors = [], meta = {}) => {
	const { defaultMessage } = API_RESPONSE_CODES[responseType];
	if (API_RESPONSE_CODES[meta.responseType] && errors.length > 0) {
		const errorData = errors.map((error) => ({
			message: error.message || defaultMessage,
			reason: error.reason || error.message || defaultMessage,
		}));
		return {
			meta: metaResponseBuilder(meta),
			message: errors?.[0]?.message || defaultMessage,
			errors: errorData,
			data: {},
		};
	}
	throw new Error('Invalid Response Type Provided');
};

const responseBuilder = (req, res, next) => {
	res.success = (result = {}, meta = {}) => {
		const responseType = 'OK';
		const { statusCode } = API_RESPONSE_CODES[responseType];
		res.status(statusCode).send(
			successResponseBuilder(responseType, result, {
				...meta,
				responseType,
				requestId: req.locals.requestId,
			}),
		);
	};

	res.return = (result = {}, meta = {}) => {
		if (Object.keys(result).length !== 1) {
			throw new Error('Response Object Should Have Only One Key');
		}
		const responseType = Object.keys(result)[0];
		const results = Object.values(result)[0];
		const { statusCode } = API_RESPONSE_CODES[responseType];
		if (statusCode >= 200 && statusCode <= 299) {
			res.status(statusCode).send(
				successResponseBuilder(responseType, results, {
					...meta,
					responseType,
					requestId: req.locals.requestId,
				}),
			);
		} else {
			res.status(statusCode).send(
				errorResponseBuilder(responseType, results, {
					...meta,
					responseType,
					requestId: req.locals.requestId,
				}),
			);
		}
	};

	res.error = (error = {}, meta = {}) => {
		if (Object.keys(error).length !== 1) {
			throw new Error('Error Object Should Have Only One Key');
		}
		const responseType = Object.keys(error)[0];
		const errors = Object.values(error)[0];
		const { statusCode } = API_RESPONSE_CODES[responseType];
		res.status(statusCode).send(
			errorResponseBuilder(responseType, errors, {
				...meta,
				responseType,
				requestId: req.locals.requestId,
			}),
		);
	};
	res.errorWithStatus = (statusCode, error = [], meta = {}) => {
		const [responseTypes] = Object.entries(API_RESPONSE_CODES).filter(
			([, value]) => value.statusCode === statusCode,
		);
		const responseType = responseTypes[0] || 'UncaughtError';

		res.status(statusCode).send(
			errorResponseBuilder(responseType, error, {
				...meta,
				responseType,
				requestId: req.locals.requestId,
			}),
		);
	};
	next();
};
export default responseBuilder;
