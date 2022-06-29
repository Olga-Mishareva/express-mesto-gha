const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_CODE } = process.env;

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     res.status(401).send({ message: 'Необходима авторизация' });
//     return;
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, 'secret-key');
//   } catch (err) {
//     res.status(401).send({ message: 'Необходима авторизация' });
//     return;
//   }
//   // console.log(payload);
//   req.user = payload;
//   next();
// };

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, 'some-key'); // JWT_CODE
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  console.log(payload);
  req.user = payload;
  next();
};
