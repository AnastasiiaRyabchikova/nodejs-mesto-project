import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import IUser from '../types/entities/user';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    maxLength: [30, 'Поле  "Имя" не может быть длинее 30 символов.'],
    minLength: [2, 'Поле  "Имя" не может быть короче 2-ух символов.'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: [2, 'Поле "О себе" не может быть короче 2-ух символов.'],
    maxLength: [200, 'Поле  "Имя" не может быть длинее 200 символов.'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value: string) => {
        const reg = /^(https?:\/\/)(www\.)?([\w-]+\.)+[a-z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/i;
        const match = value.match(reg);
        return match !== null && match[3] !== 'www.';
      },
      message: ({ value }: { value: string }) => `${value} не может быть аватаром`,
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "Пароль" обязательно к заполнению.'],
    select: false,
  },
  email: {
    type: String,
    required: [true, 'Поле "Почта" обязательно к заполнению.'],
    unique: true,
    validate: {
      validator: (value: string) => (
        isEmail(value)
      ),
      message: ({ value }: { value: string }) => `${value} не валидная почта`,
    },
  },
});

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUser>('user', userSchema);
