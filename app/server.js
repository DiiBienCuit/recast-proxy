const controllers = require('./controllers');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/ping', controllers.utils.ping);
app.post('/errors', controllers.utils.logRecastErrors);
app.post('/employees/manager', controllers.employee.getManager);

module.exports = app;
