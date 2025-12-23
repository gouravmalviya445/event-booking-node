import { ENV } from "../env";

class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: string[];
  stack: string;
  data: any;
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;
    this.success = false;
    this.stack = "";

    if (ENV.nodeEnv != "production") {
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor)
      }
    }
  }
}

export { ApiError }