const hphosts = require('../../lib/hphosts.js');
const assert = require("power-assert");

const opt = {
  url: 'https://raw.githubusercontent.com/m-mizutani/mdstore/master/test/data/hphosts.zip',
};

describe('hphosts', () => {
  context('fetch', () => {
    it('ok case', function(done) {
      const mod = new hphosts(opt);
      const domain_list = [];
      mod.fetch((dname, attrib, next) => {
        domain_list.push(dname);
        next();
      }, (err) => {
        assert(err === null);
        assert(domain_list.length === 6);
        assert(domain_list.indexOf('localhost') >= 0);
        assert(domain_list.indexOf('hphost-test.example.com') >= 0);
        assert(domain_list.indexOf('hphost-test.example.io') >= 0);
        done();
      });
    });

    it('ng case', function(done) {
      const bad_opt = {
        url: 'https://raw.githubusercontent.com/m-mizutani/mdstore/master/test/data/not-found.txt',
      };
      const mod = new hphosts(bad_opt);
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
