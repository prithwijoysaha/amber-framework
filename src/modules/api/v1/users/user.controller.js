// @ts-check
import { captureException } from '../../../../libraries/exception.js';

export const findUser = async (request) => {
	try {
		const { payload } = request; //	The payload object.
		
		return {
			OK: {
				message:  'User data not found.',
				data: {
					count: 0,
					records: [],
				},
			},
		};
	} catch (e) {
		captureException(e);
		return {
			InternalServerError: [
				{ message: 'Unexpected error occurred.', reason: e.message },
			],
		};
	}
};