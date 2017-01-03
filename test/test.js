const mdstore = require('../index');
const should = require('should');

const AVAIL_DOMAIN_NAME = 'g.zedo.com';
const NG_DOMAIN_NAME    = 'domain.not.found';

describe('redis', () => {
  describe('basic', () => {
    const md = new mdstore.Redis();
    before('basic', (done) => {
      md.flush((err) => {
        should.not.exist(err);
        md.sync((err) => {
          should.not.exist(err);
          done();
        });
      });
    });
    
    it('found domain name', (done) => {
      md.has(AVAIL_DOMAIN_NAME, (err, res) => {
        res.should.equal(true);      
        done();
      });
    });

    it('found no domain name', (done) => {
      md.has(NG_DOMAIN_NAME, (err, res) => {
        res.should.equal(false);
        done();
      });
    });
  });

  describe('flush db', () => {
    const md = new mdstore.Redis();
    before('basic', (done) => {
      md.flush((err) => {
        should.not.exist(err);
        md.sync((err) => {
          should.not.exist(err);
          done();
        });
      });
    });

    it('find after flush', (done) => {
      md.flush((err) => {
        should.not.exist(err);
        md.has(AVAIL_DOMAIN_NAME, (err, res) => {
          res.should.equal(false);
          done();
        });
      });
    });
    
  });
});
