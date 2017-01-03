mdstore
========================

mdstore is Malicious Domain name Store, maintainance engine of blacklisted domain name.


Example
----------

```js
var mdstore = require('mdstore').Redis();
mdstore.sync((err) => {
  // synced
	mdstore.has('is.the.domain.malicious.com', (err, res) => {
	  if (res) {
		  console.log('yes, the domain name is malicious one');
	  } else {
		  console.log('no, he is benign');
		}
	});
});
```



Access to Redis by CLI
-------------

Malicious domain data in redis can be accessed from CLI directly after synced.

```
$ redis-cli --raw lindex g.zedo.com 0 | node -e "process.stdin.pipe(require('msgpack-lite').createDecodeStream()).on('data', console.log);"
```
