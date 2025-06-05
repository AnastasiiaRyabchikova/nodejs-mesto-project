import { DUBLICATE_ERROR_CODE } from './codes';

export default class DublicateError extends Error {
  statusCode = DUBLICATE_ERROR_CODE;
}
