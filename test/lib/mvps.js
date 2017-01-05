const mvps = require('../../lib/mvps.js');
const assert = require("power-assert");

const opt = {
  url: 'https://raw.githubusercontent.com/m-mizutani/mdstore/master/test/data/mvps.txt',
};

describe('mvps', () => {
  context('fetch', () => {
    it('ok case', function(done) {
      const mod = new mvps(opt);
      const domain_list = [];
      mod.fetch((dname, attrib, next) => {
        domain_list.push(dname);
        next();
      }, (err) => {
        assert(domain_list.length === 4);
        done();
      });
    });

    it('ng case', function(done) {
      const bad_opt = {
        url: 'https://raw.githubusercontent.com/m-mizutani/mdstore/master/test/data/not-found.txt',
      };
      const mod = new mvps(bad_opt);
      const domain_list = [];
      mod.fetch((dname, attrib, next) => {
        domain_list.push(dname);
        next();
      }, (err) => {
        assert(domain_list.length === 0);
        assert(err !== null);
        done();
      });
    });
    
  });
});
