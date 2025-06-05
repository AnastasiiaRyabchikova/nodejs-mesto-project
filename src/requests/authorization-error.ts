import { AUTHORIZATION_ERROR_CODE } from './codes';

export default class AuthorizationError extends Error {
  statusCode = AUTHORIZATION_ERROR_CODE;
}
