# Cache

Redis cache module.

```javascript
const Cache = require('@brightleaf/cache')
const cache = new Cache()

;(async () => {
  const results = await expensiveCall()
  cache.set('results', results)

  const fromCache = await cache.get('results')
})()
```

