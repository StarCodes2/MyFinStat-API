import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async connect(req, res) {
    const authHeader = req.headers.auth;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const b64Cred = authHeader.split(' ')[1];
    const cred = Buffer.from(b64Cred, 'base64').toString('ascii');
    const [email, password] = cred.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unathorized' });
    }

    try {
      const user = await dbClient.findUser({ email });
      const hashedPassword = sha1(password);

      if (!user || user.password !== hashedPassword) {
        return res.status(401).json({ error: 'Unathorized' });
      }

      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.setex(key, user._id.toString(), 60 * 60 * 24);

      return res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async checkConnection(req, res) {
    const token = req.headers['auth-token'];
    if (!token) {
      res.status(401).json({ error: 'Unathorized' });
      return null;
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        res.status(401).json({ error: 'Unathorized' });
        return null;
      }

      const user = await dbClient.findUser({ _id: userId });
      if (!user) {
        res.status(401).json({ error: 'Unathorized' });
        return null;
      }

      return user;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return null;
    }
  }

  static async disconnect(req, res) {
    const token = req.headers['auth-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unathorized' });
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).json({ error: 'Unathorized' });
      }

      await redisClient.del(`auth_${token}`);
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AuthController;
