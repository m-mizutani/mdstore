"use strict";

const reqest = require('request');
const async = require('async');

module.exports = class DNSBH {
  constructor(pref = {}) {
    this.url_ = pref.url || 'http://mirror1.malwaredomains.com/files/domains.txt'
  }

  fetch(recv, done) {
    const self = this;

    reqest.get(self.url_, (err, res, body) => {
      if (err) {
        console.log('request Error:', err);
        done(err);
      } else if (res.statusCode !== 200) {
        done(`HTTP Error: ${res.statuscode}, ${body}`);
      } else {

        const ts = (new Date()).getTime() / 1000;
        const ptn = /^\t\t(\S+)\t(\S+)\t(\S+)(.*)\s*/;
        const domain_list = body.split('\n').map((line) => {
          const m = ptn.exec(line)
          if (m === null) {
            if (line.substr(0, 1) !== '#' && !(line =~ /^\s*$/)) {
              console.warn('not match:', line);
            }
            return undefined;
          } else {
            const obj = {
              ts: ts,
              domain: m[1],
              reason: m[2],
              source: 'dnsbh',
              original: m[3],
              history: m[4].split('\t').slice(1),
            };

            return obj;
          }
        }).filter((dname) => { return dname !== undefined; });

        async.each(domain_list, (obj, next) => {
          recv(obj.domain, obj, () => {
            next();
          });
        }, (err) => {
          if (err) {
            console.log('redis async error:', err);
          }
          done(err);
        });
      }
    });
  }
};

