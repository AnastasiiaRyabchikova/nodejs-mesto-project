import mongoose from 'mongoose';
import ICard from '../types/entities/card';

const { Schema } = mongoose;

const cardSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    maxLength: [30, 'Поле "Имя" не может быть меньше 30 символов'],
    minLength: [2, 'Поле "Имя" не может быть короче 2 символов'],
  },
  link: {
    type: String,
    required: [true, 'Ссылка обязательна'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
});

export default mongoose.model<ICard>('card', cardSchema);
