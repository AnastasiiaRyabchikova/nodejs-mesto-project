import { INTERNAL_SERVER_ERROR_CODE } from './codes';

export default class InteranlServerError extends Error {
  statusCode = INTERNAL_SERVER_ERROR_CODE;
}
