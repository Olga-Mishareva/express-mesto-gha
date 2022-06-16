const Card = require('../models/card');

const BAD_REQ = 400;
const NOT_FOUND = 404;
const CAST_ERR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: { _id: req.user._id } })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: { _id: req.user._id } } },
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      console.log(err.name);
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: { _id: req.user._id } } },
    { new: true },
  )
    .then((dislike) => res.send(dislike))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные для снятия лайка.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      console.log(err.name);
      res.status(CAST_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};
