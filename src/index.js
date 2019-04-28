const Redis = require('ioredis')
const { mapper } = require('@kev_nz/async-tools')

const baseConfig = { prepend: 'redis-cache', redis: undefined }

class Cache {
  constructor(options) {
    const { prepend, redis } = { ...baseConfig, ...options }

    this.redis = new Redis(redis)
    this.prepend = prepend
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.has = this.has.bind(this)
    this.hasAll = this.hasAll.bind(this)
  }

  async get(key) {
    const getted = await this.redis.get(`${this.prepend}-${key}`)
    if (getted === null) {
      return Promise.resolve()
    }
    return Promise.resolve(JSON.parse(getted))
  }

  async has(key) {
    const hasr = await this.redis.exists(`${this.prepend}-${key}`)
    return hasr !== 0
  }

  delete(key) {
    return this.redis.del(`${this.prepend}-${key}`)
  }

  set(key, data) {
    return this.redis.set(`${this.prepend}-${key}`, JSON.stringify(data))
  }

  async clear() {
    return this.redis.flushall()
  }

  async hasAll(keys) {
    const mapped = await mapper(keys, key => this.has(key))
    const all = mapped.filter(r => r === true)
    return keys.length === all.length
  }
}

module.exports = Cache
