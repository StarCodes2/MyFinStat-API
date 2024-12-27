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

    try {
      const cates = await dbClient.getCatesByUserId(user._id);
      if (!cates.length) {
        return res.status(404).json({ error: 'No Categories' });
      }

      return res.status(201).json(cates);
    } catch (err) {
      console.error(err);
      return res.static(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateCategory(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;
    const { id, name } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Missing category id' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Missing category name' });
    }

    try {
      await dbClient.updateCate(id, name);
      return res.status(200).json({ status: 'Updated' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async delCategory(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;
    const { id } = req.body;

    try {
      await dbClient.deleteCate(id);

      return res.static(204).json({ status: 'Deleted' });
    } catch (err) {
      console.error(err);
      return res.static(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = CateController;
