import errsole from "errsole";
import ErrsoleSQLite from "errsole-sqlite";
import os from "os";
import path from "path";

const logsFile = path.join(os.tmpdir(), `${process.env.APP_NAME}.log.sqlite`);

errsole.initialize({
  storage: new ErrsoleSQLite(logsFile),
  appName: process.env.APP_NAME,
  enableConsoleOutput: true,
  exitOnException: false,
  environmentName: process.env.NODE_ENV,
});

export default errsole;
