const express = require('express');
const nunjucks = require('nunjucks');
const axios = require('axios');
const exec = require('child_process').exec;

/* ----
 * Conf
 * ---- */

const APP_SERVER_ENDPOINT = 'http://172.31.33.151/api/';

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
  const instance = axios.create({ baseURL: APP_SERVER_ENDPOINT });

  axios
    .all([
      instance.get('messages'),
      instance.get('gallery'),
      instance.get('json-placeholder')
    ])
    .then(axios.spread((messages, gallery, jsonPlaceholder) => {
      res.render('index.html', {
        messages: messages.data,
        gallery: gallery.data,
        jsonPlaceholder: jsonPlaceholder.data
      });
    }));
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
