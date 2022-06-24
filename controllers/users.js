const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  BAD_REQ,
  NOT_FOUND,
  SERVER_ERR,
  CREATED,
} = require('../constants/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при запросе пользователя.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!validator.isEmail(email)) {
    const err = new Error('не емайл'); // сейчас не работает, надо try ... catch
    err.name = 'ValidationError';
    throw err;
  }

  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => {
      console.log(user);
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
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
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
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
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};
