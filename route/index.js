// Defines the routes for each endpoint
import redisClient from '../utils/redis';

const express = require('express');
const dbConnect = require('../utils/db');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const CateController = require('../controllers/CateController');
const TranController = require('../controllers/TranController');

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

route.get('/connect', async (req, res) => {
  await AuthController.connect(req, res);
});

route.get('/disconnect', async (req, res) => {
  await AuthController.disconnect(req, res);
});

route.get('/me', async (req, res) => {
  await UserController.getMe(req, res);
});

route.post('/category', async (req, res) => {
  await CateController.createCategory(req, res);
});

route.get('/category', async (req, res) => {
  await CateController.getCategories(req, res);
});

route.put('/category/:cateId', async (req, res) => {
  await CateController.updateCategory(req, res);
});

route.delete('/category/:cateId', async (req, res) => {
  await CateController.deleteCategory(req, res);
});

route.post('/transaction', async (req, res) => {
  await TranController.createTransaction(req, res);
});

route.get('/transaction', async (req, res) => {
  await TranController.getTransactions(req, res);
});

route.put('/transaction/:tranId', async (req, res) => {
  await TranController.updateTransaction(req, res);
});

route.delete('/transaction/:tranId', async (req, res) => {
  await TranController.deleteTransaction(req, res);
});

module.exports = route;
