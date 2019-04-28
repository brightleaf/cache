# Cache

[![npm version](https://badge.fury.io/js/%40brightleaf%2Fcache.svg)](https://badge.fury.io/js/%40brightleaf%2Fcache)

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

