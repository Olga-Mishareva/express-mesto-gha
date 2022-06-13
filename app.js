const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log('Hura!');
});
