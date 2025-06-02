import mongoose from 'mongoose';
import IUser from '../types/entities/user';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Поле "Имя" обязательно к заполнению.'],
    maxLength: [30, 'Поле  "Имя" не может быть длинее 30 символов.'],
    minLength: [2, 'Поле  "Имя" не может быть короче 2-ух символов.'],
  },
  about: {
    type: String,
    required: [true, 'Поле "О себе" обязательно к заполнению.'],
    minLength: [2, 'Поле "О себе" не может быть короче 2-ух символов.'],
    maxLength: [200, 'Поле  "Имя" не может быть длинее 200 символов.'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "Аватар" обязательно к заполнению.'],
  },
});

export default mongoose.model<IUser>('user', userSchema);
