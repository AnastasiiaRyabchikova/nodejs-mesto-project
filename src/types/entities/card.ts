import { Types } from 'mongoose';

export default interface ICard {
  name: String,
  link: String,
  createdAt: Date,
  owner: Types.ObjectId,
  likes: Types.ObjectId[],
}
