const mdstore = require('../index');
const should = require('should');

describe('redis', () => {
  const md = new mdstore.Redis();
  before('basic', (done) => {
    md.sync((err) => {
      should.not.exist(err);
      done();
    });
  });
  
  it('found domain name', (done) => {
    md.has('g.zedo.com', (err, res) => {
      res.should.equal(true);      
      done();
    });
  });

  it('found no domain name', (done) => {
    md.has('domain.not.found', (err, res) => {
      res.should.equal(false);
      done();
    });
  });  
});
