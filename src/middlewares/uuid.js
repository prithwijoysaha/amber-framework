import { v4 as uuidv4 } from 'uuid';

export default (req, res, next) => {
	req.locals = { requestId: uuidv4() };
	next();
};
