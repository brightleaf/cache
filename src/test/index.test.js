const fuxor = require('fuxor')
const redis = require('ioredis-mock')
const { expect } = require('chai')
fuxor.add('ioredis', redis)

const Cache = require('../index')
describe('The cache module', () => {
  it('should set cache and get value in cache', async () => {
    const cache = new Cache()
    cache.set('test-key', { my: 'data' })
    const val = await cache.get('test-key')
    expect(val.my).to.equal('data')
  })
  it('should handle prepend set', async () => {
    const cache = new Cache({ prepend: 'testing' })
    cache.set('test-key', { my: 'data' })
    const val = await cache.get('test-key')
    expect(val.my).to.equal('data')
  })
  it('should handle no value in cache', async () => {
    const cache = new Cache()
    const val = await cache.get('test-key')
    expect(val).to.equal(undefined)
  })

  it('should accept redis config', async () => {
    const redisConfig = {
      port: 6379,
      host: '127.0.0.1',
      family: 4,
      password: 'auth',
      db: 0,
    }
    const cache = new Cache({ redis: redisConfig })
    cache.set('test-key', { my: 'data' })
    const val = await cache.get('test-key')
    expect(val.my).to.equal('data')
  })
  it('should set cache and return true when `has` is called', async () => {
    const cache = new Cache()
    cache.set('has-check', 'value')
    const doesHave = await cache.has('has-check')
    expect(doesHave).to.equal(true)
  })
  it('should return false when `has` is called and no key is set', async () => {
    const cache = new Cache()
    const doesHave = await cache.has('has-check')
    expect(doesHave).to.equal(false)
  })
  it('should set cache and return true when `has` is called then clear the cache', async () => {
    const cache = new Cache()
    cache.set('has-check', 'value')
    const doesHave = await cache.has('has-check')
    expect(doesHave).to.equal(true)
    cache.clear()
    const doesNotHave = await cache.has('has-check')
    expect(doesNotHave).to.equal(false)
  })
  it('should return true when `hasAll` is called and all keys there', async () => {
    const cache = new Cache()
    const KEY_1 = 'test-key-1'
    const KEY_2 = 'test-key-2'
    const KEY_3 = 'test-key-3'
    cache.set(KEY_1, { my: 'data' })
    cache.set(KEY_2, { my: 'data' })
    cache.set(KEY_3, { my: 'data' })
    const haveOne = await cache.hasAll([KEY_1])
    expect(haveOne).to.equal(true)
    const hasTwo = await cache.hasAll([KEY_1, KEY_2])
    expect(hasTwo).to.equal(true)
    const hasThree = await cache.hasAll([KEY_1, KEY_2, KEY_3])
    expect(hasThree).to.equal(true)
    const doesNotHave = await cache.hasAll([KEY_1, KEY_2, KEY_3, 'test-key-4'])
    expect(doesNotHave).to.equal(false)
  })
  it('should delete the value when `del` called', async () => {
    const cache = new Cache({ prepend: 'testing' })
    cache.set('test-key', { my: 'data' })
    const val = await cache.get('test-key')
    expect(val.my).to.equal('data')
    cache.delete('test-key')
    const val2 = await cache.get('test-key')
    expect(val2).to.equal(undefined)
  })
})
