const express = require('express');
const nunjucks = require('nunjucks');
const axios = require('axios');
const exec = require('child_process').exec;

/* ----
 * Conf
 * ---- */

const APP_SERVER_URL = 'http://172.31.33.151/api/';
const INSTANCE_METADATA_URL = 'http://169.254.169.254/latest/meta-data/';

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
  const appServer = axios.create({ baseURL: APP_SERVER_URL });
  const instanceMetadata = axios.create({ baseUrl: INSTANCE_METADATA_URL});

  axios
    .all([
      instanceMetadata.get('public-hostname'),
      appServer.get('messages'),
      appServer.get('gallery'),
      appServer.get('json-placeholder')
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
