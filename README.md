mdstore
========================

mdstore is Malicious Domain name Store, maintainance engine of blacklisted domain name.


Example
----------

```js
var mdstore = require('mdstore');
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