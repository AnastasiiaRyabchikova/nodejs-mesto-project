import { NOT_FOUND_ERROR_CODE } from './codes';

export default class NotFoundError extends Error {
  statusCode = NOT_FOUND_ERROR_CODE;
}
