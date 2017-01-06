"use strict";

const reqest = require('request');
const redis = require('redis');
const msgpack = require('msgpack-lite');
const async = require('async');

const mdstore_modules = {
  mvps:  require('./lib/mvps'),
  dnsbh: require('./lib/dnsbh'),
  hphosts: require('./lib/hphosts'),
};

module.exports.Redis = class Redis {
  constructor(prefs = {}, db, port, host) {
    this.client_ = redis.createClient(port, host);
    this.prefs_ = prefs;
  }

  sync(callback) {
    const self = this;

    const modules = Object.keys(mdstore_modules).map((mod_name) => {
      const opt = self.prefs_[mod_name] || {};
      return new mdstore_modules[mod_name](opt);
    });

    const errmsg = [];
    async.each(modules, (mod, next) => {
      // console.log('run', mod);

      mod.fetch((dname, attrib, done) => {
        self.client_.rpush(dname, msgpack.encode(attrib), (err, reply) => {
          done();
        });
      }, (err) => {
        // console.log('done:', mod);
        if (err) {
          errmsg.push(err);
        }
        next();
      });

    }, (err) => {
      // console.log('done');

      if (err) {
        callback(err);
      } else if (errmsg.length > 0) {
        callback(errmsg.join(', '));
      } else {
        callback(null);
      }
    });
  }

  has(domain, callback) {
    this.client_.lrange(domain, 0, -1, (err, res) => {
      if (err) {
        callback(err, undefined);
      } else {
        const logs = res.map((raw) => {
          return msgpack.decode(Buffer.from(raw));
        });
        callback(null, (logs.length > 0));
      }
    });
  }

  get(domain, callback) {
    this.client_.lrange(domain, 0, -1, (err, res) => {
      if (err) {
        callback(err, undefined);
      } else {
        const logs = res.map((raw) => {
          return msgpack.decode(Buffer.from(raw));
        });
        callback(null, logs);
      }
    });
  }

  flush(callback) {
    this.client_.flushdb((err, res) => {
      callback(err);
    });
  }
}

module.exports.File = class File {
  constructor(fpath) {
  }

  sync() {
  }
}
