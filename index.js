module.exports = process.env.AK_COLLECTION_TEST_COVERAGE ? require('./lib-cov/collection') : require('./lib/collection');
