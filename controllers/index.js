const photos = require('./photos');
const contests = require('./contests')
const admin = require('firebase-admin');

const adminCheck = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader) {
    let token = authHeader.split(' ');
    admin.auth().verifyIdToken(token[1])
      .then((userObject) => {
        res.locals.user = userObject;
        next();
      })
      .catch(err => {
        res.sendStatus(401);
      });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  photos,
  adminCheck,
  contests
};
