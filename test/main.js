var assert = require('assert');
var ErrorSponge = require('../').ErrorSponge;

var errSponge;

beforeEach('Instantiate ErrorSponge', function (done) {
  errSponge = new ErrorSponge();
  done();
});

describe('dehydrate', function () {
  it('should dehydrate Error object into a simple JavaScript Object', function (done) {
    var err = new Error('This is a sample error');
    err.name = 'SampleError';

    var dehydratedError = errSponge.dehydrate(err);
    var expectedErr = {
      message: err.message,
      name: err.name
    };
    assert.equal(JSON.stringify(dehydratedError), JSON.stringify(expectedErr), 'Dehydrated error did not match expected output');

    done();
  });

  it('should include custom properties when dehydrating', function (done) {
    var err = new Error('This is a sample error');
    err.name = 'SampleError';
    err.foo = 123;

    var dehydratedError = errSponge.dehydrate(err);
    var expectedErr = {
      message: err.message,
      name: err.name,
      foo: err.foo
    };
    assert.equal(JSON.stringify(dehydratedError), JSON.stringify(expectedErr), 'Dehydrated error did not match expected output');

    done();
  });

  it('should exclude properties specified in unserializableErrorProperties array', function (done) {
    errSponge = new ErrorSponge({
      unserializableErrorProperties: ['foo']
    });

    var err = new Error('This is a sample error');
    err.name = 'SampleError';
    err.foo = 123;

    var dehydratedError = errSponge.dehydrate(err);
    var expectedErr = {
      message: err.message,
      name: err.name
    };
    assert.equal(JSON.stringify(dehydratedError), JSON.stringify(expectedErr), 'Dehydrated error did not match expected output');

    done();
  });

  it('should not contain stack trace unless specified explicitly', function (done) {
    var err = new Error('This is a sample error');
    err.name = 'SampleError';

    var dehydratedError = errSponge.dehydrate(err);

    assert(dehydratedError.stack == null, 'The stack property should not be present on the dehyrated error');

    done();
  });

  it('should contain stack trace is specified explicitly', function (done) {
    var err = new Error('This is a sample error');
    err.name = 'SampleError';

    var dehydratedError = errSponge.dehydrate(err, true);

    assert(typeof dehydratedError.stack == 'string', 'Expected stack property on the dehydrated error to be a string');

    done();
  });
});

describe('hydrate', function () {
  var dehydratedError;

  beforeEach('Create dehydrated error', function (done) {
    dehydratedError = new Error('This is a sample error');
    dehydratedError.name = 'SampleError';
    dehydratedError.foo = 123;

    done();
  });

  it('should hydrate dehydrated error back to an Error object', function (done) {
    var error = errSponge.hydrate(dehydratedError);

    assert(error instanceof Error, 'Hydrated Error was not of type Error');

    var expectedErr = new Error('This is a sample error');
    expectedErr.name = 'SampleError';
    expectedErr.foo = 123;

    assert.equal(error.name, expectedErr.name, 'Error name did not match expected name');
    assert.equal(error.message, expectedErr.message, 'Error message did not match expected message');
    assert.equal(error.foo, expectedErr.foo, 'Error foo did not match expected foo');

    done();
  });
});
