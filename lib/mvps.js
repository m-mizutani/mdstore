"use strict";

const reqest = require('request');
const async = require('async');

module.exports = class MVPS {
  constructor(pref = {}) {
    this.url_ = pref.url || 'http://winhelp2002.mvps.org/hosts.txt';
  }

  fetch(recv, done) {
    const self = this;

    reqest.get(self.url_, (err, res, body) => {
      if (err) {
        console.log('request Error:', err);
        done(err);
      } else {
        const ts = (new Date()).getTime() / 1000;

        const domain_list = body.split('\n').map((line) => {
          return line.split(' ');
        }).map((token) => {
          return (token.length < 2 || token[0].substr(0, 1) === '#') ?
              undefined : token[1].replace(/\s*$/, '');
        }).filter((dname) => { return dname !== undefined; });


        async.each(domain_list, (dname, next) => {
          const attrib = {
            source: 'mvps',
            ts: ts,
          };
          recv(dname, attrib, () => {
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
