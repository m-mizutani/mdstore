mdstore
========================

**mdstore** is Malicious Domain name Store, maintainance engine of blacklisted domain name. It downloads blacklists of domain name from major sites and save domain names to local redis server. After that, user can look up blacklisted domain name not only via the module and cli tool but also from redis server directly.


CLI usage
----------

### Setup

1. install mdstore by npm `npm install -g mdstore`
2. start redis server, e.g. `redis-server &`

### Update blacklist

`update` command downloads blacklist file from each site, parses downloaded files and store results to redis server. If the domain name already exists, append it as history.

```
$ mdstore update
update: OK
```

### Search domain

`get` command shows download history of blacklisted domain name. `source` means a site that has the blacklisted domain name. `ts` means timestamp when **downloading the blacklist file**, not blacklisted moment.

```
% mdstore get 151.ru
2017-01-06T14:44:05.347Z { source: 'hphosts', ts: 1483713845.347 }
```

### Generate /etc/hosts file

`hosts` command output a list of blacklisted domain name as `/etc/hosts` format to make own machine prevent access to a malicious host.

```
$ mdstore hosts > hosts.txt
$ sudo cp hosts.txt /etc/hosts         # Linux
$ sudo cp hosts.txt /private/etc/hosts # macOS
```


Example usage of mdstore library
----------

```js
var mdstore = require('mdstore').Redis();
mdstore.update((err) => {
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

NOTE: The author(s) of **mdstore** has no concern with usage of this module. Please read each blacklist service's Terms of Use, especially for commercial use.


Access to Redis by CLI
-------------

Malicious domain data in redis can be accessed from CLI directly after synced.

```
$ redis-cli --raw lindex g.zedo.com 0 | node -e "process.stdin.pipe(require('msgpack-lite').createDecodeStream()).on('data', console.log);"
```
