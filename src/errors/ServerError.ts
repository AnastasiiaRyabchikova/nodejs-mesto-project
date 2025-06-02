export type ServerErrorProps = {
  name?: string,
  message?: string,
  statusCode?: number,
}

export class ServerError extends Error {
  statusCode;
  message = '';
  name = '';
  constructor({
    message = '',
    name,
    statusCode = 500,
  }: ServerErrorProps = {}) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    if (name) {
      this.name = name;
    }
  }
}
