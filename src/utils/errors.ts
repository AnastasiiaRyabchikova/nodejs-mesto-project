import { Error } from 'mongoose';

export const getValidationErrorString = (error: Error.ValidationError): string => {
  const errorString = Object.values(error.errors)
    .map(({ message }: { message: string }) => message).join(' ');
  return `Ошибка валидации: ${errorString}`;
};

export default {
  getValidationErrorString,
};
