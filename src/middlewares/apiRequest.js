import {ALLOWED_METHODS} from '../config/constant.js';

const allowedMethods = ALLOWED_METHODS;
// check header and methods here
export default async (req, res, next) => {
	try {
		if (allowedMethods.includes(req.method)) {
			next();
		} else {
			res.return({ MethodNotAllowed: [{ reason: 'Requested method is not allowed' }] });
		}
	} catch (e) {
		res.return({
			BadRequest: [{ message: 'Invalid request headers', reason: e.details[0].message || e.message }],
		});
	}
};
