require('dotenv').config();
const _ = require('lodash');
const employee = require('../models/employee');

/**
 * Receive POST requests from Recast with employee name and surname data,
 * query Hana and reply with the employee manager's name and surname
 */
exports.getManager = (req, res) => {
  // capitalize names and surnames - support strings
  // separated by space or '-', e.g. Jean-Claude Van Damme
  const employeeName = _.chain(req.body)
    .get('conversation.memory.name.value')
    .split(/[\s,-]+/)
    .map(s => _.capitalize(s))
    .value()
    .join(' ');

  const employeeSurname = _.chain(req.body)
    .get('conversation.memory.surname.value')
    .split(/[\s,-]+/)
    .map(s => _.capitalize(s))
    .value()
    .join(' ');

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Received POST request with employeeName = ${employeeName} and employeeSurname = ${employeeSurname}`
    );
  }

  employee
    .getManager(employeeName, employeeSurname)
    .then(response => {
      // init message to send back to Recast
      const reply = { replies: [{ type: 'text', content: '' }] };

      // conveniently avoid (for demo purposes!) cases where more than
      // one amployees have the same name, surname but different managers
      const managerName = _.get(response.data[0], 'NAME');
      const managerSurname = _.get(response.data[0], 'SURNAME');

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `Found manager name = ${managerName} and surname = ${managerSurname}`
        );
      }

      if (!(managerName && managerSurname)) {
        reply.replies[0].content = `Could not find any employee called ${employeeName} ${employeeSurname}`;
      } else if (response.data && response.data.length > 0) {
        reply.replies[0].content = `The manager of ${employeeName} ${employeeSurname} is ${managerName} ${managerSurname}`;
      } else {
        reply.replies[0].content = `${employeeName} ${employeeSurname} has no manager! ;-)`;
      }

      res.send(reply);
    })
    .catch(err => {
      console.error(err);
      res.send(`Error (${err.status}): ${err.statusText}`);
    });
};
