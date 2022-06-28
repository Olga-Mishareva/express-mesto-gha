require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // for cookie
const { NOT_FOUND } = require('./utils/constants');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser()); // for cookie

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, usersRoute);
app.use('/cards', auth, cardsRoute);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Путь не найден' });
});

app.listen(PORT);
