import { ENV } from "../env";
import { StatusCodes } from "http-status-codes";

class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: string[];
  data: null;
  
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack: string = ""
  ) {
    super(message);
    
    // Set the prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
    
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.success = false;
    
    // Handle stack trace properly
    if (stack) {
      this.stack = stack;
    } else if (ENV.nodeEnv !== "production") {
      // Only capture stack trace in non-production
      Error.captureStackTrace(this, this.constructor);
    } else {
      // In production, keep minimal stack
      this.stack = "";
    }
  }
}
export {
  ApiError,
  StatusCodes
 }