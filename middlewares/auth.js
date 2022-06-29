const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     res.status(401).send({ message: 'Необходима авторизация' });
//     return;
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(
//      token,
//      'ca18bc04497261456f689f0693cbc10609a66e49e88ebe23f9e2b48483616894',
//   );
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
    payload = jwt.verify(
      token,
      'ca18bc04497261456f689f0693cbc10609a66e49e88ebe23f9e2b48483616894',
    );
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
