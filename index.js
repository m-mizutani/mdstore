"use strict";

const reqest = require('request');
const redis = require('redis');
const msgpack = require('msgpack');
const async = require('async');

module.exports.Redis = class Redis {
  constructor(db, port, host) {
    this.client_ = redis.createClient(port, host);    
  }
 
  sync(callback) {
    const self = this;
    const ts = (new Date()).getTime() / 1000;
    const url = 'http://winhelp2002.mvps.org/hosts.txt';
    reqest.get(url, (err, res, body) => {
      if (err) {
        console.log('request Error:', err);
        callback();
      } else {
        const domain_list = body.split('\n').map((line) => {
          return line.split(' ');
        }).map((token) => {
          return (token.length < 2 || token[0].substr(0, 1) === '#') ?
              undefined : token[1].replace(/\s*$/, '');
        }).filter((dname) => { return dname !== undefined; });

        async.each(domain_list, (dname, next) => {
          const obj = msgpack.pack({
            source: 'mvps',
            ts: ts,
          });

          self.client_.rpush(dname, obj, (err, reply) => {
            next();
          });
        }, (err) => {
          if (err) {
            console.log('redis async error:', err);
          }
          callback();          
        });
      }
    });
  }

  has(domain, callback) {
    this.client_.lrange(domain, 0, -1, (err, res) => {
      if (err) {
        callback(err, undefined);
      } else {
        const logs = res.map((raw) => {
          return msgpack.unpack(Buffer.from(raw));
        });
        callback(undefined, (logs.length > 0));
      }
    });
  }
}

module.exports.File = class File {
  constructor(fpath) {
  }

  sync() {
  }

  
}
