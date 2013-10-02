var crypto = require('crypto');
var md5hash = crypto.createHash('md5');
md5hash.update('azki@azki.org');
var result = md5hash.digest('hex');
console.log(result);
// f8461e7b9e2d2a6723444b775fbfbaf6