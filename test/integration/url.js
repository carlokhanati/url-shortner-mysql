const dotenv = require('dotenv');

dotenv.config({ silent: true });
const superagent = require('superagent');
const expect = require('chai').expect;
const URL_HOST = process.env.URL_HOST;

describe('Test url link', () => {
  // it('Should return 200', (done) => {
  //   superagent.get(`${URL_HOST}/url`)
  //     .end((e, res) => {
  //       expect(res.status).to.be.equal(200);
  //       done();
  //     });
  // });
});
