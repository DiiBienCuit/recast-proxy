require('dotenv').config();

const https = require('https');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// special https agent - ignore unauthenticated requests
// necessary to circumvent Hana not having SSL installed
const agent = new https.Agent({
  rejectUnauthorized: false
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Recast will send a post request to /errors to notify
// important errors described in a json body
app.post('/errors', (req, res) => {
  console.error(req.body);
  res.sendStatus(200);
});

app.post('/employees/manager', (req, res) => {
  const name = _.chain(req.body)
    .get('conversation.memory.name.value')
    .capitalize()
    .value();

  const surname = _.chain(req.body)
    .get('conversation.memory.surname.value')
    .capitalize()
    .value();

  axios
    .get(`${process.env.XSA_ENDPOINT}?name=${name}&surname=${surname}`, {
      httpsAgent: agent
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error('err');
      res.send(`Error (${err.status}): ${err.statusText}`);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`App started on port ${process.env.PORT}`);
});
