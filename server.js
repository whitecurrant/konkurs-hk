require('log-timestamp');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const admin = require("firebase-admin");

const http = require('http');
const port = parseInt(process.env.PORT, 10) || 3003;
const app = express();
const server = http.createServer(app);

const serviceAccount = require("./firebase_admin_config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://konkurs-kalendarzowy-hk.firebaseio.com"
});

app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(fileUpload());


app.use(bodyParser.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('Client/build'));
}
require('./routes')(app);
app.all('*', (req, res) => res.status(404).send());


server.listen(port);

module.exports = app;
