class NotFoundError extends Error {
  constructor() {
    super();
    this.name = 'NotFoundError';
    this.message = '';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
