const Card = require('../models/card');
const {
  BAD_REQ,
  NOT_FOUND,
  SERVER_ERR,
  CREATED,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.removeCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => new Error('Not Found'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        Promise.reject(new Error('Forbidden'));
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => res.send(removedCard))
        .catch(() => res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные при удалении карточки.' });
        return;
      }
      if (err.message === 'Forbidden') {
        res.status(403).send({ message: 'Нет прав для удаления этой карточки.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные для постановки лайка.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ).send({ message: 'Переданы некорректные данные для снятия лайка.' });
        return;
      }
      if (err.message === 'Not Found') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
        return;
      }
      res.status(SERVER_ERR).send({ message: 'Ошибка по умолчанию.' });
    });
};
