require('dotenv').config();
const server = require('./server');

const port = parseInt(process.env.PORT, 10) || 5001;

server.listen(port, () => {
  console.log(`App started on port ${port}`);
});
