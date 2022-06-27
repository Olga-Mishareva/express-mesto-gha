const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('./constants/constants');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// мидлвер для добавления owner id при создании карточек
// app.use((req, res, next) => {
//   req.user = {
//     _id: '62a715d28ff2a35fe6bb6872',
//   };
//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, usersRoute);
app.use('/cards', auth, cardsRoute);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Путь не найден' });
});

app.listen(PORT);
