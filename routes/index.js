const photoController = require('../controllers').photos;
const adminCheck = require('../controllers').adminCheck;
const contestController = require('../controllers').contests;
const CacheControl = require('express-cache-control');

const cache = new CacheControl().middleware

module.exports = (app) => {

  app.get('/api/photos', cache('minutes', 1), photoController.list);
  app.get('/api/results', adminCheck, photoController.listAdmin);
  app.post('/api/vote', photoController.vote);
  app.post('/api/contest', adminCheck, contestController.create)

};
