import { FORBIDDEN_ERROR_CODE } from './codes';

export default class ForbidenError extends Error {
  statusCode = FORBIDDEN_ERROR_CODE;
}
