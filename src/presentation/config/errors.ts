export const {
  BadRequest,
  InternalServerError,
  NotFound,
  NotImplemented,
  Unauthorized,
  UnprocessableEntity,
  CustomError,
} = require('@4alltecnologia/http-errors');

export class Conflict extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super('CONFLICT', message, details);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class BadGateway extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super('BAD_GATEWAY', message, details);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class Forbidden extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super('FORBIDDEN', message, details);
  }
}
