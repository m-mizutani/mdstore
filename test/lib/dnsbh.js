const dnsbh = require('../../lib/dnsbh.js');
const assert = require("power-assert");

const opt = {
  url: 'https://raw.githubusercontent.com/m-mizutani/mdstore/master/test/data/dnsbh.txt',
};

describe('dnsbh', () => {
  context('fetch', () => {
    it('ok case', function(done) {
      const mod = new dnsbh(opt);
      const domain_list = [];
      mod.fetch((dname, attrib, next) => {
        domain_list.push(dname);
        next();
      }, (err) => {
        assert(domain_list.length === 3);
        assert(domain_list.indexOf('oreore.example.com') >= 0);
        assert(domain_list.indexOf('korekore.example.org') >= 0);
        assert(domain_list.indexOf('hoge.example.net') >= 0);

        done();
      });
    });

    it('ng case', function(done) {
      const bad_opt = {
        url: 'https://raw.githubusercontent.com/m-mizutani/mdstore/master/test/data/not-found.txt',
      };
      const mod = new dnsbh(bad_opt);
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
