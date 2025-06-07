import { celebrate, Segments, Joi } from 'celebrate';

export const validateAvatarString = (value: string) => {
  const reg = /^(https?:\/\/)(www\.)?([\w-]+\.)+[a-z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?(#)?$/i;
  const match = value.match(reg);
  return match !== null && match[3] !== 'www.';
};

export const validateUid = () => Joi.string().hex().length(24).required();

export const validateCreationUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom((value, helpers) => {
      if (validateAvatarString(value)) {
        return value;
      }

      return helpers.error('any.invalid');
    }, 'custom avatar validation'),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const validateLiginUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().custom((value, helpers) => {
      if (validateAvatarString(value)) {
        return value;
      }

      return helpers.error('any.invalid');
    }, 'custom avatar validation'),
  }),
});

export const validateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (validateAvatarString(value)) {
        return value;
      }

      return helpers.error('any.invalid');
    }, 'custom avatar validation'),
  }),
});

export const validateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
});

export default {
  validateAvatar,
  validateUid,
  validateCard,
  validateCreationUser,
  validateUpdateUser,
};
