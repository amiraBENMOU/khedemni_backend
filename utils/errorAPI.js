import { StatusCodes } from "http-status-codes";

export default class ErrorAPI extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class NotFoundErrorAPI extends ErrorAPI {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
export class UnAuthorizedErrorAPI extends ErrorAPI {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
export class BadRequestErrorAPI extends ErrorAPI {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
