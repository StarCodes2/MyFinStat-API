// Defines the routes for each endpoint
import redisClient from '../utils/redis';

const express = require('express');
const dbConnect = require('../utils/db');

const route = express.Router();

route.get('/', (req, res) => {
  res.json({
    name: 'MyFinStat API',
    endpoints: {
      signup: '/signup',
    },
  });
});

route.get('/status', (req, res) => {
  res.json({
    redis: redisClient.isAlive(),
    mongoose: dbConnect.isConnected(),
  });
});

route.post('/signup', async (req, res) => {
  await UserController.createUser(req, res);
});

module.exports = route;
