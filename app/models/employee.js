require('dotenv').config();
const https = require('https');
const axios = require('axios');

/**
 * 
 * @param {String} name    : the employee's name
 * @param {String} surname : the employee's surname
 */
exports.getManager = (name, surname) => {
  // use a special special https agent to ignore unauthenticated requests -
  // necessary to circumvent Hana not having SSL installed
  return axios.get(
    `${process.env.XSA_ENDPOINT}?name=${name}&surname=${surname}`,
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    }
  );
};
