import 'mongoose';

declare module 'mongoose' {
  export interface MongooseError {
    code?: number;
  }
}
