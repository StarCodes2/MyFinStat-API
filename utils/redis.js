import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log(`redis: ${err.message}`);
    });
    this.connect();
  }

  isAlive() {
    return this.client.isReady;
  }

  async connect() {
    await this.client.connect();
  }

  async setex(key, value, duration) {
    try {
      return await this.client.set(key, value, { EX: duration });
    } catch (err) {
      throw err;
    }
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      throw err;
    }
  }

  async del(key) {
    try {
      return await this.client.del(key);
    } catch (err) {
      throw err;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
