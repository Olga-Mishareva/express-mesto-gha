class BadRequestError extends Error {
  constructor() {
    super();
    this.name = 'BadRequestError';
    this.message = '';
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
