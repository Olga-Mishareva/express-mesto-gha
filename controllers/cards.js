const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    // .populate(['name'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: { _id: req.user._id } })
  // Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => Error('Карточка с указанным _id не найдена'))
    .then((card) => res.send(card))
    .catch((err) => res.status(404).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: { _id: req.user._id } } },
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: { _id: req.user._id } } },
    { new: true },
  )
    .then((dislike) => res.send(dislike))
    .catch((err) => res.status(500).send({ message: err.message }));
};
