const express = require('express');
const nunjucks = require('nunjucks');
const axios = require('axios');
const exec = require('child_process').exec;

/* ----
 * Conf
 * ---- */

const APP_SERVER_URL = 'http://internal-lb-internal-1741190360.ap-south-1.elb.amazonaws.com/api/';

/* ----
 * App
 * ---- */

const app = express();

app.set('view engine', 'nunjucks');

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

/* ------
 * Routes
 * ------ */

app.get('/', (req, res) => {
  const instance = axios.create({ baseURL: APP_SERVER_URL });

  axios
    .all([
      axios.get('http://169.254.169.254/latest/meta-data/public-hostname'),
      instance.get('messages'),
      instance.get('gallery'),
      instance.get('json-placeholder')
    ])
    .then(axios.spread((hostname, messages, gallery, jsonPlaceholder) => {
      res.render('index.html', {
        hostname: hostname.data,
        messages: messages.data,
        gallery: gallery.data,
        jsonPlaceholder: jsonPlaceholder.data
      });
    }));
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
