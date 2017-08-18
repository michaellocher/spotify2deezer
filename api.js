const express = require('express');
const s2d = require('./index');
const app = express();

app.get('/', (req, res) => {
  if (!req.query.url) {
    return res.status(404).json({
      error: 'Missing property url!',
    });
  }
  return s2d.convert(req.query.url)
  .then(result => res.json(result));
});

app.listen(3000);
