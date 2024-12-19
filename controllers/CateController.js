const AuthController = require('../controllers/AuthController');
const Category = require('../models/Category');
const dbClient = require('../utils/db');

class CateController {
  static async createCategory(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;
    const { name } = req.body;

    try {
      const exist = await dbClient.getCateByName(name);
      if (exist) {
        return res.status(400).json({ error: 'Category already exist' });
      }

      const cate =  new Category({ name, userId: user._id });
      await cate.save();

      return res.status(201).json({ id: cate._id, status: 'Category Created' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Inernal Server Error' });
    }
  }

  static async getCategories(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;

    const cates = await dbClient.getCatesByUserId(user._id);
    if (!cates.length) {
      return res.status(404).json({ error: 'No Categories' });
    }

    return res.status(201).json(cates);
  }
}

module.exports = CateController;
