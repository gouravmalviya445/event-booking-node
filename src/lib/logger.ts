import pino, { LoggerOptions } from "pino";

const loggerOptions: LoggerOptions = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
      translateTime: "SYS:dd-mm-yyyy hh:mm:ss:l",
    }
  }
}
export const logger = pino(loggerOptions);