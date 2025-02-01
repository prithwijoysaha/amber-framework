import cors from 'cors';

export default cors({
	origin: '*',
	errorHandler: (req, res) => {
		res.return({
			Unauthorized: [
				{
					message: 'There was a problem with your request. Please try again later.',
					reason: 'Request blocked due to CORS origin policy',
				},
			],
		});
	},
});
