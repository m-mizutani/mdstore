mdstore
========================

**mdstore** is Malicious Domain name Store, maintainance engine of blacklisted domain name.


Example
----------

```js
var mdstore = require('mdstore').Redis();
mdstore.sync((err) => {
  // synced
	mdstore.has('is.the.domain.malicious.com', (err, res) => {
	  if (res) {
		  console.log('yes, the domain name is malicious');
	  } else {
		  console.log('no, this is benign');
		}
	});
});
```

Supporting Blacklists
----------

- **DNS-BH – Malware Domain Blocklist**: [BH DNS Files](http://www.malwaredomains.com/?page_id=66)
- **MVPS**: [Blocking Unwanted Connections with a Hosts File](http://winhelp2002.mvps.org/hosts.htm)


Access to Redis by CLI
-------------

Malicious domain data in redis can be accessed from CLI directly after synced.

```
$ redis-cli --raw lindex g.zedo.com 0 | node -e "process.stdin.pipe(require('msgpack-lite').createDecodeStream()).on('data', console.log);"
```
