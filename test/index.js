/*global describe, it*/

'use strict';

var Collection = require('../');
var assert = require('assert');
var Dummy = function () {};
var Dummy2 = function () {};
var Dummy3 = function () {};

describe('Collection', function () {
  describe('#Collection()', function () {
    it('should throw if no type given', function () {
      assert.throws(function () {
        new Collection();
      }, 'No type given.');
    });

    it('should initialize with read-only length equal to 0', function () {
      var collection = new Collection({'type': Dummy});

      assert.strictEqual(collection.length, 0);
      assert.throws(function () {
        collection.length = 1;
      }, 'Read only.');
    });

    it('should add data if given', function () {
      var o1 = new Dummy();
      var o2 = new Dummy();
      var o3 = new Dummy();
      var collection = new Collection([o1, o2, o3]);

      assert.strictEqual(collection.length, 3);
      assert.strictEqual(collection._data[0], o1);
      assert.strictEqual(collection._data[1], o2);
      assert.strictEqual(collection._data[2], o3);
    });

    it('should throw if given data is not of given type', function () {
      var dummy1 = new Dummy();
      var dummy2 = new Dummy();
      var dummy3 = new Dummy2();

      assert.throws(function () {
        new Collection([dummy1, dummy2, dummy3]);
      }, 'Invalid type.');
      assert.throws(function () {
        new Collection([dummy1, dummy2], {'type': Dummy3});
      }, 'Invalid type.');
    });
  });

  describe('#accept()', function () {
    it('should check type', function () {
      var collection = new Collection([new Dummy()]);

      assert.strictEqual(collection.accept([new Dummy()]), true);
      assert.strictEqual(collection.accept([new Dummy(), new Dummy()]), true);
      assert.strictEqual(collection.accept([new Dummy2()]), false);
      assert.strictEqual(collection.accept([new Dummy(), new Dummy2()]), false);
      assert.throws(function () {
        collection.accept([new Dummy2()], true);
      }, 'Invalid type.');
      assert.throws(function () {
        collection.accept([new Dummy(), new Dummy2()], true);
      }, 'Invalid type.');
    });
  });

  describe('#concat()', function () {
    it('should return concated collections in a new collection', function () {
      var o1 = new Dummy();
      var o2 = new Dummy();
      var o3 = new Dummy();
      var o4 = new Dummy();
      var o5 = new Dummy();
      var collection1 = new Collection([o1, o2, o3]);
      var collection2 = new Collection([o4, o5]);
      var collection3 = collection1.concat(collection2);
      var collection4 = collection1.concat(collection1, collection2);

      assert.strictEqual(collection1.length, 3);
      assert.strictEqual(collection1._data[0], o1);
      assert.strictEqual(collection1._data[1], o2);
      assert.strictEqual(collection1._data[2], o3);
      assert.strictEqual(collection2.length, 2);
      assert.strictEqual(collection2._data[0], o4);
      assert.strictEqual(collection2._data[1], o5);

      assert.strictEqual(collection3.length, 5);
      assert.strictEqual(collection3._data[0], o1);
      assert.strictEqual(collection3._data[1], o2);
      assert.strictEqual(collection3._data[2], o3);
      assert.strictEqual(collection3._data[3], o4);
      assert.strictEqual(collection3._data[4], o5);

      assert.strictEqual(collection4.length, 8);
      assert.strictEqual(collection4._data[0], o1);
      assert.strictEqual(collection4._data[1], o2);
      assert.strictEqual(collection4._data[2], o3);
      assert.strictEqual(collection4._data[3], o1);
      assert.strictEqual(collection4._data[4], o2);
      assert.strictEqual(collection4._data[5], o3);
      assert.strictEqual(collection4._data[6], o4);
      assert.strictEqual(collection4._data[7], o5);
    });
    it('should accept Objects with toArray() methods and Arrays', function () {
      var o1 = new Dummy();
      var o2 = new Dummy();
      var o3 = new Dummy();
      var o4 = new Dummy();
      var o5 = new Dummy();
      var collection1 = new Collection([o1, o2, o3]);
      var Arrayable = {
        'toArray': function () {
          return [o5, o4];
        }
      };
      var arr = [o3, o4];
      var collection2 = collection1.concat(Arrayable, arr);

      assert.strictEqual(collection2.length, 7);
      assert.strictEqual(collection2._data[0], o1);
      assert.strictEqual(collection2._data[1], o2);
      assert.strictEqual(collection2._data[2], o3);
      assert.strictEqual(collection2._data[3], o5);
      assert.strictEqual(collection2._data[4], o4);
      assert.strictEqual(collection2._data[5], o3);
      assert.strictEqual(collection2._data[6], o4);
      assert.throws(function () {
        collection2.concat(o2);
      }, 'Invalid argument.');
      assert.throws(function () {
        collection2.concat([1, 2, 3]);
      }, 'Invalid type.');
    });
  });

  describe('#every()', function () {
    it('should work', function () {
      var collection = new Collection([
        {'x': 11},
        {'x': 22},
        {'x': 33},
        {'x': 44}
      ]);

      assert.strictEqual(collection.every(function (item) {
        return item.x > 30;
      }), false);
      assert.strictEqual(collection.every(function (item) {
        return item.x < 108;
      }), true);
    });
  });

  describe('#filter()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4]);
      var collection2 = collection.filter(function (item) {
        return item.x > 30;
      });
      var collection3 = collection.filter(function (item) {
        return item.x > 108;
      });

      assert.strictEqual(collection2.length, 2);
      assert.strictEqual(collection2._data[0], o3);
      assert.strictEqual(collection2._data[1], o4);
      assert.strictEqual(collection3.length, 0);
    });
  });

  describe('#find()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4]);

      assert.strictEqual(collection.find(function (item) {
        return item.x === 33;
      }), o3);
      assert.strictEqual(collection.find(function (item) {
        return item.x === 108;
      }), undefined);
    });
  });

  describe('#findIndex()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4, o2]);

      assert.strictEqual(collection.findIndex(function (item) {
        return item.x === 33;
      }), 2);
      assert.strictEqual(collection.findIndex(function (item) {
        return item.x === 108;
      }), -1);
    });
  });

  describe('#forEach()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4, o2]);
      var result = [];

      assert.strictEqual(collection.forEach(function (item, i) {
        result.push({'x': item.x, 'index': i});
      }), collection);
      assert.strictEqual(result[0].x, 11);
      assert.strictEqual(result[1].x, 22);
      assert.strictEqual(result[2].x, 33);
      assert.strictEqual(result[3].x, 44);
      assert.strictEqual(result[4].x, 22);
      assert.strictEqual(result[0].index, 0);
      assert.strictEqual(result[1].index, 1);
      assert.strictEqual(result[2].index, 2);
      assert.strictEqual(result[3].index, 3);
      assert.strictEqual(result[4].index, 4);
    });
  });

  describe('#indexOf()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4, o2]);

      assert.strictEqual(collection.indexOf(o1), 0);
      assert.strictEqual(collection.indexOf(o2), 1);
      assert.strictEqual(collection.indexOf(o3), 2);
      assert.strictEqual(collection.indexOf(o2, 2), 4);
      assert.strictEqual(collection.indexOf('nowhere'), -1);
    });
  });

  describe('#item()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4, o2]);

      assert.strictEqual(collection.item(0), o1);
      assert.strictEqual(collection.item(1), o2);
      assert.strictEqual(collection.item(2), o3);
      assert.strictEqual(collection.item(3), o4);
      assert.strictEqual(collection.item(4), o2);
      assert.strictEqual(collection.item(5), undefined);
      assert.strictEqual(collection.item('length'), undefined);
    });
  });

  describe('#lastIndexOf()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection1 = new Collection([o1, o2, o3, o4]);
      var collection2 = new Collection({'type': Dummy});

      assert.strictEqual(collection1.last(), o4);
      assert.strictEqual(collection2.last(), undefined);
    });
  });

  describe('#lastIndexOf()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4, o2]);

      assert.strictEqual(collection.lastIndexOf(o1), 0);
      assert.strictEqual(collection.lastIndexOf(o2), 4);
      assert.strictEqual(collection.lastIndexOf(o3), 2);
      assert.strictEqual(collection.lastIndexOf(o2, 2), 1);
      assert.strictEqual(collection.lastIndexOf('nowhere'), -1);
    });
  });

  describe('#map()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4, o2]);
      var collection2 = collection.map(function (item) {
        return {'x': item.x + 100};
      });

      assert.strictEqual(collection.length, 5);
      assert.strictEqual(collection._data[0], o1);
      assert.strictEqual(collection._data[1], o2);
      assert.strictEqual(collection._data[2], o3);
      assert.strictEqual(collection._data[3], o4);
      assert.strictEqual(collection._data[4], o2);
      assert.strictEqual(collection._data[0].x, o1.x);
      assert.strictEqual(collection._data[1].x, o2.x);
      assert.strictEqual(collection._data[2].x, o3.x);
      assert.strictEqual(collection._data[3].x, o4.x);
      assert.strictEqual(collection._data[4].x, o2.x);

      assert.strictEqual(collection2.length, 5);
      assert.notStrictEqual(collection2._data[0], o1);
      assert.notStrictEqual(collection2._data[1], o2);
      assert.notStrictEqual(collection2._data[2], o3);
      assert.notStrictEqual(collection2._data[3], o4);
      assert.notStrictEqual(collection2._data[4], o2);
      assert.strictEqual(collection2._data[0].x, 111);
      assert.strictEqual(collection2._data[1].x, 122);
      assert.strictEqual(collection2._data[2].x, 133);
      assert.strictEqual(collection2._data[3].x, 144);
      assert.strictEqual(collection2._data[4].x, 122);
    });
  });

  describe('#pop()', function () {
    it('should work', function (done) {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var counter = false;
      var collection = new Collection([o1, o2, o3, o4, o2]);
      collection.eventEmitter.on('change.remove', function (ns, items) {
        counter = true;

        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], o2);
      });

      var poped = collection.pop();

      assert.strictEqual(collection.length, 4);
      assert.strictEqual(collection._data[0], o1);
      assert.strictEqual(collection._data[1], o2);
      assert.strictEqual(collection._data[2], o3);
      assert.strictEqual(collection._data[3], o4);
      assert.strictEqual(collection._data[4], undefined);
      assert.strictEqual(collection.item(4), undefined);
      assert.strictEqual(poped, o2);

      if (counter) {
        done();
      }
    });
  });

  describe('#push()', function () {
    it('should work', function (done) {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var counter = false;
      var collection = new Collection([o1, o2, o3, o4]);
      collection.eventEmitter.on('change.add', function (ns, items) {
        counter = true;

        assert.strictEqual(items.length, 2);
        assert.strictEqual(items[0], o2);
        assert.strictEqual(items[1], o4);
      });

      assert.strictEqual(collection.push(o2, o4), 6);
      assert.strictEqual(collection.length, 6);
      assert.strictEqual(collection._data[0], o1);
      assert.strictEqual(collection._data[1], o2);
      assert.strictEqual(collection._data[2], o3);
      assert.strictEqual(collection._data[3], o4);
      assert.strictEqual(collection._data[4], o2);
      assert.strictEqual(collection._data[5], o4);
      assert.throws(function () {
        collection.push('invalid item');
      }, 'Invalid type.');
      assert.strictEqual(collection.length, 6);

      if (counter) {
        done();
      }
    });
  });

  describe('#reduce()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4]);

      assert.strictEqual(collection.reduce(function (previous, current) {
        return '' + previous + current.x;
      }, 1000), '' + 1000 + 11 + 22 + 33 + 44);

      assert.strictEqual(collection.reduce(function (previous, current) {
        return {'x': '' + previous.x + current.x};
      }).x, '' + 11 + 22 + 33 + 44);
    });
  });

  describe('#reduceRight()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o1, o2, o3, o4]);

      assert.strictEqual(collection.reduceRight(function (previous, current) {
        return '' + previous + current.x;
      }, 1000), '' + 1000 + 44 + 33 + 22 + 11);

      assert.strictEqual(collection.reduceRight(function (previous, current) {
        return {'x': '' + previous.x + current.x};
      }).x, '' + 44 + 33 + 22 + 11);
    });
  });

  describe('#reverse()', function () {
    it('should work', function (done) {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var counter = false;
      var collection = new Collection([o1, o2, o3, o4, o2]);
      collection.eventEmitter.on('change.sort', function () {
        counter = true;
      });
      collection.reverse();

      assert.strictEqual(collection._data[0], o2);
      assert.strictEqual(collection._data[1], o4);
      assert.strictEqual(collection._data[2], o3);
      assert.strictEqual(collection._data[3], o2);
      assert.strictEqual(collection._data[4], o1);

      if (counter) {
        done();
      }
    });
  });

  describe('#shift()', function () {
    it('should work', function (done) {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var counter = false;
      var collection = new Collection([o1, o2, o3, o4, o2]);
      collection.eventEmitter.on('change.remove', function (ns, items) {
        counter = true;

        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0], o1);
      });

      var shifted = collection.shift();

      assert.strictEqual(collection.length, 4);
      assert.strictEqual(collection._data[0], o2);
      assert.strictEqual(collection._data[1], o3);
      assert.strictEqual(collection._data[2], o4);
      assert.strictEqual(collection._data[3], o2);
      assert.strictEqual(collection._data[4], undefined);
      assert.strictEqual(collection.item(4), undefined);
      assert.strictEqual(shifted, o1);

      if (counter) {
        done();
      }
    });
  });

  describe('#slice()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection1 = new Collection([o1, o2, o3, o4, o2]);
      var collection2 = collection1.slice();
      var collection3 = collection1.slice(1, -1);

      assert.notStrictEqual(collection1, collection2);

      assert.strictEqual(collection1.length, 5);
      assert.strictEqual(collection1._data[0], o1);
      assert.strictEqual(collection1._data[1], o2);
      assert.strictEqual(collection1._data[2], o3);
      assert.strictEqual(collection1._data[3], o4);
      assert.strictEqual(collection1._data[4], o2);

      assert.strictEqual(collection2.length, 5);
      assert.strictEqual(collection2._data[0], o1);
      assert.strictEqual(collection2._data[1], o2);
      assert.strictEqual(collection2._data[2], o3);
      assert.strictEqual(collection2._data[3], o4);
      assert.strictEqual(collection2._data[4], o2);

      assert.strictEqual(collection3.length, 3);
      assert.strictEqual(collection3._data[0], o2);
      assert.strictEqual(collection3._data[1], o3);
      assert.strictEqual(collection3._data[2], o4);
    });
  });

  describe('#some()', function () {
    it('should work', function () {
      var collection = new Collection([
        {'x': 11},
        {'x': 22},
        {'x': 33},
        {'x': 44}
      ]);

      assert.strictEqual(collection.some(function (item) {
        return item.x > 30;
      }), true);
      assert.strictEqual(collection.some(function (item) {
        return item.x > 108;
      }), false);
    });
  });

  describe('#sort()', function () {
    it('should work', function (done) {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var counter = false;
      var collection = new Collection([o4, o2, o1, o3, o2], {
        'sort': function (a, b) {
          return a.x - b.x;
        }
      });
      collection.eventEmitter.on('change.sort', function () {
        counter = true;
      });
      collection.sort();

      assert.strictEqual(collection.length, 5);
      assert.strictEqual(collection._data[0], o1);
      assert.strictEqual(collection._data[1], o2);
      assert.strictEqual(collection._data[2], o2);
      assert.strictEqual(collection._data[3], o3);
      assert.strictEqual(collection._data[4], o4);

      collection.sort(function (a, b) {
        return b.x - a.x;
      });

      assert.strictEqual(collection.length, 5);
      assert.strictEqual(collection._data[0], o4);
      assert.strictEqual(collection._data[1], o3);
      assert.strictEqual(collection._data[2], o2);
      assert.strictEqual(collection._data[3], o2);
      assert.strictEqual(collection._data[4], o1);

      if (counter) {
        done();
      }
    });
  });

  describe('#splice()', function () {
    it('should work', function (done) {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var o5 = {'x': 55};
      var counter = 0;
      var collection1 = new Collection([o4, o2, o1, o3, o2]);
      collection1.eventEmitter.on('change.add', function (ns, items) {
        if (counter === 0) {
          assert.strictEqual(items.length, 2);
          assert.strictEqual(items[0], o3);
          assert.strictEqual(items[1], o5);

          counter += 1;
        } else if (counter === 2) {
          assert.strictEqual(items.length, 2);
          assert.strictEqual(items[0], o5);
          assert.strictEqual(items[1], o4);

          counter += 1;
        }
      });
      collection1.eventEmitter.on('change.remove', function (ns, items) {
        if (counter === 1) {
          assert.strictEqual(items.length, 2);
          assert.strictEqual(items[0], o3);
          assert.strictEqual(items[1], o5);

          counter += 1;
        } else if (counter === 3) {
          assert.strictEqual(items.length, 1);
          assert.strictEqual(items[0], o1);

          counter += 1;
        }
      });

      var collectionEmpty = collection1.splice(2, 0, o3, o5);

      assert.strictEqual(collectionEmpty.length, 0);
      assert.strictEqual(collectionEmpty._data[0], undefined);

      assert.strictEqual(collection1.length, 7);
      assert.strictEqual(collection1._data[0], o4);
      assert.strictEqual(collection1._data[1], o2);
      assert.strictEqual(collection1._data[2], o3);
      assert.strictEqual(collection1._data[3], o5);
      assert.strictEqual(collection1._data[4], o1);
      assert.strictEqual(collection1._data[5], o3);
      assert.strictEqual(collection1._data[6], o2);

      var collection2 = collection1.splice(2, 2);

      assert.strictEqual(collection1.length, 5);
      assert.strictEqual(collection1._data[0], o4);
      assert.strictEqual(collection1._data[1], o2);
      assert.strictEqual(collection1._data[2], o1);
      assert.strictEqual(collection1._data[3], o3);
      assert.strictEqual(collection1._data[4], o2);

      assert.strictEqual(collection2.length, 2);
      assert.strictEqual(collection2._data[0], o3);
      assert.strictEqual(collection2._data[1], o5);

      var collection3 = collection1.splice(2, 1, o5, o4);

      assert.strictEqual(collection3.length, 1);
      assert.strictEqual(collection3._data[0], o1);

      assert.strictEqual(collection1.length, 6);
      assert.strictEqual(collection1._data[0], o4);
      assert.strictEqual(collection1._data[1], o2);
      assert.strictEqual(collection1._data[2], o5);
      assert.strictEqual(collection1._data[3], o4);
      assert.strictEqual(collection1._data[4], o3);
      assert.strictEqual(collection1._data[5], o2);

      if (counter === 4) {
        done();
      }
    });
  });

  describe('#unshift()', function () {
    it('should work', function (done) {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var counter = false;
      var collection = new Collection([o4, o2, o1, o3, o2]);
      collection.eventEmitter.on('change.add', function (ns, items) {
        counter = true;

        assert.strictEqual(items.length, 2);
        assert.strictEqual(items[0], o1);
        assert.strictEqual(items[1], o3);
      });

      assert.strictEqual(collection.unshift(o1, o3), 7);
      assert.strictEqual(collection.length, 7);
      assert.strictEqual(collection._data[0], o1);
      assert.strictEqual(collection._data[1], o3);
      assert.strictEqual(collection._data[2], o4);
      assert.strictEqual(collection._data[3], o2);
      assert.strictEqual(collection._data[4], o1);
      assert.strictEqual(collection._data[5], o3);
      assert.strictEqual(collection._data[6], o2);

      if (counter) {
        done();
      }
    });
  });

  describe('#toArray()', function () {
    it('should work', function () {
      var o1 = {'x': 11};
      var o2 = {'x': 22};
      var o3 = {'x': 33};
      var o4 = {'x': 44};
      var collection = new Collection([o4, o2, o1, o3, o2]);
      var arr = collection.toArray();

      assert.strictEqual(collection.length, arr.length);
      assert.strictEqual(collection._data[0], arr[0]);
      assert.strictEqual(collection._data[1], arr[1]);
      assert.strictEqual(collection._data[2], arr[2]);
      assert.strictEqual(collection._data[3], arr[3]);
      assert.strictEqual(collection._data[4], arr[4]);
    });
  });
});
