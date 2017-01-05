const mdstore = require('../mdstore');
const assert = require("power-assert");

const AVAIL_DOMAIN_NAME = 'g.zedo.com';  // from MVPS
const NG_DOMAIN_NAME    = 'domain.not.found';

describe('redis', () => {
  context('basic', () => {
    const md = new mdstore.Redis();
    before('basic', (done) => {
      md.flush((err) => {
        assert(err === null);
        md.sync((err) => {
          assert(err === null);
          done();
        });
      });
    });
    
    it('found no domain name', (done) => {
      md.has(NG_DOMAIN_NAME, (err, res) => {
        assert(err === null);
        assert(res === false);
        done();
      });
    });

    it('get domain name (MVPS)', (done) => {      
      md.get('g.zedo.com', (err, res) => {
        assert(err === null);
        assert(res.length > 0);
        done();
      });
    });

    it('get domain name (dnsbh)', (done) => {      
      md.get('spaceconstruction.com.au', (err, res) => {
        assert(err === null);
        assert(res.length > 0);
        done();
      });
    });
  });

  context('flush db', () => {
    const md = new mdstore.Redis();
    before('basic', (done) => {
      md.flush((err) => {
        assert(err === null);
        md.sync((err) => {
          assert(err === null);
          done();
        });
      });
    });

    it('find after flush', (done) => {
      md.flush((err) => {
        assert(err === null);
        md.has(AVAIL_DOMAIN_NAME, (err, res) => {
          assert(err === null);
          assert(res === false);
          done();
        });
      });
    });
    
  });
});
