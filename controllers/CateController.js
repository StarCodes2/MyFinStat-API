const AuthController = require('./AuthController');
const Category = require('../models/Category');
const dbClient = require('../utils/db');

class CateController {
  static async createCategory(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;
    const { name } = req.body;

    try {
      const exist = await dbClient.getCateByName(userId, name);
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
    const { cateId } = req.params;
    if (!cateId) {
      return res.status(400).json({ error: 'Missing category id' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing category name' });
    }

    try {
      await dbClient.updateCate(cateId, name);
      return res.status(200).json({ status: 'Updated' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteCategory(req, res) {
    const user = await AuthController.checkConnection(req, res);
    if (!user) return user;
    const { cateId } = req.params;
    if (!cateId) {
      return res.status(400).json({ error: 'Missing category id' });
    }

    try {
      await dbClient.deleteCate(user._id.toString(), cateId);

      return res.status(200).json({ status: 'Deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = CateController;
