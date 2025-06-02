export type ServerErrorProps = {
  name?: string,
  message?: string,
  statusCode?: number,
}

export class ServerError extends Error {
  statusCode;

  message = '';

  name = '';

  some = '';

  constructor({
    message = 'На сервере произошла ошибка',
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
