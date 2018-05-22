require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Recast will send a post request to /errors to notify important errors
// described in a json body
app.post('/errors', (req, res) => {
  console.error(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.post('/employees/manager', (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.send(JSON.stringify(req.body, null, 2));
});

app.listen(process.env.PORT, () =>
  console.log(`App started on port ${process.env.PORT}`)
);