// @ts-check
import ip from 'ip';
import logger from '../libraries/logger.js';
import { NO_LOG_ROUTES, SENSITIVE_KEYS } from '../config/constant.js';

const { BASE_PATH } = process.env;

const hideSensitiveData = (obj) => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map(hideSensitiveData);
	}
	const sensitiveKeys = SENSITIVE_KEYS;
	return Object.keys(obj).reduce((newObj, key) => {
		const newObject = newObj;
		if (sensitiveKeys.includes(key)) {
			newObject[key] = '*****';
		} else {
			newObject[key] = hideSensitiveData(obj[key]);
		}
		return newObject;
	}, {});
};

export default (req, res, next) => {
	const logExcludedRoutes = NO_LOG_ROUTES.map(({ url, methods }) => {
		const realUrl = `${BASE_PATH}${url}`;
		if (realUrl === '/') {
			return { url: realUrl, methods: new Set(methods) };
		}
		return { url: realUrl.replace(/\/$/, ''), methods: new Set(methods) };
	});
	const matches = logExcludedRoutes.map(
		(value) =>
			(req.path === value.url || req.path.replace(/\/$/, '') === value.url) && value.methods.has(req.method),
	);
	if (matches.some((value) => value)) {
		return next();
	}

	const { write: oldWrite, end: oldEnd } = res;

	const chunks = [];

	res.write = async (chunk) => {
		chunks.push(chunk);
		oldWrite.call(res, chunk);
	};

	res.end = async (chunk) => {
		if (chunk) {
			chunks.push(chunk);
		}
		let responseBody;
		try {
			// if compression used then here have to de-compressed here
			responseBody = JSON.parse(Buffer.concat(chunks).toString('utf8'));
		} catch (e) {
			if(typeof chunks === 'string') {
				responseBody = chunks;
			}else{
				responseBody = Buffer.concat(chunks).toString('utf8');
			}
		}
		logger.log({
				request: {
					requestId: req.locals.requestId,
					url: req.originalUrl,
					method: req.method,
					params: req.params,
					body: hideSensitiveData(req.body),
					query: req.query,
					headers: req.rawHeaders,
					protocol: req.protocol,
					host: req.get('host'),
					ip: ip.address(),
				},
				response: {
					body: responseBody,
					statusCode: res.statusCode,
				},
			});

		oldEnd.call(res, chunk);
	};
	return next();
};
