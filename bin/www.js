#!/usr/bin/env node
import { createServer } from 'http';
import app from '../src/app.js';

const { PORT, APP_NAME, NODE_ENV, PROTOCOL, HOST } = process.env;

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (Number.isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
};

const port = normalizePort(PORT || '5000');
app.set('port', port);
const server = createServer(app);

const onError = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port  ${port}`;
	switch (error.code) {
		case 'EACCES':
			console.log(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.log(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const onListening = () => {
	console.log(
		'\n',			
		`ENVIRONMENT =>  ${NODE_ENV?.toUpperCase()} APP NAME => ${APP_NAME?.toUpperCase()} SERVER => ${server.address().address?.replace('::', '127.0.0.1')?.toUpperCase()}:${port} URL => ${PROTOCOL}://${HOST}:${port}`,
		'\n',
	);
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
