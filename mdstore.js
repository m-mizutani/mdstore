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
  constructor(prefs = {}, opt = {}) {
    this.port_ = opt.port;
    this.host_ = opt.host;
    this.db_   = opt.db_;
    
    const redis_opt = {
      return_buffers: true,      
    };

    const opt_list = ['host', 'port', 'db', 'path', 'url'];
    opt_list.map((key) => {
      if (opt[key] !== undefined) {
        redis_opt[key] = opt[key];
      }
    });

    this.client_ = redis.createClient(redis_opt);
    this.prefs_ = prefs;
  }

  update(callback) {
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
          return msgpack.decode(raw);
        });
        callback(null, logs);
      }
    });
  }

  all(callback) {
    this.client_.keys('*', (err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(null, res.map((r) => { return r.toString(); }));
      }
    });
  }

  flush(callback) {
    this.client_.flushdb((err, res) => {
      callback(err);
    });
  }
}
