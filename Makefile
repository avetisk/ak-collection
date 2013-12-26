JS = $$(find index.js ./lib ./test -name '*.js')

test: validate
	@./node_modules/.bin/mocha test --reporter dot

clean:
	@rm -fr ./node_modules
	@rm -fr ./lib-cov
	@rm -fr ./test/build.js

validate:
	@jshint --config .jshintrc $(JS)

coverage:
	@rm -fr ./lib-cov
	@jscoverage ./lib ./lib-cov
	@-AK_COLLECTION_TEST_COVERAGE=1 ./node_modules/.bin/mocha --reporter html-cov > ./lib-cov/index.html

.PHONY: clean test validate coverage
