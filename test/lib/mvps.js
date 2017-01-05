const mvps = require('../../lib/mvps.js');
const assert = require("power-assert");

const AVAIL_DOMAIN_NAME = 'g.zedo.com';
const NG_DOMAIN_NAME    = 'domain.not.found';

describe('mvps', () => {
  context('fetch', () => {
    const mod = new mvps();
    
    it('ok case', (done) => {
      const domain_list = [];
      mod.fetch((dname, attrib, next) => {
        domain_list.push(dname);
        next();
      }, (err) => {
        assert(domain_list.length > 0);
        done();
      });
    });
  });
});
