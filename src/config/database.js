import "./environment.js";

const {
  APP_NAME,
  NODE_ENV,
  SQL_DIALECT,
  SQL_DATABASE,
  SQL_USERNAME,
  SQL_PASSWORD,
  SQL_HOST,
  SQL_PORT,
  SQL_RO_0_HOST,
  SQL_RO_0_USERNAME,
  SQL_RO_0_PASSWORD,
  MEMORY_DB0_HOST,
  MEMORY_DB0_PORT,
  MEMORY_DB0_PASSWORD,
  MEMORY_DB0_DATABASE,
} = process.env;

const commonConfig = {
  sql: {
    database: SQL_DATABASE,
    username: null,
    password: null,
    options: {
      /* host: SQL_HOST, */
      port: SQL_PORT,
      dialect: SQL_DIALECT,
      dialectOptions: {
        requestTimeout: 3000,
        application_name: APP_NAME,
      },
      logging: false,
      migrationStorageTableName: "sequelize_meta",
      migrationStorageTableSchema: "private",
      replication: {
        read: [
          {
            host: SQL_RO_0_HOST,
            username: SQL_RO_0_USERNAME,
            password: SQL_RO_0_PASSWORD,
          },
        ],
        write: {
          host: SQL_HOST,
          username: SQL_USERNAME,
          password: SQL_PASSWORD,
        },
      },
      pool: {
        max: 2,
        min: 0,
        acquire: 3000,
        idle: 100,
        evict: 300,
      },
    },
  },
  memory: {
    db0: {
      port: MEMORY_DB0_PORT, // Redis port
      host: MEMORY_DB0_HOST, // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: MEMORY_DB0_PASSWORD,
      db: MEMORY_DB0_DATABASE,
    },
  },
};

if (NODE_ENV === "local") {
  commonConfig.sql.db0.options.pool = {
    max: 10,
    min: 0,
    acquire: 3000,
    idle: 100,
    evict: 300,
  };
  commonConfig.sql.db0.options.dialectOptions = {
    requestTimeout: 3000,
    application_name: APP_NAME,
  };
}

if (NODE_ENV === "development") {
  commonConfig.sql.db0.options.pool = {
    max: 2,
    min: 0,
    acquire: 3000,
    idle: 100,
    evict: 300,
  };
  commonConfig.sql.db0.options.dialectOptions = {
    requestTimeout: 3000,
    // Your pg options here
    application_name: APP_NAME,
    /* ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
			key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
			cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
		  }, */
    //   client_encoding: Incomplete check sequalize doc
  };
}

if (NODE_ENV === "production") {
  commonConfig.sql.db0.options.pool = {
    max: 2,
    min: 0,
    acquire: 3000,
    idle: 100,
    evict: 300,
  };
  commonConfig.sql.db0.options.dialectOptions = {
    requestTimeout: 3000,
    application_name: APP_NAME,
  };
}

export default commonConfig;
