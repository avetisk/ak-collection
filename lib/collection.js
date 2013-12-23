'use strict';

/**
 * slice
 */
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

/**
 * Dependencies
 */
var EventEmitter = require('ak-eventemitter');
var defaults = require('stluafed');

/**
 * Export `Collection`
 *
 * @param {Array} data (optional)
 * @param {Object} options (optional)
 * @return {Collection}
 */
var Collection = module.exports = function (data, options) {
  this.eventEmitter = new EventEmitter();

  if (! Array.isArray(data)) {
    options = data;
    data = [];
  }

  this._data = data;
  this.options = options || {};

  if (! this.options.type) {
    if (! this._data.length) {
      throw new Error('No type given.');
    }

    this.options.type = this._data[0].constructor;
  }

  this.accept(this._data, true);
};

var prototype = Collection.prototype;

/**
 * Get length
 */
Object.defineProperty(prototype, 'length', {
  'get': function () {
    return this._data.length;
  },
  'set': function () {
    throw new Error('Read only.');
  }
});

/**
 * Check if items are same type as Collection
 *
 * @param {Array} items
 * @param {Boolean} throwOnFalse (optional)
 * @return {Boolean}
 */
prototype.accept = function (items, throwOnFalse) {
  var type = this.options.type;

  for (var i = 0, len = items.length; i < len; i += 1) {
    if (! (items[i] instanceof type)) {
      if (throwOnFalse) {
        throw new Error('Invalid type.');
      }

      return false;
    }
  }

  return true;
};

/**
 * Concat Collection, Array together
 *
 * @param {*}
 * @return {Collection}
 */
prototype.concat = function (/*collection1 [, collectionN]*/) {
  var result = this.toArray();
  var collection;

  for (var i = 0, len = arguments.length; i < len; i += 1) {
    collection = arguments[i];

    if (collection.toArray) {
      collection = collection.toArray();
    }

    if (! Array.isArray(collection)) {
      throw new Error('Invalid argument.');
    }

    result = result.concat(collection);
  }

  return new Collection(result);
};

/**
 * Same as Array.every()
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Boolean}
 */
prototype.every = function (fn, context) {
  for (var i = 0, len = this._data.length; i < len; i += 1) {
    if (! fn.call(context || this, this._data[i], i, this)) {
      return false;
    }
  }

  return true;
};

/**
 * Same as Array.filter()
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Collection}
 */
prototype.filter = function (fn, context) {
  var result = [];

  for (var i = 0, item, len = this._data.length; i < len; i += 1) {
    item = this._data[i];

    if (fn.call(context || this, item, i, this)) {
      result.push(item);
    }
  }

  return new Collection(result, defaults({}, this.options));
};

/**
 * Same as Array.find()
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Mixed}
 */
prototype.find = function (fn, context) {
  for (var i = 0, item, len = this._data.length; i < len; i += 1) {
    item = this._data[i];

    if (fn.call(context || this, item, i, this)) {
      return item;
    }
  }
};

/**
 * Same as Array.findIndex()
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Number}
 */
prototype.findIndex = function (fn, context) {
  for (var i = 0, len = this._data.length; i < len; i += 1) {
    if (fn.call(context || this, this._data[i], i, this)) {
      return i;
    }
  }

  return -1;
};

/**
 * Same as Array.forEach()
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Collection}
 */
prototype.forEach = function (fn, context) {
  var data = this._data;

  for (var i = 0, len = data.length; i < len; i += 1) {
    fn.call(context || this, data[i], i, this);
  }

  return this;
};

/**
 * Same as Array.indexOf()
 *
 * @param {Mixed} item
 * @param {Number} index (optional)
 * @return {Number}
 */
prototype.indexOf = function (item, index) {
  for (var i = index || 0, len = this._data.length; i < len; i += 1) {
    if (this._data[i] === item) {
      return i;
    }
  }

  return -1;
};

/**
 * Return item of given index
 *
 * @param {Number} index
 * @return {Mixed}
 */
prototype.item = function (index) {
  if (~~index !== index) {
    return undefined;
  }

  return this._data[index];
};

/**
 * Return last item
 *
 * @return {Mixed}
 */
prototype.last = function () {
  return this._data[this._data.length - 1];
};

/**
 * Same as Array.lastIndexOf()
 *
 * @param {Mixed} item
 * @param {Number} index (optional)
 * @return {Number}
 */
prototype.lastIndexOf = function (item, index) {
  for (var i = index || (this._data.length - 1); i >= 0; i -= 1) {
    if (this._data[i] === item) {
      return i;
    }
  }

  return -1;
};

/**
 * Same as Array.map() except return new Collection()
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Collection}
 */
prototype.map = function (fn, context) {
  var result = [];

  for (var i = 0, len = this._data.length; i < len; i += 1) {
    result[i] = fn.call(context || this, this._data[i], i, this);
  }

  return new Collection(result, defaults({}, this.options));
};

/**
 * Same as Array.pop()
 *
 * @return {Mixed}
 */
prototype.pop = function () {
  var item = this._data.pop();

  this.eventEmitter.emit('change.remove', [item], this);

  return item;
};

/**
 * Same as Array.push()
 *
 * @param {*}
 * @return {Number}
 */
prototype.push = function (/*item1[, itemN]*/) {
  var items = slice(arguments);

  this.accept(items, true);
  this._data.push.apply(this._data, items);

  this.eventEmitter.emit('change.add', items, this);

  return this._data.length;
};

/**
 * Same as Array.reduce()
 *
 * @param {Function} fn
 * @param {Mixed} result (optional)
 * @return {Mixed}
 */
prototype.reduce = function (fn, result) {
  if (result) {
    for (var i = 0, len = this._data.length; i < len; i += 1) {
      result = fn(result, this._data[i], i, this);
    }
  } else {
    result = this._data[0];

    for (var i2 = 1, len2 = this._data.length; i2 < len2; i2 += 1) {
      result = fn(result, this._data[i2], i2, this);
    }
  }

  return result;
};

/**
 * Same as Array.reduceRight()
 *
 * @param {Function} fn
 * @param {Mixed} result (optional)
 * @return {Mixed}
 */
prototype.reduceRight = function (fn, result) {
  if (result) {
    for (var i = this._data.length - 1; i >= 0; i -= 1) {
      result = fn(result, this._data[i], i, this);
    }
  } else {
    result = this._data[this._data.length - 1];

    for (var i2 = this._data.length - 2; i2 >= 0; i2 -= 1) {
      result = fn(result, this._data[i2], i2, this);
    }
  }

  return result;
};

/**
 * Same as Array.reverse()
 *
 * @return {Collection}
 */
prototype.reverse = function () {
  this._data.reverse();

  this.eventEmitter.emit('change.sort', this);

  return this;
};

/**
 * Same as Array.shift()
 *
 * @return {Mixed}
 */
prototype.shift = function () {
  var item = this._data.shift();

  this.eventEmitter.emit('change.remove', [item], this);

  return item;
};

/**
 * Same as Array.slice() except return new Collection()
 *
 * @param {Number} begin (optional)
 * @param {Number} end (optional)
 * @return {Collection}
 */
prototype.slice = function (begin, end) {
  var result = this._data.slice(begin, end);

  return new Collection(result, defaults({}, this.options));
};

/**
 * Same as Array.some()
 *
 * @param {Function} fn
 * @param {Mixed} context (optional)
 * @return {Boolean}
 */
prototype.some = function (fn, context) {
  for (var i = 0, len = this._data.length; i < len; i += 1) {
    if (fn.call(context || this, this._data[i], i, this)) {
      return true;
    }
  }

  return false;
};

/**
 * Same as Array.sort()
 *
 * @param {Function} fn (optional)
 * @return {Collection}
 */
prototype.sort = function (fn) {
  this._data.sort(fn || this.options.sort);

  this.eventEmitter.emit('change.sort', this);

  return this;
};

/**
 * Same as Array.splice() except return new Collection() of removed items
 *
 * @param {Number} index
 * @param {Number} removeCount
 * @param {*}
 * @return {Collection}
 */
prototype.splice = function (/*index, removeCount[, item1[, ...]]*/) {
  var items;

  if (2 in arguments /* adding */) {
    items = slice(arguments, 2);
    this.accept(items, true);
  }

  var removedItems = this._data.splice.apply(this._data, arguments);

  if (items) {
    this.eventEmitter.emit('change.add', items, this);
  }

  if (removedItems.length) {
    this.eventEmitter.emit('change.remove', removedItems, this);
  }

  return new Collection(removedItems, defaults({}, this.options));
};

/**
 * Same as Array.unshift()
 *
 * @param {*}
 * @return {Number}
 */
prototype.unshift = function (/*item1[, itemN]*/) {
  var items = slice(arguments);

  this.accept(items, true);
  this._data.unshift.apply(this._data, items);

  this.eventEmitter.emit('change.add', items, this);

  return this._data.length;
};

/**
 * Return a copy of internal array
 *
 * @return {Array}
 */
prototype.toArray = function () {
  return this._data.slice();
};
