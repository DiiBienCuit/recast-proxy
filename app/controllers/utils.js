// Recast will send a post request to /errors to notify
// important errors described in a json body
exports.logRecastErrors = (req, res) => {
  console.error(req.body);
  res.sendStatus(200);
}

exports.ping = (req, res) => {
  res.send('pong');
}
