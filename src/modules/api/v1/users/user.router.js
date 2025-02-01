import express from 'express';
import { findUser } from './user.controller.js';

const router = express.Router();

router.get('/', async (req, res) => {
	res.return(
		await findUser({
			payload: { ...req.params, ...req.query, ...req.body },
			headers: req.headers,
			locals: req.locals,
		}),
	);
});

export default router;
