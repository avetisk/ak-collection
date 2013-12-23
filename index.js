module.exports = process.env.TEST_COVERAGE ? require('./lib-cov/collection') : require('./lib/collection');
