class ApiResponse {
  statusCode: number;
  message: string;
  data?: Record<string, any>;
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "Success",
    data?: Record<string, any>,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export { ApiResponse }