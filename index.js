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
  const employeeName = _.chain(req.body)
    .get('conversation.memory.name.value')
    .capitalize()
    .value();

  const employeeSurname = _.chain(req.body)
    .get('conversation.memory.surname.value')
    .capitalize()
    .value();

  axios
    .get(`${process.env.XSA_ENDPOINT}?name=${employeeName}&surname=${employeeSurname}`, {
      httpsAgent: agent
    })
    .then((response) => {
      // conveniently avoid (for demo purposes!) cases where more than
      // one amployees have the same name, surname but different managers
      const managerName = _.get(response.data[0], 'NAME');
      const managerSurname = _.get(response.data[0], 'SURNAME');

      const message = [{ // message to send back to Recast
        type: 'quickReplies',
        content: {
          title: response.data && response.data.length > 0
            ? `The manager of ${employeeName} ${employeeSurname} is ${managerName} ${managerSurname}`
            : `${employeeName} ${employeeSurname} is a strong independent person that needs no manager! ;-)`
        }
      }];

      res.send(message);
    })
    .catch((err) => {
      console.error('err');
      res.send(`Error (${err.status}): ${err.statusText}`);
    });
});

app.listen(process.env.PORT, () => {
  console.log(`App started on port ${process.env.PORT}`);
});
