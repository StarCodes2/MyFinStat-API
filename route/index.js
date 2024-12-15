// Defines the routes for each endpoint
const express = require('express');

const route = express.Router();

route.get('/', (req, res) => {
  res.json({
    name: 'MyFinStat API',
    endpoints: {
      signup: '/signup',
    },
  });
});

module.exports = route;
