const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// мидлвер для добавления owner id при создании карточек
app.use((req, res, next) => {
  req.user = {
    _id: '62a715d28ff2a35fe6bb6872',
  };
  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT);
