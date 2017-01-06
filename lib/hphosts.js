"use strict";

const request = require('request');
const async = require('async');
const zip = require('adm-zip');

module.exports = class hpHosts {
  constructor(pref = {}) {
    this.url_ = pref.url || 'http://hosts-file.malwareteks.com/hosts.zip';
  }

  fetch(recv, done) {
    const self = this;
    const opt = {
      uri: self.url_,
      encoding: null,
    };

    request.get(opt, (err, res, body) => {
      if (err) {
        console.log('request Error:', err);
        done(err);
      } else if (res.statusCode !== 200) {
        done(`HTTP Error: ${res.statuscode}, ${body}`);
      } else {
        const ts = (new Date()).getTime() / 1000;

        const buf = Buffer(body);
        const z = new zip(buf);
        const entries = z.getEntries();

        const tgt = entries.filter((e) => {
          return (e.entryName === 'hosts.txt');
        });

        const ptn = /^\S+\t(\S+)\s.*/;
        if (tgt.length !== 1) {
          const fnames = entries.map((e) => { return e.entryName; }).join(', ');
          done(`no hosts.txt: only ${fnames} exist`);
        } else {
          const list = tgt[0].getData().toString()
                .split('\n')
                .map(line => { return ptn.exec(line); })
                .filter(m => { return m !== null; })
                .map(m => { return m[1]; });
 
          async.each(list, (dname, next) => {
            const attrib = {
              source: 'hphosts',
              ts: ts,
            };
            recv(dname, attrib, next);
          }, done);
        }
      }
    });
  }
};
