import swaggerUi from 'swagger-ui-express';
import { pathToFileURL } from 'url';
import { findFilesByExtension } from '../libraries/utility.js';
import { API_RESPONSE_CODES, DEFAULT_ERROR_MESSAGE } from './constant.js';

const { NODE_ENV, APP_NAME, HOST, PROTOCOL, PORT } = process.env;

export const docServe = swaggerUi.serveFiles;
export const docSetup = swaggerUi.setup;

let host = HOST;
if (NODE_ENV === 'local') {
	host = `${HOST}:${PORT}`;
}
const defaultErrorTypeObject = Object.entries(API_RESPONSE_CODES).filter(
	([, value]) => value.defaultMessage === DEFAULT_ERROR_MESSAGE,
);
const defaultErrorType = defaultErrorTypeObject[0][0];

export const docOption = {
	customCssUrl: ['/assets/css/apidoc.css'],
	customSiteTitle: `${APP_NAME} | ${NODE_ENV}`,
	customfavIcon: '/favicon.ico',
	explorer: true,
};

let debugErrorProperty = {};
	debugErrorProperty = {
		reason: {
			type: 'string',
		},
	};

export const docCommonConfig = {
	openapi: '3.0.0',
	info: {
		title: APP_NAME,
	},
	host,
	basePath: '/api',
	schemes: [PROTOCOL],
	servers: [
		{
			url: `${PROTOCOL}://${host}/api/{version}`,
			variables: {
				version: {
					default: 'v1',
					enum: ['v1'],
					description: 'The version of the API to use.',
				},
			},
		},
	],

	consumes: ['application/json'],
	produces: ['application/json'],
	components: {
		schemas: {
			Error: {
				type: 'object',
				required: ['meta', 'errors'],
				properties: {
					meta: {
						type: 'object',
						properties: {
							requestId: {
								type: 'string',
								format: 'uuid',
							},
							responseType: {
								type: 'string',
								name: defaultErrorType,
							},
						},
					},
					message: {
						type: 'string',
					},
					errors: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
								},
								...debugErrorProperty,
							},
						},
					},
					data: {
						type: 'object',
					},
				},
			},
		},
	},
};

export const loadDocumentationFiles = async (dir, extension, app) => {
	const docFiles = findFilesByExtension(dir, extension);
	const allDocConfig = docCommonConfig;
	const paths = {};
	const components = {};

	await Promise.all(
		docFiles.map(async (filePath) => {
			const { default: apiDocument } = await import(pathToFileURL(filePath));
			if (apiDocument && apiDocument.paths) {
				Object.assign(paths, apiDocument.paths);
			}
			if (apiDocument && apiDocument.components) {
				Object.assign(components, apiDocument.components);
			}
		}),
	);
	allDocConfig.paths = paths;
	allDocConfig.components.schemas = { ...allDocConfig.components.schemas, ...components.schemas };

	app.use('/api-docs', docServe(allDocConfig, docOption), docSetup(allDocConfig, docOption));
};
