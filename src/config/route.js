import path from 'path';
import { pathToFileURL } from 'url';
import { findFilesByExtension } from '../libraries/utility.js';

const { BASE_PATH } = process.env;

const loadRouterFiles = async (dir, extension, app) => {
	const routerFiles = findFilesByExtension(dir, extension);
	const allRoutes = await Promise.all(
		routerFiles.map(async (filePath) => {
			const apiGroupName = path.relative(dir, path.dirname(filePath));
			const { default: apiRoute } = await import(pathToFileURL(filePath));
			const fullRoute = `${BASE_PATH}/${apiGroupName.replace(/\\+/g, '/')}`;
			app.use(fullRoute, apiRoute);
			return fullRoute;
		}),
	);
	return allRoutes;
};

export default loadRouterFiles;
