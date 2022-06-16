const User = require('../models/user');

const BAD_REQ = 400;
const NOT_FOUND = 404;
const CAST_ERR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // upsert: true, - если не найден, будет создан новый пользователь
    .orFail(() => new Error('Not Found'))
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      console.log(err.name);
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('Not Found'))
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};
