import './config/environment.js';
import express, { Router, json, urlencoded } from 'express';
import uuid from './middlewares/uuid.js';
import { resolve as pathResolve, dirname } from 'path';
import apiRequest from './middlewares/apiRequest.js';
import apiResponse from './middlewares/apiResponse.js';
import notFoundError from './middlewares/notFoundError.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';
import cors from './middlewares/cors.js';
import helmet from './middlewares/helmet.js';
import { loadDocumentationFiles } from './config/documentation.js';
import loadRouterFiles from './config/route.js';

const moduleDirectory = pathResolve(dirname('./'), 'src/modules');
const publicDirectory = pathResolve(dirname('./'), 'public');
const viewDirectory = pathResolve(dirname('./'), 'src/views');

const { APP_NAME, NODE_ENV, BASE_PATH } = process.env;

const app = express();
app.use(uuid);
app.disable('x-powered-by');
app.use(apiResponse); // set after uuid middleware and above all api routes
app.use(json({ limit: '5mb' }));
app.use(urlencoded({ limit: '5mb', extended: false }));
app.use(logger);
app.use(helmet);
app.use(cors);
app.use(apiRequest); // set after apiResponse middleware and above all api routes
app.use(BASE_PATH, express.static(publicDirectory));
app.set('views', viewDirectory);
app.set('view engine', 'ejs');

await loadRouterFiles(moduleDirectory, 'router.js', app);
await loadDocumentationFiles(moduleDirectory, 'doc.js', app);


app.use(
	`${BASE_PATH}/`,
	Router().get('/', async (req, res) => {
		res.render('index', {
			appName: APP_NAME.toUpperCase(),
			nodeEnv: NODE_ENV.toUpperCase(),
		});
	})
);

app.use(notFoundError); // catch 404 and forward to error handler
app.use(errorHandler); // error handler this should be last middleware

export default app;