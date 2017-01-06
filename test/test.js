const mdstore = require('../mdstore');
const assert = require("power-assert");

const AVAIL_DOMAIN_NAME = 'g.zedo.com';  // from MVPS
const NG_DOMAIN_NAME    = 'domain.not.found';

const data_url = 'https://raw.githubusercontent.com/m-mizutani/mdstore/master/test/data/';
const dummy = {
  mvps: { url: data_url + 'mvps.txt' },
  dnsbh: { url: data_url + 'dnsbh.txt' },
  hphosts: { url: data_url + 'hphosts.zip' },
};

describe('redis', () => {
  context('with real site', () => {
    const md = new mdstore.Redis();
    before('basic', (done) => {
      md.flush((err) => {
        assert(err === null);
        md.update((err) => {
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

    it('get domain name (hpHosts)', (done) => {      
      md.get('0099virus.xyz', (err, res) => {
        assert(err === null);
        assert(res.length > 0);
        done();
      });
    });    
  });

  context('with dummy data', () => {
    const md = new mdstore.Redis(dummy);
    before('basic', (done) => {
      md.flush((err) => {
        assert(err === null);
        md.update((err) => {
          assert(err === null);
          done();
        });
      });
    });
    
    it('get domain name (MVPS dummy)', (done) => {
      md.get('this.is.test.domain.com', (err, res) => {
        assert(err === null);
        assert(res.length > 0);
        done();
      });
    });

    it('get domain name (dnsbh dummy)', (done) => {      
      md.get('oreore.example.com', (err, res) => {
        assert(err === null);
        assert(res.length > 0);
        done();
      });
    });

    it('get domain name (hpHosts dummy)', (done) => {      
      md.get('hphost-test.example.com', (err, res) => {
        assert(err === null);
        assert(res.length > 0);
        done();
      });
    });    
  });

  
  context('flush db', () => {
    const md = new mdstore.Redis(dummy);
    before('basic', (done) => {
      md.flush((err) => {
        assert(err === null);
        md.update((err) => {
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
