import Redis from 'ioredis';
import { fileURLToPath, pathToFileURL } from 'url';
import { readdirSync } from 'fs';
import { dirname, join, basename as _basename } from 'path';
import database from '../../../config/database.js';

const redis = new Redis(database.memory.db0);

const baseFilename = _basename(fileURLToPath(import.meta.url));
const db = {};
const modelDirectoryPath = dirname(fileURLToPath(import.meta.url));
const allModelFiles = readdirSync(modelDirectoryPath).filter(
	(file) => file.indexOf('.') !== 0 && file !== baseFilename && file.slice(-3) === '.js',
);
const modelPromises = allModelFiles.map(async (file) => {
	const modelFile = join(modelDirectoryPath, file);
	const { default: model } = await import(pathToFileURL(modelFile));
	return model;
});

const models = await Promise.all(modelPromises);
models.forEach((Model) => {
	db[Model.name] = new Model(redis);
});
export default db;
