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

- **DNS-BH – Malware Domain Blocklist**: [BH DNS Files](http://www.malwaredomains.com/?page_id=66), [Terms of Use](http://www.malwaredomains.com/?page_id=1508)
- **MVPS**: [Blocking Unwanted Connections with a Hosts File](http://winhelp2002.mvps.org/hosts.htm)
- **hpHosts**: [Download](https://hosts-file.net/?s=Download), [End User Licence Agreement](https://hosts-file.net/download/eula.txt)

NOTE: The author(s) of the module has no concern with usage of this module. Please read each blacklist service's Terms of Use, particularly for commercial use.


Access to Redis by CLI
-------------

Malicious domain data in redis can be accessed from CLI directly after synced.

```
$ redis-cli --raw lindex g.zedo.com 0 | node -e "process.stdin.pipe(require('msgpack-lite').createDecodeStream()).on('data', console.log);"
```
