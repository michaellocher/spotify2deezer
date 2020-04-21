const express = require('express');
const s2d = require('./index');
const app = express();

app.get('/', async (req, res) => {
  if (!req.query.url) {
    return res.status(404).json({
      error: 'Missing property url!',
    });
  }
  return res.json(await s2d.convert(req.query.url));
});

app.listen(3000);
