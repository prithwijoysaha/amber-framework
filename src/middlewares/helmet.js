import helmet from 'helmet';

export default helmet({
	onerror: (error, req, res) => {
		res.return({
			Unauthorized: [
				{
					message: 'There was a problem with your request. Please try again later.',
					reason: 'Invalid header provided. Helmet Error.',
				},
			],
		});
	},
});
