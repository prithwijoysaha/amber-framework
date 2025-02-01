import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

const NODE_ENV = process.env.NODE_ENV || 'local';
expand(config());


process.env.NODE_ENV = NODE_ENV;
