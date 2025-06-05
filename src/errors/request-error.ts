import { REQUEST_ERROR_CODE } from './codes';

export default class RequestError extends Error {
  statusCode = REQUEST_ERROR_CODE;
}
