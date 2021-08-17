(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.shpwrite=f()}})(function(){var define,module,exports;return(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var util=require('util/');var pSlice=Array.prototype.slice;var hasOwn=Object.prototype.hasOwnProperty;var assert=module.exports=ok;assert.AssertionError=function AssertionError(options){this.name='AssertionError';this.actual=options.actual;this.expected=options.expected;this.operator=options.operator;if(options.message){this.message=options.message;this.generatedMessage=!1}else{this.message=getMessage(this);this.generatedMessage=!0}
var stackStartFunction=options.stackStartFunction||fail;if(Error.captureStackTrace){Error.captureStackTrace(this,stackStartFunction)}else{var err=new Error();if(err.stack){var out=err.stack;var fn_name=stackStartFunction.name;var idx=out.indexOf('\n'+fn_name);if(idx>=0){var next_line=out.indexOf('\n',idx+1);out=out.substring(next_line+1)}
this.stack=out}}};util.inherits(assert.AssertionError,Error);function replacer(key,value){if(util.isUndefined(value)){return''+value}
if(util.isNumber(value)&&!isFinite(value)){return value.toString()}
if(util.isFunction(value)||util.isRegExp(value)){return value.toString()}
return value}
function truncate(s,n){if(util.isString(s)){return s.length<n?s:s.slice(0,n)}else{return s}}
function getMessage(self){return truncate(JSON.stringify(self.actual,replacer),128)+' '+self.operator+' '+truncate(JSON.stringify(self.expected,replacer),128)}
function fail(actual,expected,message,operator,stackStartFunction){throw new assert.AssertionError({message:message,actual:actual,expected:expected,operator:operator,stackStartFunction:stackStartFunction})}
assert.fail=fail;function ok(value,message){if(!value)fail(value,!0,message,'==',assert.ok)}
assert.ok=ok;assert.equal=function equal(actual,expected,message){if(actual!=expected)fail(actual,expected,message,'==',assert.equal)};assert.notEqual=function notEqual(actual,expected,message){if(actual==expected){fail(actual,expected,message,'!=',assert.notEqual)}};assert.deepEqual=function deepEqual(actual,expected,message){if(!_deepEqual(actual,expected)){fail(actual,expected,message,'deepEqual',assert.deepEqual)}};function _deepEqual(actual,expected){if(actual===expected){return!0}else if(util.isBuffer(actual)&&util.isBuffer(expected)){if(actual.length!=expected.length)return!1;for(var i=0;i<actual.length;i++){if(actual[i]!==expected[i])return!1}
return!0}else if(util.isDate(actual)&&util.isDate(expected)){return actual.getTime()===expected.getTime()}else if(util.isRegExp(actual)&&util.isRegExp(expected)){return actual.source===expected.source&&actual.global===expected.global&&actual.multiline===expected.multiline&&actual.lastIndex===expected.lastIndex&&actual.ignoreCase===expected.ignoreCase}else if(!util.isObject(actual)&&!util.isObject(expected)){return actual==expected}else{return objEquiv(actual,expected)}}
function isArguments(object){return Object.prototype.toString.call(object)=='[object Arguments]'}
function objEquiv(a,b){if(util.isNullOrUndefined(a)||util.isNullOrUndefined(b))
return!1;if(a.prototype!==b.prototype)return!1;if(util.isPrimitive(a)||util.isPrimitive(b)){return a===b}
var aIsArgs=isArguments(a),bIsArgs=isArguments(b);if((aIsArgs&&!bIsArgs)||(!aIsArgs&&bIsArgs))
return!1;if(aIsArgs){a=pSlice.call(a);b=pSlice.call(b);return _deepEqual(a,b)}
var ka=objectKeys(a),kb=objectKeys(b),key,i;if(ka.length!=kb.length)
return!1;ka.sort();kb.sort();for(i=ka.length-1;i>=0;i--){if(ka[i]!=kb[i])
return!1}
for(i=ka.length-1;i>=0;i--){key=ka[i];if(!_deepEqual(a[key],b[key]))return!1}
return!0}
assert.notDeepEqual=function notDeepEqual(actual,expected,message){if(_deepEqual(actual,expected)){fail(actual,expected,message,'notDeepEqual',assert.notDeepEqual)}};assert.strictEqual=function strictEqual(actual,expected,message){if(actual!==expected){fail(actual,expected,message,'===',assert.strictEqual)}};assert.notStrictEqual=function notStrictEqual(actual,expected,message){if(actual===expected){fail(actual,expected,message,'!==',assert.notStrictEqual)}};function expectedException(actual,expected){if(!actual||!expected){return!1}
if(Object.prototype.toString.call(expected)=='[object RegExp]'){return expected.test(actual)}else if(actual instanceof expected){return!0}else if(expected.call({},actual)===!0){return!0}
return!1}
function _throws(shouldThrow,block,expected,message){var actual;if(util.isString(expected)){message=expected;expected=null}
try{block()}catch(e){actual=e}
message=(expected&&expected.name?' ('+expected.name+').':'.')+(message?' '+message:'.');if(shouldThrow&&!actual){fail(actual,expected,'Missing expected exception'+message)}
if(!shouldThrow&&expectedException(actual,expected)){fail(actual,expected,'Got unwanted exception'+message)}
if((shouldThrow&&actual&&expected&&!expectedException(actual,expected))||(!shouldThrow&&actual)){throw actual}}
assert.throws=function(block,/*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":107}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":2,"ieee754":33,"isarray":37}],5:[function(require,module,exports){
require('../modules/web.immediate');
module.exports = require('../modules/_core').setImmediate;
},{"../modules/_core":9,"../modules/web.immediate":25}],6:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],7:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":20}],8:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],9:[function(require,module,exports){
var core = module.exports = {version: '2.3.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],10:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":6}],11:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":14}],12:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":15,"./_is-object":20}],13:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":9,"./_ctx":10,"./_global":15,"./_hide":16}],14:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],15:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],16:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":11,"./_object-dp":21,"./_property-desc":22}],17:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":15}],18:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":11,"./_dom-create":12,"./_fails":14}],19:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],20:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],21:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":7,"./_descriptors":11,"./_ie8-dom-define":18,"./_to-primitive":24}],22:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],23:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":8,"./_ctx":10,"./_dom-create":12,"./_global":15,"./_html":17,"./_invoke":19}],24:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":20}],25:[function(require,module,exports){
var $export = require('./_export')
  , $task   = require('./_task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./_export":13,"./_task":23}],26:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":36}],27:[function(require,module,exports){
module.exports.structure = require('./src/structure');

},{"./src/structure":31}],28:[function(require,module,exports){
var fieldSize = require('./fieldsize');

var types = {
    string: 'C',
    number: 'N',
    boolean: 'L',
    // type to use if all values of a field are null
    null: 'C'
};

module.exports.multi = multi;
module.exports.bytesPer = bytesPer;
module.exports.obj = obj;

function multi(features) {
    var fields = {};
    features.forEach(collect);
    function collect(f) { inherit(fields, f); }
    return obj(fields);
}

/**
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
function inherit(a, b) {
    for (var i in b) {
        var isDef = typeof b[i] !== 'undefined' && b[i] !== null;
        if (typeof a[i] === 'undefined' || isDef) {
          a[i] = b[i];
        }
    }
    return a;
}

function obj(_) {
    var fields = {}, o = [];
    for (var p in _) fields[p] = _[p] === null ? 'null' : typeof _[p];
    for (var n in fields) {
        var t = types[fields[n]];
        if(t){
             o.push({
                name: n,
                type: t,
                size: fieldSize[t]
            });
        }
    }
    return o;
}

/**
 * @param {Array} fields
 * @returns {Array}
 */
function bytesPer(fields) {
    // deleted flag
    return fields.reduce(function(memo, f) { return memo + f.size; }, 1);
}

},{"./fieldsize":29}],29:[function(require,module,exports){
module.exports = {
    // string
    C: 254,
    // boolean
    L: 1,
    // date
    D: 8,
    // number
    N: 18,
    // number
    M: 18,
    // number, float
    F: 18,
    // number
    B: 8,
};

},{}],30:[function(require,module,exports){
/**
 * @param {string} str
 * @param {number} len
 * @param {string} char
 * @returns {string}
 */
module.exports.lpad = function lpad(str, len, char) {
    while (str.length < len) { str = char + str; } return str;
};

/**
 * @param {string} str
 * @param {number} len
 * @param {string} char
 * @returns {string}
 */
module.exports.rpad = function rpad(str, len, char) {
    while (str.length < len) { str = str + char; } return str;
};

/**
 * @param {object} view
 * @param {number} fieldLength
 * @param {string} str
 * @param {number} offset
 * @returns {number}
 */
module.exports.writeField = function writeField(view, fieldLength, str, offset) {
    for (var i = 0; i < fieldLength; i++) {
        view.setUint8(offset, str.charCodeAt(i)); offset++;
    }
    return offset;
};

},{}],31:[function(require,module,exports){
var fieldSize = require('./fieldsize'),
    lib = require('./lib'),
    fields = require('./fields');

/**
 * @param {Array} data
 * @param {Array} meta
 * @returns {Object} view
 */
module.exports = function structure(data, meta) {

    var field_meta = meta || fields.multi(data),
        fieldDescLength = (32 * field_meta.length) + 1,
        bytesPerRecord = fields.bytesPer(field_meta), // deleted flag
        buffer = new ArrayBuffer(
            // field header
            fieldDescLength +
            // header
            32 +
            // contents
            (bytesPerRecord * data.length) +
            // EOF marker
            1
    ),
        now = new Date(),
        view = new DataView(buffer);

    // version number - dBase III
    view.setUint8(0, 0x03);
    // date of last update
    view.setUint8(1, now.getFullYear() - 1900);
    view.setUint8(2, now.getMonth());
    view.setUint8(3, now.getDate());
    // number of records
    view.setUint32(4, data.length, true);

    // length of header
    var headerLength = fieldDescLength + 32;
    view.setUint16(8, headerLength, true);
    // length of each record
    view.setUint16(10, bytesPerRecord, true);

    // Terminator
    view.setInt8(32 + fieldDescLength - 1, 0x0D);

    field_meta.forEach(function(f, i) {
        // field name
        f.name.split('').slice(0, 8).forEach(function(c, x) {
            view.setInt8(32 + i * 32 + x, c.charCodeAt(0));
        });
        // field type
        view.setInt8(32 + i * 32 + 11, f.type.charCodeAt(0));
        // field length
        view.setInt8(32 + i * 32 + 16, f.size);
        if (f.type == 'N') view.setInt8(32 + i * 32 + 17, 3);
    });

    offset = fieldDescLength + 32;

    data.forEach(function(row, num) {
        // delete flag: this is not deleted
        view.setUint8(offset, 32);
        offset++;
        field_meta.forEach(function(f) {
            var val = row[f.name];
            if (val === null || typeof val === 'undefined') val = '';

            switch (f.type) {
                // boolean
                case 'L':
                    view.setUint8(offset, val ? 84 : 70);
                    offset++;
                    break;

                // date
                case 'D':
                    offset = lib.writeField(view, 8,
                        lib.lpad(val.toString(), 8, ' '), offset);
                    break;

                // number
                case 'N':
                    offset = lib.writeField(view, f.size,
                        lib.lpad(val.toString(), f.size, ' ').substr(0, 18),
                        offset);
                    break;

                // string
                case 'C':
                    offset = lib.writeField(view, f.size,
                        lib.rpad(val.toString(), f.size, ' '), offset);
                    break;

                default:
                    throw new Error('Unknown field type');
            }
        });
    });

    // EOF flag
    view.setUint8(offset, 0x1A);

    return view;
};

},{"./fields":28,"./fieldsize":29,"./lib":30}],32:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],33:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],34:[function(require,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],35:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],36:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
module.exports=function(obj){return obj!=null&&(isBuffer(obj)||isSlowBuffer(obj)||!!obj._isBuffer)}
function isBuffer(obj){return!!obj.constructor&&typeof obj.constructor.isBuffer==='function'&&obj.constructor.isBuffer(obj)}
function isSlowBuffer(obj){return typeof obj.readFloatLE==='function'&&typeof obj.slice==='function'&&isBuffer(obj.slice(0,0))}},{}],37:[function(require,module,exports){var toString={}.toString;module.exports=Array.isArray||function(arr){return toString.call(arr)=='[object Array]'}},{}],38:[function(require,module,exports){'use strict';var utils=require('./utils');var support=require('./support');var _keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";exports.encode=function(input){var output=[];var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0,len=input.length,remainingBytes=len;var isArray=utils.getTypeOf(input)!=="string";while(i<input.length){remainingBytes=len-i;if(!isArray){chr1=input.charCodeAt(i++);chr2=i<len?input.charCodeAt(i++):0;chr3=i<len?input.charCodeAt(i++):0}else{chr1=input[i++];chr2=i<len?input[i++]:0;chr3=i<len?input[i++]:0}
enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=remainingBytes>1?(((chr2&15)<<2)|(chr3>>6)):64;enc4=remainingBytes>2?(chr3&63):64;output.push(_keyStr.charAt(enc1)+_keyStr.charAt(enc2)+_keyStr.charAt(enc3)+_keyStr.charAt(enc4))}
return output.join("")};exports.decode=function(input){var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0,resultIndex=0;var dataUrlPrefix="data:";if(input.substr(0,dataUrlPrefix.length)===dataUrlPrefix){throw new Error("Invalid base64 input, it looks like a data url.")}
input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");var totalLength=input.length*3/4;if(input.charAt(input.length-1)===_keyStr.charAt(64)){totalLength--}
if(input.charAt(input.length-2)===_keyStr.charAt(64)){totalLength--}
if(totalLength%1!==0){throw new Error("Invalid base64 input, bad content length.")}
var output;if(support.uint8array){output=new Uint8Array(totalLength|0)}else{output=new Array(totalLength|0)}
while(i<input.length){enc1=_keyStr.indexOf(input.charAt(i++));enc2=_keyStr.indexOf(input.charAt(i++));enc3=_keyStr.indexOf(input.charAt(i++));enc4=_keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output[resultIndex++]=chr1;if(enc3!==64){output[resultIndex++]=chr2}
if(enc4!==64){output[resultIndex++]=chr3}}
return output}},{"./support":67,"./utils":69}],39:[function(require,module,exports){'use strict';var external=require("./external");var DataWorker=require('./stream/DataWorker');var DataLengthProbe=require('./stream/DataLengthProbe');var Crc32Probe=require('./stream/Crc32Probe');var DataLengthProbe=require('./stream/DataLengthProbe');function CompressedObject(compressedSize,uncompressedSize,crc32,compression,data){this.compressedSize=compressedSize;this.uncompressedSize=uncompressedSize;this.crc32=crc32;this.compression=compression;this.compressedContent=data}
CompressedObject.prototype={getContentWorker:function(){var worker=new DataWorker(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe("data_length"));var that=this;worker.on("end",function(){if(this.streamInfo.data_length!==that.uncompressedSize){throw new Error("Bug : uncompressed data size mismatch")}});return worker},getCompressedWorker:function(){return new DataWorker(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}};CompressedObject.createWorkerFrom=function(uncompressedWorker,compression,compressionOptions){return uncompressedWorker.pipe(new Crc32Probe()).pipe(new DataLengthProbe("uncompressedSize")).pipe(compression.compressWorker(compressionOptions)).pipe(new DataLengthProbe("compressedSize")).withStreamInfo("compression",compression)};module.exports=CompressedObject},{"./external":43,"./stream/Crc32Probe":62,"./stream/DataLengthProbe":63,"./stream/DataWorker":64}],40:[function(require,module,exports){'use strict';var GenericWorker=require("./stream/GenericWorker");exports.STORE={magic:"\x00\x00",compressWorker:function(compressionOptions){return new GenericWorker("STORE compression")},uncompressWorker:function(){return new GenericWorker("STORE decompression")}};exports.DEFLATE=require('./flate')},{"./flate":44,"./stream/GenericWorker":65}],41:[function(require,module,exports){'use strict';var utils=require('./utils');function makeTable(){var c,table=[];for(var n=0;n<256;n++){c=n;for(var k=0;k<8;k++){c=((c&1)?(0xEDB88320^(c>>>1)):(c>>>1))}
table[n]=c}
return table}
var crcTable=makeTable();function crc32(crc,buf,len,pos){var t=crcTable,end=pos+len;crc=crc^(-1);for(var i=pos;i<end;i++){crc=(crc>>>8)^t[(crc^buf[i])&0xFF]}
return(crc^(-1))}
function crc32str(crc,str,len,pos){var t=crcTable,end=pos+len;crc=crc^(-1);for(var i=pos;i<end;i++){crc=(crc>>>8)^t[(crc^str.charCodeAt(i))&0xFF]}
return(crc^(-1))}
module.exports=function crc32wrapper(input,crc){if(typeof input==="undefined"||!input.length){return 0}
var isArray=utils.getTypeOf(input)!=="string";if(isArray){return crc32(crc|0,input,input.length,0)}else{return crc32str(crc|0,input,input.length,0)}}},{"./utils":69}],42:[function(require,module,exports){'use strict';exports.base64=!1;exports.binary=!1;exports.dir=!1;exports.createFolders=!0;exports.date=null;exports.compression=null;exports.compressionOptions=null;exports.comment=null;exports.unixPermissions=null;exports.dosPermissions=null},{}],43:[function(require,module,exports){'use strict';var ES6Promise=null;if(typeof Promise!=="undefined"){ES6Promise=Promise}else{ES6Promise=require("lie")}
module.exports={Promise:ES6Promise}},{"lie":73}],44:[function(require,module,exports){'use strict';var USE_TYPEDARRAY=(typeof Uint8Array!=='undefined')&&(typeof Uint16Array!=='undefined')&&(typeof Uint32Array!=='undefined');var pako=require("pako");var utils=require("./utils");var GenericWorker=require("./stream/GenericWorker");var ARRAY_TYPE=USE_TYPEDARRAY?"uint8array":"array";exports.magic="\x08\x00";function FlateWorker(action,options){GenericWorker.call(this,"FlateWorker/"+action);this._pako=new pako[action]({raw:!0,level:options.level||-1});this.meta={};var self=this;this._pako.onData=function(data){self.push({data:data,meta:self.meta})}}
utils.inherits(FlateWorker,GenericWorker);FlateWorker.prototype.processChunk=function(chunk){this.meta=chunk.meta;this._pako.push(utils.transformTo(ARRAY_TYPE,chunk.data),!1)};FlateWorker.prototype.flush=function(){GenericWorker.prototype.flush.call(this);this._pako.push([],!0)};FlateWorker.prototype.cleanUp=function(){GenericWorker.prototype.cleanUp.call(this);this._pako=null};exports.compressWorker=function(compressionOptions){return new FlateWorker("Deflate",compressionOptions)};exports.uncompressWorker=function(){return new FlateWorker("Inflate",{})}},{"./stream/GenericWorker":65,"./utils":69,"pako":74}],45:[function(require,module,exports){'use strict';var utils=require('../utils');var GenericWorker=require('../stream/GenericWorker');var utf8=require('../utf8');var crc32=require('../crc32');var signature=require('../signature');var decToHex=function(dec,bytes){var hex="",i;for(i=0;i<bytes;i++){hex+=String.fromCharCode(dec&0xff);dec=dec>>>8}
return hex};var generateUnixExternalFileAttr=function(unixPermissions,isDir){var result=unixPermissions;if(!unixPermissions){result=isDir?0x41fd:0x81b4}
return(result&0xFFFF)<<16};var generateDosExternalFileAttr=function(dosPermissions,isDir){return(dosPermissions||0)&0x3F};var generateZipParts=function(streamInfo,streamedContent,streamingEnded,offset,platform,encodeFileName){var file=streamInfo.file,compression=streamInfo.compression,useCustomEncoding=encodeFileName!==utf8.utf8encode,encodedFileName=utils.transformTo("string",encodeFileName(file.name)),utfEncodedFileName=utils.transformTo("string",utf8.utf8encode(file.name)),comment=file.comment,encodedComment=utils.transformTo("string",encodeFileName(comment)),utfEncodedComment=utils.transformTo("string",utf8.utf8encode(comment)),useUTF8ForFileName=utfEncodedFileName.length!==file.name.length,useUTF8ForComment=utfEncodedComment.length!==comment.length,dosTime,dosDate,extraFields="",unicodePathExtraField="",unicodeCommentExtraField="",dir=file.dir,date=file.date;var dataInfo={crc32:0,compressedSize:0,uncompressedSize:0};if(!streamedContent||streamingEnded){dataInfo.crc32=streamInfo.crc32;dataInfo.compressedSize=streamInfo.compressedSize;dataInfo.uncompressedSize=streamInfo.uncompressedSize}
var bitflag=0;if(streamedContent){bitflag|=0x0008}
if(!useCustomEncoding&&(useUTF8ForFileName||useUTF8ForComment)){bitflag|=0x0800}
var extFileAttr=0;var versionMadeBy=0;if(dir){extFileAttr|=0x00010}
if(platform==="UNIX"){versionMadeBy=0x031E;extFileAttr|=generateUnixExternalFileAttr(file.unixPermissions,dir)}else{versionMadeBy=0x0014;extFileAttr|=generateDosExternalFileAttr(file.dosPermissions,dir)}
dosTime=date.getUTCHours();dosTime=dosTime<<6;dosTime=dosTime|date.getUTCMinutes();dosTime=dosTime<<5;dosTime=dosTime|date.getUTCSeconds()/2;dosDate=date.getUTCFullYear()-1980;dosDate=dosDate<<4;dosDate=dosDate|(date.getUTCMonth()+1);dosDate=dosDate<<5;dosDate=dosDate|date.getUTCDate();if(useUTF8ForFileName){unicodePathExtraField=decToHex(1,1)+decToHex(crc32(encodedFileName),4)+utfEncodedFileName;extraFields+="\x75\x70"+decToHex(unicodePathExtraField.length,2)+unicodePathExtraField}
if(useUTF8ForComment){unicodeCommentExtraField=decToHex(1,1)+decToHex(crc32(encodedComment),4)+utfEncodedComment;extraFields+="\x75\x63"+decToHex(unicodeCommentExtraField.length,2)+unicodeCommentExtraField}
var header="";header+="\x0A\x00";header+=decToHex(bitflag,2);header+=compression.magic;header+=decToHex(dosTime,2);header+=decToHex(dosDate,2);header+=decToHex(dataInfo.crc32,4);header+=decToHex(dataInfo.compressedSize,4);header+=decToHex(dataInfo.uncompressedSize,4);header+=decToHex(encodedFileName.length,2);header+=decToHex(extraFields.length,2);var fileRecord=signature.LOCAL_FILE_HEADER+header+encodedFileName+extraFields;var dirRecord=signature.CENTRAL_FILE_HEADER+decToHex(versionMadeBy,2)+header+decToHex(encodedComment.length,2)+"\x00\x00"+"\x00\x00"+decToHex(extFileAttr,4)+decToHex(offset,4)+encodedFileName+extraFields+encodedComment;return{fileRecord:fileRecord,dirRecord:dirRecord}};var generateCentralDirectoryEnd=function(entriesCount,centralDirLength,localDirLength,comment,encodeFileName){var dirEnd="";var encodedComment=utils.transformTo("string",encodeFileName(comment));dirEnd=signature.CENTRAL_DIRECTORY_END+"\x00\x00"+"\x00\x00"+decToHex(entriesCount,2)+decToHex(entriesCount,2)+decToHex(centralDirLength,4)+decToHex(localDirLength,4)+decToHex(encodedComment.length,2)+encodedComment;return dirEnd};var generateDataDescriptors=function(streamInfo){var descriptor="";descriptor=signature.DATA_DESCRIPTOR+decToHex(streamInfo.crc32,4)+decToHex(streamInfo.compressedSize,4)+decToHex(streamInfo.uncompressedSize,4);return descriptor};function ZipFileWorker(streamFiles,comment,platform,encodeFileName){GenericWorker.call(this,"ZipFileWorker");this.bytesWritten=0;this.zipComment=comment;this.zipPlatform=platform;this.encodeFileName=encodeFileName;this.streamFiles=streamFiles;this.accumulate=!1;this.contentBuffer=[];this.dirRecords=[];this.currentSourceOffset=0;this.entriesCount=0;this.currentFile=null;this._sources=[]}
utils.inherits(ZipFileWorker,GenericWorker);ZipFileWorker.prototype.push=function(chunk){var currentFilePercent=chunk.meta.percent||0;var entriesCount=this.entriesCount;var remainingFiles=this._sources.length;if(this.accumulate){this.contentBuffer.push(chunk)}else{this.bytesWritten+=chunk.data.length;GenericWorker.prototype.push.call(this,{data:chunk.data,meta:{currentFile:this.currentFile,percent:entriesCount?(currentFilePercent+100*(entriesCount-remainingFiles-1))/entriesCount:100}})}};ZipFileWorker.prototype.openedSource=function(streamInfo){this.currentSourceOffset=this.bytesWritten;this.currentFile=streamInfo.file.name;var streamedContent=this.streamFiles&&!streamInfo.file.dir;if(streamedContent){var record=generateZipParts(streamInfo,streamedContent,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:record.fileRecord,meta:{percent:0}})}else{this.accumulate=!0}};ZipFileWorker.prototype.closedSource=function(streamInfo){this.accumulate=!1;var streamedContent=this.streamFiles&&!streamInfo.file.dir;var record=generateZipParts(streamInfo,streamedContent,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.dirRecords.push(record.dirRecord);if(streamedContent){this.push({data:generateDataDescriptors(streamInfo),meta:{percent:100}})}else{this.push({data:record.fileRecord,meta:{percent:0}});while(this.contentBuffer.length){this.push(this.contentBuffer.shift())}}
this.currentFile=null};ZipFileWorker.prototype.flush=function(){var localDirLength=this.bytesWritten;for(var i=0;i<this.dirRecords.length;i++){this.push({data:this.dirRecords[i],meta:{percent:100}})}
var centralDirLength=this.bytesWritten-localDirLength;var dirEnd=generateCentralDirectoryEnd(this.dirRecords.length,centralDirLength,localDirLength,this.zipComment,this.encodeFileName);this.push({data:dirEnd,meta:{percent:100}})};ZipFileWorker.prototype.prepareNextSource=function(){this.previous=this._sources.shift();this.openedSource(this.previous.streamInfo);if(this.isPaused){this.previous.pause()}else{this.previous.resume()}};ZipFileWorker.prototype.registerPrevious=function(previous){this._sources.push(previous);var self=this;previous.on('data',function(chunk){self.processChunk(chunk)});previous.on('end',function(){self.closedSource(self.previous.streamInfo);if(self._sources.length){self.prepareNextSource()}else{self.end()}});previous.on('error',function(e){self.error(e)});return this};ZipFileWorker.prototype.resume=function(){if(!GenericWorker.prototype.resume.call(this)){return!1}
if(!this.previous&&this._sources.length){this.prepareNextSource();return!0}
if(!this.previous&&!this._sources.length&&!this.generatedError){this.end();return!0}};ZipFileWorker.prototype.error=function(e){var sources=this._sources;if(!GenericWorker.prototype.error.call(this,e)){return!1}
for(var i=0;i<sources.length;i++){try{sources[i].error(e)}catch(e){}}
return!0};ZipFileWorker.prototype.lock=function(){GenericWorker.prototype.lock.call(this);var sources=this._sources;for(var i=0;i<sources.length;i++){sources[i].lock()}};module.exports=ZipFileWorker},{"../crc32":41,"../signature":60,"../stream/GenericWorker":65,"../utf8":68,"../utils":69}],46:[function(require,module,exports){'use strict';var compressions=require('../compressions');var ZipFileWorker=require('./ZipFileWorker');var getCompression=function(fileCompression,zipCompression){var compressionName=fileCompression||zipCompression;var compression=compressions[compressionName];if(!compression){throw new Error(compressionName+" is not a valid compression method !")}
return compression};exports.generateWorker=function(zip,options,comment){var zipFileWorker=new ZipFileWorker(options.streamFiles,comment,options.platform,options.encodeFileName);var entriesCount=0;try{zip.forEach(function(relativePath,file){entriesCount++;var compression=getCompression(file.options.compression,options.compression);var compressionOptions=file.options.compressionOptions||options.compressionOptions||{};var dir=file.dir,date=file.date;file._compressWorker(compression,compressionOptions).withStreamInfo("file",{name:relativePath,dir:dir,date:date,comment:file.comment||"",unixPermissions:file.unixPermissions,dosPermissions:file.dosPermissions}).pipe(zipFileWorker)});zipFileWorker.entriesCount=entriesCount}catch(e){zipFileWorker.error(e)}
return zipFileWorker}},{"../compressions":40,"./ZipFileWorker":45}],47:[function(require,module,exports){'use strict';function JSZip(){if(!(this instanceof JSZip)){return new JSZip()}
if(arguments.length){throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.")}
this.files={};this.comment=null;this.root="";this.clone=function(){var newObj=new JSZip();for(var i in this){if(typeof this[i]!=="function"){newObj[i]=this[i]}}
return newObj}}
JSZip.prototype=require('./object');JSZip.prototype.loadAsync=require('./load');JSZip.support=require('./support');JSZip.defaults=require('./defaults');JSZip.version="3.1.3";JSZip.loadAsync=function(content,options){return new JSZip().loadAsync(content,options)};JSZip.external=require("./external");module.exports=JSZip},{"./defaults":42,"./external":43,"./load":48,"./object":52,"./support":67}],48:[function(require,module,exports){'use strict';var utils=require('./utils');var external=require("./external");var utf8=require('./utf8');var utils=require('./utils');var ZipEntries=require('./zipEntries');var Crc32Probe=require('./stream/Crc32Probe');var nodejsUtils=require("./nodejsUtils");function checkEntryCRC32(zipEntry){return new external.Promise(function(resolve,reject){var worker=zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());worker.on("error",function(e){reject(e)}).on("end",function(){if(worker.streamInfo.crc32!==zipEntry.decompressed.crc32){reject(new Error("Corrupted zip : CRC32 mismatch"))}else{resolve()}}).resume()})}
module.exports=function(data,options){var zip=this;options=utils.extend(options||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:utf8.utf8decode});if(nodejsUtils.isNode&&nodejsUtils.isStream(data)){return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."))}
return utils.prepareContent("the loaded zip file",data,!0,options.optimizedBinaryString,options.base64).then(function(data){var zipEntries=new ZipEntries(options);zipEntries.load(data);return zipEntries}).then(function checkCRC32(zipEntries){var promises=[external.Promise.resolve(zipEntries)];var files=zipEntries.files;if(options.checkCRC32){for(var i=0;i<files.length;i++){promises.push(checkEntryCRC32(files[i]))}}
return external.Promise.all(promises)}).then(function addFiles(results){var zipEntries=results.shift();var files=zipEntries.files;for(var i=0;i<files.length;i++){var input=files[i];zip.file(input.fileNameStr,input.decompressed,{binary:!0,optimizedBinaryString:!0,date:input.date,dir:input.dir,comment:input.fileCommentStr.length?input.fileCommentStr:null,unixPermissions:input.unixPermissions,dosPermissions:input.dosPermissions,createFolders:options.createFolders})}
if(zipEntries.zipComment.length){zip.comment=zipEntries.zipComment}
return zip})}},{"./external":43,"./nodejsUtils":51,"./stream/Crc32Probe":62,"./utf8":68,"./utils":69,"./zipEntries":70}],49:[function(require,module,exports){"use strict";var utils=require('../utils');var GenericWorker=require('../stream/GenericWorker');function NodejsStreamInputAdapter(filename,stream){GenericWorker.call(this,"Nodejs stream input adapter for "+filename);this._upstreamEnded=!1;this._bindStream(stream)}
utils.inherits(NodejsStreamInputAdapter,GenericWorker);NodejsStreamInputAdapter.prototype._bindStream=function(stream){var self=this;this._stream=stream;stream.pause();stream.on("data",function(chunk){self.push({data:chunk,meta:{percent:0}})}).on("error",function(e){if(self.isPaused){this.generatedError=e}else{self.error(e)}}).on("end",function(){if(self.isPaused){self._upstreamEnded=!0}else{self.end()}})};NodejsStreamInputAdapter.prototype.pause=function(){if(!GenericWorker.prototype.pause.call(this)){return!1}
this._stream.pause();return!0};NodejsStreamInputAdapter.prototype.resume=function(){if(!GenericWorker.prototype.resume.call(this)){return!1}
if(this._upstreamEnded){this.end()}else{this._stream.resume()}
return!0};module.exports=NodejsStreamInputAdapter},{"../stream/GenericWorker":65,"../utils":69}],50:[function(require,module,exports){'use strict';var Readable=require('readable-stream').Readable;var util=require('util');util.inherits(NodejsStreamOutputAdapter,Readable);function NodejsStreamOutputAdapter(helper,options,updateCb){Readable.call(this,options);this._helper=helper;var self=this;helper.on("data",function(data,meta){if(!self.push(data)){self._helper.pause()}
if(updateCb){updateCb(meta)}}).on("error",function(e){self.emit('error',e)}).on("end",function(){self.push(null)})}
NodejsStreamOutputAdapter.prototype._read=function(){this._helper.resume()};module.exports=NodejsStreamOutputAdapter},{"readable-stream":53,"util":107}],51:[function(require,module,exports){(function(Buffer){'use strict';module.exports={isNode:typeof Buffer!=="undefined",newBuffer:function(data,encoding){return new Buffer(data,encoding)},isBuffer:function(b){return Buffer.isBuffer(b)},isStream:function(obj){return obj&&typeof obj.on==="function"&&typeof obj.pause==="function"&&typeof obj.resume==="function"}}}).call(this,require("buffer").Buffer)},{"buffer":4}],52:[function(require,module,exports){'use strict';var utf8=require('./utf8');var utils=require('./utils');var GenericWorker=require('./stream/GenericWorker');var StreamHelper=require('./stream/StreamHelper');var defaults=require('./defaults');var CompressedObject=require('./compressedObject');var ZipObject=require('./zipObject');var generate=require("./generate");var nodejsUtils=require("./nodejsUtils");var NodejsStreamInputAdapter=require("./nodejs/NodejsStreamInputAdapter");var fileAdd=function(name,data,originalOptions){var dataType=utils.getTypeOf(data),parent;var o=utils.extend(originalOptions||{},defaults);o.date=o.date||new Date();if(o.compression!==null){o.compression=o.compression.toUpperCase()}
if(typeof o.unixPermissions==="string"){o.unixPermissions=parseInt(o.unixPermissions,8)}
if(o.unixPermissions&&(o.unixPermissions&0x4000)){o.dir=!0}
if(o.dosPermissions&&(o.dosPermissions&0x0010)){o.dir=!0}
if(o.dir){name=forceTrailingSlash(name)}
if(o.createFolders&&(parent=parentFolder(name))){folderAdd.call(this,parent,!0)}
var isUnicodeString=dataType==="string"&&o.binary===!1&&o.base64===!1;if(!originalOptions||typeof originalOptions.binary==="undefined"){o.binary=!isUnicodeString}
var isCompressedEmpty=(data instanceof CompressedObject)&&data.uncompressedSize===0;if(isCompressedEmpty||o.dir||!data||data.length===0){o.base64=!1;o.binary=!0;data="";o.compression="STORE";dataType="string"}
var zipObjectContent=null;if(data instanceof CompressedObject||data instanceof GenericWorker){zipObjectContent=data}else if(nodejsUtils.isNode&&nodejsUtils.isStream(data)){zipObjectContent=new NodejsStreamInputAdapter(name,data)}else{zipObjectContent=utils.prepareContent(name,data,o.binary,o.optimizedBinaryString,o.base64)}
var object=new ZipObject(name,zipObjectContent,o);this.files[name]=object};var parentFolder=function(path){if(path.slice(-1)==='/'){path=path.substring(0,path.length-1)}
var lastSlash=path.lastIndexOf('/');return(lastSlash>0)?path.substring(0,lastSlash):""};var forceTrailingSlash=function(path){if(path.slice(-1)!=="/"){path+="/"}
return path};var folderAdd=function(name,createFolders){createFolders=(typeof createFolders!=='undefined')?createFolders:defaults.createFolders;name=forceTrailingSlash(name);if(!this.files[name]){fileAdd.call(this,name,null,{dir:!0,createFolders:createFolders})}
return this.files[name]};function isRegExp(object){return Object.prototype.toString.call(object)==="[object RegExp]"}
var out={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(cb){var filename,relativePath,file;for(filename in this.files){if(!this.files.hasOwnProperty(filename)){continue}
file=this.files[filename];relativePath=filename.slice(this.root.length,filename.length);if(relativePath&&filename.slice(0,this.root.length)===this.root){cb(relativePath,file)}}},filter:function(search){var result=[];this.forEach(function(relativePath,entry){if(search(relativePath,entry)){result.push(entry)}});return result},file:function(name,data,o){if(arguments.length===1){if(isRegExp(name)){var regexp=name;return this.filter(function(relativePath,file){return!file.dir&&regexp.test(relativePath)})}else{var obj=this.files[this.root+name];if(obj&&!obj.dir){return obj}else{return null}}}else{name=this.root+name;fileAdd.call(this,name,data,o)}
return this},folder:function(arg){if(!arg){return this}
if(isRegExp(arg)){return this.filter(function(relativePath,file){return file.dir&&arg.test(relativePath)})}
var name=this.root+arg;var newFolder=folderAdd.call(this,name);var ret=this.clone();ret.root=newFolder.name;return ret},remove:function(name){name=this.root+name;var file=this.files[name];if(!file){if(name.slice(-1)!=="/"){name+="/"}
file=this.files[name]}
if(file&&!file.dir){delete this.files[name]}else{var kids=this.filter(function(relativePath,file){return file.name.slice(0,name.length)===name});for(var i=0;i<kids.length;i++){delete this.files[kids[i].name]}}
return this},generate:function(options){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(options){var worker,opts={};try{opts=utils.extend(options||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:'application/zip',encodeFileName:utf8.utf8encode});opts.type=opts.type.toLowerCase();opts.compression=opts.compression.toUpperCase();if(opts.type==="binarystring"){opts.type="string"}
if(!opts.type){throw new Error("No output type specified.")}
utils.checkSupport(opts.type);if(opts.platform==='darwin'||opts.platform==='freebsd'||opts.platform==='linux'||opts.platform==='sunos'){opts.platform="UNIX"}
if(opts.platform==='win32'){opts.platform="DOS"}
var comment=opts.comment||this.comment||"";worker=generate.generateWorker(this,opts,comment)}catch(e){worker=new GenericWorker("error");worker.error(e)}
return new StreamHelper(worker,opts.type||"string",opts.mimeType)},generateAsync:function(options,onUpdate){return this.generateInternalStream(options).accumulate(onUpdate)},generateNodeStream:function(options,onUpdate){options=options||{};if(!options.type){options.type="nodebuffer"}
return this.generateInternalStream(options).toNodejsStream(onUpdate)}};module.exports=out},{"./compressedObject":39,"./defaults":42,"./generate":46,"./nodejs/NodejsStreamInputAdapter":49,"./nodejsUtils":51,"./stream/GenericWorker":65,"./stream/StreamHelper":66,"./utf8":68,"./utils":69,"./zipObject":72}],53:[function(require,module,exports){module.exports=require("stream")},{"stream":102}],54:[function(require,module,exports){'use strict';var DataReader=require('./DataReader');var utils=require('../utils');function ArrayReader(data){DataReader.call(this,data);for(var i=0;i<this.data.length;i++){data[i]=data[i]&0xFF}}
utils.inherits(ArrayReader,DataReader);ArrayReader.prototype.byteAt=function(i){return this.data[this.zero+i]};ArrayReader.prototype.lastIndexOfSignature=function(sig){var sig0=sig.charCodeAt(0),sig1=sig.charCodeAt(1),sig2=sig.charCodeAt(2),sig3=sig.charCodeAt(3);for(var i=this.length-4;i>=0;--i){if(this.data[i]===sig0&&this.data[i+1]===sig1&&this.data[i+2]===sig2&&this.data[i+3]===sig3){return i-this.zero}}
return-1};ArrayReader.prototype.readAndCheckSignature=function(sig){var sig0=sig.charCodeAt(0),sig1=sig.charCodeAt(1),sig2=sig.charCodeAt(2),sig3=sig.charCodeAt(3),data=this.readData(4);return sig0===data[0]&&sig1===data[1]&&sig2===data[2]&&sig3===data[3]};ArrayReader.prototype.readData=function(size){this.checkOffset(size);if(size===0){return[]}
var result=this.data.slice(this.zero+this.index,this.zero+this.index+size);this.index+=size;return result};module.exports=ArrayReader},{"../utils":69,"./DataReader":55}],55:[function(require,module,exports){'use strict';var utils=require('../utils');function DataReader(data){this.data=data;this.length=data.length;this.index=0;this.zero=0}
DataReader.prototype={checkOffset:function(offset){this.checkIndex(this.index+offset)},checkIndex:function(newIndex){if(this.length<this.zero+newIndex||newIndex<0){throw new Error("End of data reached (data length = "+this.length+", asked index = "+(newIndex)+"). Corrupted zip ?")}},setIndex:function(newIndex){this.checkIndex(newIndex);this.index=newIndex},skip:function(n){this.setIndex(this.index+n)},byteAt:function(i){},readInt:function(size){var result=0,i;this.checkOffset(size);for(i=this.index+size-1;i>=this.index;i--){result=(result<<8)+this.byteAt(i)}
this.index+=size;return result},readString:function(size){return utils.transformTo("string",this.readData(size))},readData:function(size){},lastIndexOfSignature:function(sig){},readAndCheckSignature:function(sig){},readDate:function(){var dostime=this.readInt(4);return new Date(Date.UTC(((dostime>>25)&0x7f)+1980,((dostime>>21)&0x0f)-1,(dostime>>16)&0x1f,(dostime>>11)&0x1f,(dostime>>5)&0x3f,(dostime&0x1f)<<1))}};module.exports=DataReader},{"../utils":69}],56:[function(require,module,exports){'use strict';var Uint8ArrayReader=require('./Uint8ArrayReader');var utils=require('../utils');function NodeBufferReader(data){Uint8ArrayReader.call(this,data)}
utils.inherits(NodeBufferReader,Uint8ArrayReader);NodeBufferReader.prototype.readData=function(size){this.checkOffset(size);var result=this.data.slice(this.zero+this.index,this.zero+this.index+size);this.index+=size;return result};module.exports=NodeBufferReader},{"../utils":69,"./Uint8ArrayReader":58}],57:[function(require,module,exports){'use strict';var DataReader=require('./DataReader');var utils=require('../utils');function StringReader(data){DataReader.call(this,data)}
utils.inherits(StringReader,DataReader);StringReader.prototype.byteAt=function(i){return this.data.charCodeAt(this.zero+i)};StringReader.prototype.lastIndexOfSignature=function(sig){return this.data.lastIndexOf(sig)-this.zero};StringReader.prototype.readAndCheckSignature=function(sig){var data=this.readData(4);return sig===data};StringReader.prototype.readData=function(size){this.checkOffset(size);var result=this.data.slice(this.zero+this.index,this.zero+this.index+size);this.index+=size;return result};module.exports=StringReader},{"../utils":69,"./DataReader":55}],58:[function(require,module,exports){'use strict';var ArrayReader=require('./ArrayReader');var utils=require('../utils');function Uint8ArrayReader(data){ArrayReader.call(this,data)}
utils.inherits(Uint8ArrayReader,ArrayReader);Uint8ArrayReader.prototype.readData=function(size){this.checkOffset(size);if(size===0){return new Uint8Array(0)}
var result=this.data.subarray(this.zero+this.index,this.zero+this.index+size);this.index+=size;return result};module.exports=Uint8ArrayReader},{"../utils":69,"./ArrayReader":54}],59:[function(require,module,exports){'use strict';var utils=require('../utils');var support=require('../support');var ArrayReader=require('./ArrayReader');var StringReader=require('./StringReader');var NodeBufferReader=require('./NodeBufferReader');var Uint8ArrayReader=require('./Uint8ArrayReader');module.exports=function(data){var type=utils.getTypeOf(data);utils.checkSupport(type);if(type==="string"&&!support.uint8array){return new StringReader(data)}
if(type==="nodebuffer"){return new NodeBufferReader(data)}
if(support.uint8array){return new Uint8ArrayReader(utils.transformTo("uint8array",data))}
return new ArrayReader(utils.transformTo("array",data))}},{"../support":67,"../utils":69,"./ArrayReader":54,"./NodeBufferReader":56,"./StringReader":57,"./Uint8ArrayReader":58}],60:[function(require,module,exports){'use strict';exports.LOCAL_FILE_HEADER="PK\x03\x04";exports.CENTRAL_FILE_HEADER="PK\x01\x02";exports.CENTRAL_DIRECTORY_END="PK\x05\x06";exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x06\x07";exports.ZIP64_CENTRAL_DIRECTORY_END="PK\x06\x06";exports.DATA_DESCRIPTOR="PK\x07\x08"},{}],61:[function(require,module,exports){'use strict';var GenericWorker=require('./GenericWorker');var utils=require('../utils');function ConvertWorker(destType){GenericWorker.call(this,"ConvertWorker to "+destType);this.destType=destType}
utils.inherits(ConvertWorker,GenericWorker);ConvertWorker.prototype.processChunk=function(chunk){this.push({data:utils.transformTo(this.destType,chunk.data),meta:chunk.meta})};module.exports=ConvertWorker},{"../utils":69,"./GenericWorker":65}],62:[function(require,module,exports){'use strict';var GenericWorker=require('./GenericWorker');var crc32=require('../crc32');var utils=require('../utils');function Crc32Probe(){GenericWorker.call(this,"Crc32Probe");this.withStreamInfo("crc32",0)}
utils.inherits(Crc32Probe,GenericWorker);Crc32Probe.prototype.processChunk=function(chunk){this.streamInfo.crc32=crc32(chunk.data,this.streamInfo.crc32||0);this.push(chunk)};module.exports=Crc32Probe},{"../crc32":41,"../utils":69,"./GenericWorker":65}],63:[function(require,module,exports){'use strict';var utils=require('../utils');var GenericWorker=require('./GenericWorker');function DataLengthProbe(propName){GenericWorker.call(this,"DataLengthProbe for "+propName);this.propName=propName;this.withStreamInfo(propName,0)}
utils.inherits(DataLengthProbe,GenericWorker);DataLengthProbe.prototype.processChunk=function(chunk){if(chunk){var length=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=length+chunk.data.length}
GenericWorker.prototype.processChunk.call(this,chunk)};module.exports=DataLengthProbe},{"../utils":69,"./GenericWorker":65}],64:[function(require,module,exports){'use strict';var utils=require('../utils');var GenericWorker=require('./GenericWorker');var DEFAULT_BLOCK_SIZE=16*1024;function DataWorker(dataP){GenericWorker.call(this,"DataWorker");var self=this;this.dataIsReady=!1;this.index=0;this.max=0;this.data=null;this.type="";this._tickScheduled=!1;dataP.then(function(data){self.dataIsReady=!0;self.data=data;self.max=data&&data.length||0;self.type=utils.getTypeOf(data);if(!self.isPaused){self._tickAndRepeat()}},function(e){self.error(e)})}
utils.inherits(DataWorker,GenericWorker);DataWorker.prototype.cleanUp=function(){GenericWorker.prototype.cleanUp.call(this);this.data=null};DataWorker.prototype.resume=function(){if(!GenericWorker.prototype.resume.call(this)){return!1}
if(!this._tickScheduled&&this.dataIsReady){this._tickScheduled=!0;utils.delay(this._tickAndRepeat,[],this)}
return!0};DataWorker.prototype._tickAndRepeat=function(){this._tickScheduled=!1;if(this.isPaused||this.isFinished){return}
this._tick();if(!this.isFinished){utils.delay(this._tickAndRepeat,[],this);this._tickScheduled=!0}};DataWorker.prototype._tick=function(){if(this.isPaused||this.isFinished){return!1}
var size=DEFAULT_BLOCK_SIZE;var data=null,nextIndex=Math.min(this.max,this.index+size);if(this.index>=this.max){return this.end()}else{switch(this.type){case "string":data=this.data.substring(this.index,nextIndex);break;case "uint8array":data=this.data.subarray(this.index,nextIndex);break;case "array":case "nodebuffer":data=this.data.slice(this.index,nextIndex);break}
this.index=nextIndex;return this.push({data:data,meta:{percent:this.max?this.index/this.max*100:0}})}};module.exports=DataWorker},{"../utils":69,"./GenericWorker":65}],65:[function(require,module,exports){'use strict';function GenericWorker(name){this.name=name||"default";this.streamInfo={};this.generatedError=null;this.extraStreamInfo={};this.isPaused=!0;this.isFinished=!1;this.isLocked=!1;this._listeners={'data':[],'end':[],'error':[]};this.previous=null}
GenericWorker.prototype={push:function(chunk){this.emit("data",chunk)},end:function(){if(this.isFinished){return!1}
this.flush();try{this.emit("end");this.cleanUp();this.isFinished=!0}catch(e){this.emit("error",e)}
return!0},error:function(e){if(this.isFinished){return!1}
if(this.isPaused){this.generatedError=e}else{this.isFinished=!0;this.emit("error",e);if(this.previous){this.previous.error(e)}
this.cleanUp()}
return!0},on:function(name,listener){this._listeners[name].push(listener);return this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null;this._listeners=[]},emit:function(name,arg){if(this._listeners[name]){for(var i=0;i<this._listeners[name].length;i++){this._listeners[name][i].call(this,arg)}}},pipe:function(next){return next.registerPrevious(this)},registerPrevious:function(previous){if(this.isLocked){throw new Error("The stream '"+this+"' has already been used.")}
this.streamInfo=previous.streamInfo;this.mergeStreamInfo();this.previous=previous;var self=this;previous.on('data',function(chunk){self.processChunk(chunk)});previous.on('end',function(){self.end()});previous.on('error',function(e){self.error(e)});return this},pause:function(){if(this.isPaused||this.isFinished){return!1}
this.isPaused=!0;if(this.previous){this.previous.pause()}
return!0},resume:function(){if(!this.isPaused||this.isFinished){return!1}
this.isPaused=!1;var withError=!1;if(this.generatedError){this.error(this.generatedError);withError=!0}
if(this.previous){this.previous.resume()}
return!withError},flush:function(){},processChunk:function(chunk){this.push(chunk)},withStreamInfo:function(key,value){this.extraStreamInfo[key]=value;this.mergeStreamInfo();return this},mergeStreamInfo:function(){for(var key in this.extraStreamInfo){if(!this.extraStreamInfo.hasOwnProperty(key)){continue}
this.streamInfo[key]=this.extraStreamInfo[key]}},lock:function(){if(this.isLocked){throw new Error("The stream '"+this+"' has already been used.")}
this.isLocked=!0;if(this.previous){this.previous.lock()}},toString:function(){var me="Worker "+this.name;if(this.previous){return this.previous+" -> "+me}else{return me}}};module.exports=GenericWorker},{}],66:[function(require,module,exports){(function(Buffer){'use strict';var utils=require('../utils');var ConvertWorker=require('./ConvertWorker');var GenericWorker=require('./GenericWorker');var base64=require('../base64');var support=require("../support");var external=require("../external");var NodejsStreamOutputAdapter=null;if(support.nodestream){try{NodejsStreamOutputAdapter=require('../nodejs/NodejsStreamOutputAdapter')}catch(e){}}
function transformZipOutput(resultType,chunkType,dataArray,mimeType){var content=null;switch(resultType){case "blob":return utils.newBlob(dataArray,mimeType);case "base64":content=concat(chunkType,dataArray);return base64.encode(content);default:content=concat(chunkType,dataArray);return utils.transformTo(resultType,content)}}
function concat(type,dataArray){var i,index=0,res=null,totalLength=0;for(i=0;i<dataArray.length;i++){totalLength+=dataArray[i].length}
switch(type){case "string":return dataArray.join("");case "array":return Array.prototype.concat.apply([],dataArray);case "uint8array":res=new Uint8Array(totalLength);for(i=0;i<dataArray.length;i++){res.set(dataArray[i],index);index+=dataArray[i].length}
return res;case "nodebuffer":return Buffer.concat(dataArray);default:throw new Error("concat : unsupported type '"+type+"'")}}
function accumulate(helper,updateCallback){return new external.Promise(function(resolve,reject){var dataArray=[];var chunkType=helper._internalType,resultType=helper._outputType,mimeType=helper._mimeType;helper.on('data',function(data,meta){dataArray.push(data);if(updateCallback){updateCallback(meta)}}).on('error',function(err){dataArray=[];reject(err)}).on('end',function(){try{var result=transformZipOutput(resultType,chunkType,dataArray,mimeType);resolve(result)}catch(e){reject(e)}
dataArray=[]}).resume()})}
function StreamHelper(worker,outputType,mimeType){var internalType=outputType;switch(outputType){case "blob":internalType="arraybuffer";break;case "arraybuffer":internalType="uint8array";break;case "base64":internalType="string";break}
try{this._internalType=internalType;this._outputType=outputType;this._mimeType=mimeType;utils.checkSupport(internalType);this._worker=worker.pipe(new ConvertWorker(internalType));worker.lock()}catch(e){this._worker=new GenericWorker("error");this._worker.error(e)}}
StreamHelper.prototype={accumulate:function(updateCb){return accumulate(this,updateCb)},on:function(evt,fn){var self=this;if(evt==="data"){this._worker.on(evt,function(chunk){fn.call(self,chunk.data,chunk.meta)})}else{this._worker.on(evt,function(){utils.delay(fn,arguments,self)})}
return this},resume:function(){utils.delay(this._worker.resume,[],this._worker);return this},pause:function(){this._worker.pause();return this},toNodejsStream:function(updateCb){utils.checkSupport("nodestream");if(this._outputType!=="nodebuffer"){throw new Error(this._outputType+" is not supported by this method")}
return new NodejsStreamOutputAdapter(this,{objectMode:this._outputType!=="nodebuffer"},updateCb)}};module.exports=StreamHelper}).call(this,require("buffer").Buffer)},{"../base64":38,"../external":43,"../nodejs/NodejsStreamOutputAdapter":50,"../support":67,"../utils":69,"./ConvertWorker":61,"./GenericWorker":65,"buffer":4}],67:[function(require,module,exports){(function(Buffer){'use strict';exports.base64=!0;exports.array=!0;exports.string=!0;exports.arraybuffer=typeof ArrayBuffer!=="undefined"&&typeof Uint8Array!=="undefined";exports.nodebuffer=typeof Buffer!=="undefined";exports.uint8array=typeof Uint8Array!=="undefined";if(typeof ArrayBuffer==="undefined"){exports.blob=!1}else{var buffer=new ArrayBuffer(0);try{exports.blob=new Blob([buffer],{type:"application/zip"}).size===0}catch(e){try{var Builder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;var builder=new Builder();builder.append(buffer);exports.blob=builder.getBlob('application/zip').size===0}catch(e){exports.blob=!1}}}
try{exports.nodestream=!!require('readable-stream').Readable}catch(e){exports.nodestream=!1}}).call(this,require("buffer").Buffer)},{"buffer":4,"readable-stream":53}],68:[function(require,module,exports){'use strict';var utils=require('./utils');var support=require('./support');var nodejsUtils=require('./nodejsUtils');var GenericWorker=require('./stream/GenericWorker');var _utf8len=new Array(256);for(var i=0;i<256;i++){_utf8len[i]=(i>=252?6:i>=248?5:i>=240?4:i>=224?3:i>=192?2:1)}
_utf8len[254]=_utf8len[254]=1;var string2buf=function(str){var buf,c,c2,m_pos,i,str_len=str.length,buf_len=0;for(m_pos=0;m_pos<str_len;m_pos++){c=str.charCodeAt(m_pos);if((c&0xfc00)===0xd800&&(m_pos+1<str_len)){c2=str.charCodeAt(m_pos+1);if((c2&0xfc00)===0xdc00){c=0x10000+((c-0xd800)<<10)+(c2-0xdc00);m_pos++}}
buf_len+=c<0x80?1:c<0x800?2:c<0x10000?3:4}
if(support.uint8array){buf=new Uint8Array(buf_len)}else{buf=new Array(buf_len)}
for(i=0,m_pos=0;i<buf_len;m_pos++){c=str.charCodeAt(m_pos);if((c&0xfc00)===0xd800&&(m_pos+1<str_len)){c2=str.charCodeAt(m_pos+1);if((c2&0xfc00)===0xdc00){c=0x10000+((c-0xd800)<<10)+(c2-0xdc00);m_pos++}}
if(c<0x80){buf[i++]=c}else if(c<0x800){buf[i++]=0xC0|(c>>>6);buf[i++]=0x80|(c&0x3f)}else if(c<0x10000){buf[i++]=0xE0|(c>>>12);buf[i++]=0x80|(c>>>6&0x3f);buf[i++]=0x80|(c&0x3f)}else{buf[i++]=0xf0|(c>>>18);buf[i++]=0x80|(c>>>12&0x3f);buf[i++]=0x80|(c>>>6&0x3f);buf[i++]=0x80|(c&0x3f)}}
return buf};var utf8border=function(buf,max){var pos;max=max||buf.length;if(max>buf.length){max=buf.length}
pos=max-1;while(pos>=0&&(buf[pos]&0xC0)===0x80){pos--}
if(pos<0){return max}
if(pos===0){return max}
return(pos+_utf8len[buf[pos]]>max)?pos:max};var buf2string=function(buf){var str,i,out,c,c_len;var len=buf.length;var utf16buf=new Array(len*2);for(out=0,i=0;i<len;){c=buf[i++];if(c<0x80){utf16buf[out++]=c;continue}
c_len=_utf8len[c];if(c_len>4){utf16buf[out++]=0xfffd;i+=c_len-1;continue}
c&=c_len===2?0x1f:c_len===3?0x0f:0x07;while(c_len>1&&i<len){c=(c<<6)|(buf[i++]&0x3f);c_len--}
if(c_len>1){utf16buf[out++]=0xfffd;continue}
if(c<0x10000){utf16buf[out++]=c}else{c-=0x10000;utf16buf[out++]=0xd800|((c>>10)&0x3ff);utf16buf[out++]=0xdc00|(c&0x3ff)}}
if(utf16buf.length!==out){if(utf16buf.subarray){utf16buf=utf16buf.subarray(0,out)}else{utf16buf.length=out}}
return utils.applyFromCharCode(utf16buf)};exports.utf8encode=function utf8encode(str){if(support.nodebuffer){return nodejsUtils.newBuffer(str,"utf-8")}
return string2buf(str)};exports.utf8decode=function utf8decode(buf){if(support.nodebuffer){return utils.transformTo("nodebuffer",buf).toString("utf-8")}
buf=utils.transformTo(support.uint8array?"uint8array":"array",buf);return buf2string(buf)};function Utf8DecodeWorker(){GenericWorker.call(this,"utf-8 decode");this.leftOver=null}
utils.inherits(Utf8DecodeWorker,GenericWorker);Utf8DecodeWorker.prototype.processChunk=function(chunk){var data=utils.transformTo(support.uint8array?"uint8array":"array",chunk.data);if(this.leftOver&&this.leftOver.length){if(support.uint8array){var previousData=data;data=new Uint8Array(previousData.length+this.leftOver.length);data.set(this.leftOver,0);data.set(previousData,this.leftOver.length)}else{data=this.leftOver.concat(data)}
this.leftOver=null}
var nextBoundary=utf8border(data);var usableData=data;if(nextBoundary!==data.length){if(support.uint8array){usableData=data.subarray(0,nextBoundary);this.leftOver=data.subarray(nextBoundary,data.length)}else{usableData=data.slice(0,nextBoundary);this.leftOver=data.slice(nextBoundary,data.length)}}
this.push({data:exports.utf8decode(usableData),meta:chunk.meta})};Utf8DecodeWorker.prototype.flush=function(){if(this.leftOver&&this.leftOver.length){this.push({data:exports.utf8decode(this.leftOver),meta:{}});this.leftOver=null}};exports.Utf8DecodeWorker=Utf8DecodeWorker;function Utf8EncodeWorker(){GenericWorker.call(this,"utf-8 encode")}
utils.inherits(Utf8EncodeWorker,GenericWorker);Utf8EncodeWorker.prototype.processChunk=function(chunk){this.push({data:exports.utf8encode(chunk.data),meta:chunk.meta})};exports.Utf8EncodeWorker=Utf8EncodeWorker},{"./nodejsUtils":51,"./stream/GenericWorker":65,"./support":67,"./utils":69}],69:[function(require,module,exports){'use strict';var support=require('./support');var base64=require('./base64');var nodejsUtils=require('./nodejsUtils');var setImmediate=require('core-js/library/fn/set-immediate');var external=require("./external");function string2binary(str){var result=null;if(support.uint8array){result=new Uint8Array(str.length)}else{result=new Array(str.length)}
return stringToArrayLike(str,result)}
exports.newBlob=function(parts,type){exports.checkSupport("blob");try{return new Blob(parts,{type:type})}catch(e){try{var Builder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;var builder=new Builder();for(var i=0;i<parts.length;i++){builder.append(parts[i])}
return builder.getBlob(type)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};function identity(input){return input}
function stringToArrayLike(str,array){for(var i=0;i<str.length;++i){array[i]=str.charCodeAt(i)&0xFF}
return array}
var arrayToStringHelper={stringifyByChunk:function(array,type,chunk){var result=[],k=0,len=array.length;if(len<=chunk){return String.fromCharCode.apply(null,array)}
while(k<len){if(type==="array"||type==="nodebuffer"){result.push(String.fromCharCode.apply(null,array.slice(k,Math.min(k+chunk,len))))}else{result.push(String.fromCharCode.apply(null,array.subarray(k,Math.min(k+chunk,len))))}
k+=chunk}
return result.join("")},stringifyByChar:function(array){var resultStr="";for(var i=0;i<array.length;i++){resultStr+=String.fromCharCode(array[i])}
return resultStr},applyCanBeUsed:{uint8array:(function(){try{return support.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch(e){return!1}})(),nodebuffer:(function(){try{return support.nodebuffer&&String.fromCharCode.apply(null,nodejsUtils.newBuffer(1)).length===1}catch(e){return!1}})()}};function arrayLikeToString(array){var chunk=65536,type=exports.getTypeOf(array),canUseApply=!0;if(type==="uint8array"){canUseApply=arrayToStringHelper.applyCanBeUsed.uint8array}else if(type==="nodebuffer"){canUseApply=arrayToStringHelper.applyCanBeUsed.nodebuffer}
if(canUseApply){while(chunk>1){try{return arrayToStringHelper.stringifyByChunk(array,type,chunk)}catch(e){chunk=Math.floor(chunk/2)}}}
return arrayToStringHelper.stringifyByChar(array)}
exports.applyFromCharCode=arrayLikeToString;function arrayLikeToArrayLike(arrayFrom,arrayTo){for(var i=0;i<arrayFrom.length;i++){arrayTo[i]=arrayFrom[i]}
return arrayTo}
var transform={};transform.string={"string":identity,"array":function(input){return stringToArrayLike(input,new Array(input.length))},"arraybuffer":function(input){return transform.string.uint8array(input).buffer},"uint8array":function(input){return stringToArrayLike(input,new Uint8Array(input.length))},"nodebuffer":function(input){return stringToArrayLike(input,nodejsUtils.newBuffer(input.length))}};transform.array={"string":arrayLikeToString,"array":identity,"arraybuffer":function(input){return(new Uint8Array(input)).buffer},"uint8array":function(input){return new Uint8Array(input)},"nodebuffer":function(input){return nodejsUtils.newBuffer(input)}};transform.arraybuffer={"string":function(input){return arrayLikeToString(new Uint8Array(input))},"array":function(input){return arrayLikeToArrayLike(new Uint8Array(input),new Array(input.byteLength))},"arraybuffer":identity,"uint8array":function(input){return new Uint8Array(input)},"nodebuffer":function(input){return nodejsUtils.newBuffer(new Uint8Array(input))}};transform.uint8array={"string":arrayLikeToString,"array":function(input){return arrayLikeToArrayLike(input,new Array(input.length))},"arraybuffer":function(input){var copy=new Uint8Array(input.length);if(input.length){copy.set(input,0)}
return copy.buffer},"uint8array":identity,"nodebuffer":function(input){return nodejsUtils.newBuffer(input)}};transform.nodebuffer={"string":arrayLikeToString,"array":function(input){return arrayLikeToArrayLike(input,new Array(input.length))},"arraybuffer":function(input){return transform.nodebuffer.uint8array(input).buffer},"uint8array":function(input){return arrayLikeToArrayLike(input,new Uint8Array(input.length))},"nodebuffer":identity};exports.transformTo=function(outputType,input){if(!input){input=""}
if(!outputType){return input}
exports.checkSupport(outputType);var inputType=exports.getTypeOf(input);var result=transform[inputType][outputType](input);return result};exports.getTypeOf=function(input){if(typeof input==="string"){return"string"}
if(Object.prototype.toString.call(input)==="[object Array]"){return"array"}
if(support.nodebuffer&&nodejsUtils.isBuffer(input)){return"nodebuffer"}
if(support.uint8array&&input instanceof Uint8Array){return"uint8array"}
if(support.arraybuffer&&input instanceof ArrayBuffer){return"arraybuffer"}};exports.checkSupport=function(type){var supported=support[type.toLowerCase()];if(!supported){throw new Error(type+" is not supported by this platform")}};exports.MAX_VALUE_16BITS=65535;exports.MAX_VALUE_32BITS=-1;exports.pretty=function(str){var res='',code,i;for(i=0;i<(str||"").length;i++){code=str.charCodeAt(i);res+='\\x'+(code<16?"0":"")+code.toString(16).toUpperCase()}
return res};exports.delay=function(callback,args,self){setImmediate(function(){callback.apply(self||null,args||[])})};exports.inherits=function(ctor,superCtor){var Obj=function(){};Obj.prototype=superCtor.prototype;ctor.prototype=new Obj()};exports.extend=function(){var result={},i,attr;for(i=0;i<arguments.length;i++){for(attr in arguments[i]){if(arguments[i].hasOwnProperty(attr)&&typeof result[attr]==="undefined"){result[attr]=arguments[i][attr]}}}
return result};exports.prepareContent=function(name,inputData,isBinary,isOptimizedBinaryString,isBase64){var promise=external.Promise.resolve(inputData).then(function(data){var isBlob=support.blob&&(data instanceof Blob||['[object File]','[object Blob]'].indexOf(Object.prototype.toString.call(data))!==-1);if(isBlob&&typeof FileReader!=="undefined"){return new external.Promise(function(resolve,reject){var reader=new FileReader();reader.onload=function(e){resolve(e.target.result)};reader.onerror=function(e){reject(e.target.error)};reader.readAsArrayBuffer(data)})}else{return data}});return promise.then(function(data){var dataType=exports.getTypeOf(data);if(!dataType){return external.Promise.reject(new Error("The data of '"+name+"' is in an unsupported format !"))}
if(dataType==="arraybuffer"){data=exports.transformTo("uint8array",data)}else if(dataType==="string"){if(isBase64){data=base64.decode(data)}else if(isBinary){if(isOptimizedBinaryString!==!0){data=string2binary(data)}}}
return data})}},{"./base64":38,"./external":43,"./nodejsUtils":51,"./support":67,"core-js/library/fn/set-immediate":5}],70:[function(require,module,exports){'use strict';var readerFor=require('./reader/readerFor');var utils=require('./utils');var sig=require('./signature');var ZipEntry=require('./zipEntry');var utf8=require('./utf8');var support=require('./support');function ZipEntries(loadOptions){this.files=[];this.loadOptions=loadOptions}
ZipEntries.prototype={checkSignature:function(expectedSignature){if(!this.reader.readAndCheckSignature(expectedSignature)){this.reader.index-=4;var signature=this.reader.readString(4);throw new Error("Corrupted zip or bug : unexpected signature "+"("+utils.pretty(signature)+", expected "+utils.pretty(expectedSignature)+")")}},isSignature:function(askedIndex,expectedSignature){var currentIndex=this.reader.index;this.reader.setIndex(askedIndex);var signature=this.reader.readString(4);var result=signature===expectedSignature;this.reader.setIndex(currentIndex);return result},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2);this.diskWithCentralDirStart=this.reader.readInt(2);this.centralDirRecordsOnThisDisk=this.reader.readInt(2);this.centralDirRecords=this.reader.readInt(2);this.centralDirSize=this.reader.readInt(4);this.centralDirOffset=this.reader.readInt(4);this.zipCommentLength=this.reader.readInt(2);var zipComment=this.reader.readData(this.zipCommentLength);var decodeParamType=support.uint8array?"uint8array":"array";var decodeContent=utils.transformTo(decodeParamType,zipComment);this.zipComment=this.loadOptions.decodeFileName(decodeContent)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8);this.reader.skip(4);this.diskNumber=this.reader.readInt(4);this.diskWithCentralDirStart=this.reader.readInt(4);this.centralDirRecordsOnThisDisk=this.reader.readInt(8);this.centralDirRecords=this.reader.readInt(8);this.centralDirSize=this.reader.readInt(8);this.centralDirOffset=this.reader.readInt(8);this.zip64ExtensibleData={};var extraDataSize=this.zip64EndOfCentralSize-44,index=0,extraFieldId,extraFieldLength,extraFieldValue;while(index<extraDataSize){extraFieldId=this.reader.readInt(2);extraFieldLength=this.reader.readInt(4);extraFieldValue=this.reader.readData(extraFieldLength);this.zip64ExtensibleData[extraFieldId]={id:extraFieldId,length:extraFieldLength,value:extraFieldValue}}},readBlockZip64EndOfCentralLocator:function(){this.diskWithZip64CentralDirStart=this.reader.readInt(4);this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8);this.disksCount=this.reader.readInt(4);if(this.disksCount>1){throw new Error("Multi-volumes zip are not supported")}},readLocalFiles:function(){var i,file;for(i=0;i<this.files.length;i++){file=this.files[i];this.reader.setIndex(file.localHeaderOffset);this.checkSignature(sig.LOCAL_FILE_HEADER);file.readLocalPart(this.reader);file.handleUTF8();file.processAttributes()}},readCentralDir:function(){var file;this.reader.setIndex(this.centralDirOffset);while(this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)){file=new ZipEntry({zip64:this.zip64},this.loadOptions);file.readCentralPart(this.reader);this.files.push(file)}
if(this.centralDirRecords!==this.files.length){if(this.centralDirRecords!==0&&this.files.length===0){throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)}else{}}},readEndOfCentral:function(){var offset=this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);if(offset<0){var isGarbage=!this.isSignature(0,sig.LOCAL_FILE_HEADER);if(isGarbage){throw new Error("Can't find end of central directory : is this a zip file ? "+"If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html")}else{throw new Error("Corrupted zip : can't find end of central directory")}}
this.reader.setIndex(offset);var endOfCentralDirOffset=offset;this.checkSignature(sig.CENTRAL_DIRECTORY_END);this.readBlockEndOfCentral();if(this.diskNumber===utils.MAX_VALUE_16BITS||this.diskWithCentralDirStart===utils.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===utils.MAX_VALUE_16BITS||this.centralDirRecords===utils.MAX_VALUE_16BITS||this.centralDirSize===utils.MAX_VALUE_32BITS||this.centralDirOffset===utils.MAX_VALUE_32BITS){this.zip64=!0;offset=this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);if(offset<0){throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator")}
this.reader.setIndex(offset);this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);this.readBlockZip64EndOfCentralLocator();if(!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,sig.ZIP64_CENTRAL_DIRECTORY_END)){this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);if(this.relativeOffsetEndOfZip64CentralDir<0){throw new Error("Corrupted zip : can't find the ZIP64 end of central directory")}}
this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);this.readBlockZip64EndOfCentral()}
var expectedEndOfCentralDirOffset=this.centralDirOffset+this.centralDirSize;if(this.zip64){expectedEndOfCentralDirOffset+=20;expectedEndOfCentralDirOffset+=12+this.zip64EndOfCentralSize}
var extraBytes=endOfCentralDirOffset-expectedEndOfCentralDirOffset;if(extraBytes>0){if(this.isSignature(endOfCentralDirOffset,sig.CENTRAL_FILE_HEADER)){}else{this.reader.zero=extraBytes}}else if(extraBytes<0){throw new Error("Corrupted zip: missing "+Math.abs(extraBytes)+" bytes.")}},prepareReader:function(data){this.reader=readerFor(data)},load:function(data){this.prepareReader(data);this.readEndOfCentral();this.readCentralDir();this.readLocalFiles()}};module.exports=ZipEntries},{"./reader/readerFor":59,"./signature":60,"./support":67,"./utf8":68,"./utils":69,"./zipEntry":71}],71:[function(require,module,exports){'use strict';var readerFor=require('./reader/readerFor');var utils=require('./utils');var CompressedObject=require('./compressedObject');var crc32fn=require('./crc32');var utf8=require('./utf8');var compressions=require('./compressions');var support=require('./support');var MADE_BY_DOS=0x00;var MADE_BY_UNIX=0x03;var findCompression=function(compressionMethod){for(var method in compressions){if(!compressions.hasOwnProperty(method)){continue}
if(compressions[method].magic===compressionMethod){return compressions[method]}}
return null};function ZipEntry(options,loadOptions){this.options=options;this.loadOptions=loadOptions}
ZipEntry.prototype={isEncrypted:function(){return(this.bitFlag&0x0001)===0x0001},useUTF8:function(){return(this.bitFlag&0x0800)===0x0800},readLocalPart:function(reader){var compression,localExtraFieldsLength;reader.skip(22);this.fileNameLength=reader.readInt(2);localExtraFieldsLength=reader.readInt(2);this.fileName=reader.readData(this.fileNameLength);reader.skip(localExtraFieldsLength);if(this.compressedSize===-1||this.uncompressedSize===-1){throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory "+"(compressedSize === -1 || uncompressedSize === -1)")}
compression=findCompression(this.compressionMethod);if(compression===null){throw new Error("Corrupted zip : compression "+utils.pretty(this.compressionMethod)+" unknown (inner file : "+utils.transformTo("string",this.fileName)+")")}
this.decompressed=new CompressedObject(this.compressedSize,this.uncompressedSize,this.crc32,compression,reader.readData(this.compressedSize))},readCentralPart:function(reader){this.versionMadeBy=reader.readInt(2);reader.skip(2);this.bitFlag=reader.readInt(2);this.compressionMethod=reader.readString(2);this.date=reader.readDate();this.crc32=reader.readInt(4);this.compressedSize=reader.readInt(4);this.uncompressedSize=reader.readInt(4);var fileNameLength=reader.readInt(2);this.extraFieldsLength=reader.readInt(2);this.fileCommentLength=reader.readInt(2);this.diskNumberStart=reader.readInt(2);this.internalFileAttributes=reader.readInt(2);this.externalFileAttributes=reader.readInt(4);this.localHeaderOffset=reader.readInt(4);if(this.isEncrypted()){throw new Error("Encrypted zip are not supported")}
reader.skip(fileNameLength);this.readExtraFields(reader);this.parseZIP64ExtraField(reader);this.fileComment=reader.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null;this.dosPermissions=null;var madeBy=this.versionMadeBy>>8;this.dir=this.externalFileAttributes&0x0010?!0:!1;if(madeBy===MADE_BY_DOS){this.dosPermissions=this.externalFileAttributes&0x3F}
if(madeBy===MADE_BY_UNIX){this.unixPermissions=(this.externalFileAttributes>>16)&0xFFFF}
if(!this.dir&&this.fileNameStr.slice(-1)==='/'){this.dir=!0}},parseZIP64ExtraField:function(reader){if(!this.extraFields[0x0001]){return}
var extraReader=readerFor(this.extraFields[0x0001].value);if(this.uncompressedSize===utils.MAX_VALUE_32BITS){this.uncompressedSize=extraReader.readInt(8)}
if(this.compressedSize===utils.MAX_VALUE_32BITS){this.compressedSize=extraReader.readInt(8)}
if(this.localHeaderOffset===utils.MAX_VALUE_32BITS){this.localHeaderOffset=extraReader.readInt(8)}
if(this.diskNumberStart===utils.MAX_VALUE_32BITS){this.diskNumberStart=extraReader.readInt(4)}},readExtraFields:function(reader){var end=reader.index+this.extraFieldsLength,extraFieldId,extraFieldLength,extraFieldValue;if(!this.extraFields){this.extraFields={}}
while(reader.index<end){extraFieldId=reader.readInt(2);extraFieldLength=reader.readInt(2);extraFieldValue=reader.readData(extraFieldLength);this.extraFields[extraFieldId]={id:extraFieldId,length:extraFieldLength,value:extraFieldValue}}},handleUTF8:function(){var decodeParamType=support.uint8array?"uint8array":"array";if(this.useUTF8()){this.fileNameStr=utf8.utf8decode(this.fileName);this.fileCommentStr=utf8.utf8decode(this.fileComment)}else{var upath=this.findExtraFieldUnicodePath();if(upath!==null){this.fileNameStr=upath}else{var fileNameByteArray=utils.transformTo(decodeParamType,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(fileNameByteArray)}
var ucomment=this.findExtraFieldUnicodeComment();if(ucomment!==null){this.fileCommentStr=ucomment}else{var commentByteArray=utils.transformTo(decodeParamType,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(commentByteArray)}}},findExtraFieldUnicodePath:function(){var upathField=this.extraFields[0x7075];if(upathField){var extraReader=readerFor(upathField.value);if(extraReader.readInt(1)!==1){return null}
if(crc32fn(this.fileName)!==extraReader.readInt(4)){return null}
return utf8.utf8decode(extraReader.readData(upathField.length-5))}
return null},findExtraFieldUnicodeComment:function(){var ucommentField=this.extraFields[0x6375];if(ucommentField){var extraReader=readerFor(ucommentField.value);if(extraReader.readInt(1)!==1){return null}
if(crc32fn(this.fileComment)!==extraReader.readInt(4)){return null}
return utf8.utf8decode(extraReader.readData(ucommentField.length-5))}
return null}};module.exports=ZipEntry},{"./compressedObject":39,"./compressions":40,"./crc32":41,"./reader/readerFor":59,"./support":67,"./utf8":68,"./utils":69}],72:[function(require,module,exports){'use strict';var StreamHelper=require('./stream/StreamHelper');var DataWorker=require('./stream/DataWorker');var utf8=require('./utf8');var CompressedObject=require('./compressedObject');var GenericWorker=require('./stream/GenericWorker');var ZipObject=function(name,data,options){this.name=name;this.dir=options.dir;this.date=options.date;this.comment=options.comment;this.unixPermissions=options.unixPermissions;this.dosPermissions=options.dosPermissions;this._data=data;this._dataBinary=options.binary;this.options={compression:options.compression,compressionOptions:options.compressionOptions}};ZipObject.prototype={internalStream:function(type){var outputType=type.toLowerCase();var askUnicodeString=outputType==="string"||outputType==="text";if(outputType==="binarystring"||outputType==="text"){outputType="string"}
var result=this._decompressWorker();var isUnicodeString=!this._dataBinary;if(isUnicodeString&&!askUnicodeString){result=result.pipe(new utf8.Utf8EncodeWorker())}
if(!isUnicodeString&&askUnicodeString){result=result.pipe(new utf8.Utf8DecodeWorker())}
return new StreamHelper(result,outputType,"")},async:function(type,onUpdate){return this.internalStream(type).accumulate(onUpdate)},nodeStream:function(type,onUpdate){return this.internalStream(type||"nodebuffer").toNodejsStream(onUpdate)},_compressWorker:function(compression,compressionOptions){if(this._data instanceof CompressedObject&&this._data.compression.magic===compression.magic){return this._data.getCompressedWorker()}else{var result=this._decompressWorker();if(!this._dataBinary){result=result.pipe(new utf8.Utf8EncodeWorker())}
return CompressedObject.createWorkerFrom(result,compression,compressionOptions)}},_decompressWorker:function(){if(this._data instanceof CompressedObject){return this._data.getContentWorker()}else if(this._data instanceof GenericWorker){return this._data}else{return new DataWorker(this._data)}}};var removedMethods=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"];var removedFn=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")};for(var i=0;i<removedMethods.length;i++){ZipObject.prototype[removedMethods[i]]=removedFn}
module.exports=ZipObject},{"./compressedObject":39,"./stream/DataWorker":64,"./stream/GenericWorker":65,"./stream/StreamHelper":66,"./utf8":68}],73:[function(require,module,exports){'use strict';var immediate=require('immediate');function INTERNAL(){}
var handlers={};var REJECTED=['REJECTED'];var FULFILLED=['FULFILLED'];var PENDING=['PENDING'];module.exports=Promise;function Promise(resolver){if(typeof resolver!=='function'){throw new TypeError('resolver must be a function')}
this.state=PENDING;this.queue=[];this.outcome=void 0;if(resolver!==INTERNAL){safelyResolveThenable(this,resolver)}}
Promise.prototype["catch"]=function(onRejected){return this.then(null,onRejected)};Promise.prototype.then=function(onFulfilled,onRejected){if(typeof onFulfilled!=='function'&&this.state===FULFILLED||typeof onRejected!=='function'&&this.state===REJECTED){return this}
var promise=new this.constructor(INTERNAL);if(this.state!==PENDING){var resolver=this.state===FULFILLED?onFulfilled:onRejected;unwrap(promise,resolver,this.outcome)}else{this.queue.push(new QueueItem(promise,onFulfilled,onRejected))}
return promise};function QueueItem(promise,onFulfilled,onRejected){this.promise=promise;if(typeof onFulfilled==='function'){this.onFulfilled=onFulfilled;this.callFulfilled=this.otherCallFulfilled}
if(typeof onRejected==='function'){this.onRejected=onRejected;this.callRejected=this.otherCallRejected}}
QueueItem.prototype.callFulfilled=function(value){handlers.resolve(this.promise,value)};QueueItem.prototype.otherCallFulfilled=function(value){unwrap(this.promise,this.onFulfilled,value)};QueueItem.prototype.callRejected=function(value){handlers.reject(this.promise,value)};QueueItem.prototype.otherCallRejected=function(value){unwrap(this.promise,this.onRejected,value)};function unwrap(promise,func,value){immediate(function(){var returnValue;try{returnValue=func(value)}catch(e){return handlers.reject(promise,e)}
if(returnValue===promise){handlers.reject(promise,new TypeError('Cannot resolve promise with itself'))}else{handlers.resolve(promise,returnValue)}})}
handlers.resolve=function(self,value){var result=tryCatch(getThen,value);if(result.status==='error'){return handlers.reject(self,result.value)}
var thenable=result.value;if(thenable){safelyResolveThenable(self,thenable)}else{self.state=FULFILLED;self.outcome=value;var i=-1;var len=self.queue.length;while(++i<len){self.queue[i].callFulfilled(value)}}
return self};handlers.reject=function(self,error){self.state=REJECTED;self.outcome=error;var i=-1;var len=self.queue.length;while(++i<len){self.queue[i].callRejected(error)}
return self};function getThen(obj){var then=obj&&obj.then;if(obj&&typeof obj==='object'&&typeof then==='function'){return function appyThen(){then.apply(obj,arguments)}}}
function safelyResolveThenable(self,thenable){var called=!1;function onError(value){if(called){return}
called=!0;handlers.reject(self,value)}
function onSuccess(value){if(called){return}
called=!0;handlers.resolve(self,value)}
function tryToUnwrap(){thenable(onSuccess,onError)}
var result=tryCatch(tryToUnwrap);if(result.status==='error'){onError(result.value)}}
function tryCatch(func,value){var out={};try{out.value=func(value);out.status='success'}catch(e){out.status='error';out.value=e}
return out}
Promise.resolve=resolve;function resolve(value){if(value instanceof this){return value}
return handlers.resolve(new this(INTERNAL),value)}
Promise.reject=reject;function reject(reason){var promise=new this(INTERNAL);return handlers.reject(promise,reason)}
Promise.all=all;function all(iterable){var self=this;if(Object.prototype.toString.call(iterable)!=='[object Array]'){return this.reject(new TypeError('must be an array'))}
var len=iterable.length;var called=!1;if(!len){return this.resolve([])}
var values=new Array(len);var resolved=0;var i=-1;var promise=new this(INTERNAL);while(++i<len){allResolver(iterable[i],i)}
return promise;function allResolver(value,i){self.resolve(value).then(resolveFromAll,function(error){if(!called){called=!0;handlers.reject(promise,error)}});function resolveFromAll(outValue){values[i]=outValue;if(++resolved===len&&!called){called=!0;handlers.resolve(promise,values)}}}}
Promise.race=race;function race(iterable){var self=this;if(Object.prototype.toString.call(iterable)!=='[object Array]'){return this.reject(new TypeError('must be an array'))}
var len=iterable.length;var called=!1;if(!len){return this.resolve([])}
var i=-1;var promise=new this(INTERNAL);while(++i<len){resolver(iterable[i])}
return promise;function resolver(value){self.resolve(value).then(function(response){if(!called){called=!0;handlers.resolve(promise,response)}},function(error){if(!called){called=!0;handlers.reject(promise,error)}})}}},{"immediate":34}],74:[function(require,module,exports){'use strict';var assign=require('./lib/utils/common').assign;var deflate=require('./lib/deflate');var inflate=require('./lib/inflate');var constants=require('./lib/zlib/constants');var pako={};assign(pako,deflate,inflate,constants);module.exports=pako},{"./lib/deflate":75,"./lib/inflate":76,"./lib/utils/common":77,"./lib/zlib/constants":80}],75:[function(require,module,exports){'use strict';var zlib_deflate=require('./zlib/deflate');var utils=require('./utils/common');var strings=require('./utils/strings');var msg=require('./zlib/messages');var ZStream=require('./zlib/zstream');var toString=Object.prototype.toString;var Z_NO_FLUSH=0;var Z_FINISH=4;var Z_OK=0;var Z_STREAM_END=1;var Z_SYNC_FLUSH=2;var Z_DEFAULT_COMPRESSION=-1;var Z_DEFAULT_STRATEGY=0;var Z_DEFLATED=8;function Deflate(options){if(!(this instanceof Deflate))return new Deflate(options);this.options=utils.assign({level:Z_DEFAULT_COMPRESSION,method:Z_DEFLATED,chunkSize:16384,windowBits:15,memLevel:8,strategy:Z_DEFAULT_STRATEGY,to:''},options||{});var opt=this.options;if(opt.raw&&(opt.windowBits>0)){opt.windowBits=-opt.windowBits}else if(opt.gzip&&(opt.windowBits>0)&&(opt.windowBits<16)){opt.windowBits+=16}
this.err=0;this.msg='';this.ended=!1;this.chunks=[];this.strm=new ZStream();this.strm.avail_out=0;var status=zlib_deflate.deflateInit2(this.strm,opt.level,opt.method,opt.windowBits,opt.memLevel,opt.strategy);if(status!==Z_OK){throw new Error(msg[status])}
if(opt.header){zlib_deflate.deflateSetHeader(this.strm,opt.header)}
if(opt.dictionary){var dict;if(typeof opt.dictionary==='string'){dict=strings.string2buf(opt.dictionary)}else if(toString.call(opt.dictionary)==='[object ArrayBuffer]'){dict=new Uint8Array(opt.dictionary)}else{dict=opt.dictionary}
status=zlib_deflate.deflateSetDictionary(this.strm,dict);if(status!==Z_OK){throw new Error(msg[status])}
this._dict_set=!0}}
Deflate.prototype.push=function(data,mode){var strm=this.strm;var chunkSize=this.options.chunkSize;var status,_mode;if(this.ended){return!1}
_mode=(mode===~~mode)?mode:((mode===!0)?Z_FINISH:Z_NO_FLUSH);if(typeof data==='string'){strm.input=strings.string2buf(data)}else if(toString.call(data)==='[object ArrayBuffer]'){strm.input=new Uint8Array(data)}else{strm.input=data}
strm.next_in=0;strm.avail_in=strm.input.length;do{if(strm.avail_out===0){strm.output=new utils.Buf8(chunkSize);strm.next_out=0;strm.avail_out=chunkSize}
status=zlib_deflate.deflate(strm,_mode);if(status!==Z_STREAM_END&&status!==Z_OK){this.onEnd(status);this.ended=!0;return!1}
if(strm.avail_out===0||(strm.avail_in===0&&(_mode===Z_FINISH||_mode===Z_SYNC_FLUSH))){if(this.options.to==='string'){this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output,strm.next_out)))}else{this.onData(utils.shrinkBuf(strm.output,strm.next_out))}}}while((strm.avail_in>0||strm.avail_out===0)&&status!==Z_STREAM_END);if(_mode===Z_FINISH){status=zlib_deflate.deflateEnd(this.strm);this.onEnd(status);this.ended=!0;return status===Z_OK}
if(_mode===Z_SYNC_FLUSH){this.onEnd(Z_OK);strm.avail_out=0;return!0}
return!0};Deflate.prototype.onData=function(chunk){this.chunks.push(chunk)};Deflate.prototype.onEnd=function(status){if(status===Z_OK){if(this.options.to==='string'){this.result=this.chunks.join('')}else{this.result=utils.flattenChunks(this.chunks)}}
this.chunks=[];this.err=status;this.msg=this.strm.msg};function deflate(input,options){var deflator=new Deflate(options);deflator.push(input,!0);if(deflator.err){throw deflator.msg}
return deflator.result}
function deflateRaw(input,options){options=options||{};options.raw=!0;return deflate(input,options)}
function gzip(input,options){options=options||{};options.gzip=!0;return deflate(input,options)}
exports.Deflate=Deflate;exports.deflate=deflate;exports.deflateRaw=deflateRaw;exports.gzip=gzip},{"./utils/common":77,"./utils/strings":78,"./zlib/deflate":82,"./zlib/messages":87,"./zlib/zstream":89}],76:[function(require,module,exports){'use strict';var zlib_inflate=require('./zlib/inflate');var utils=require('./utils/common');var strings=require('./utils/strings');var c=require('./zlib/constants');var msg=require('./zlib/messages');var ZStream=require('./zlib/zstream');var GZheader=require('./zlib/gzheader');var toString=Object.prototype.toString;function Inflate(options){if(!(this instanceof Inflate))return new Inflate(options);this.options=utils.assign({chunkSize:16384,windowBits:0,to:''},options||{});var opt=this.options;if(opt.raw&&(opt.windowBits>=0)&&(opt.windowBits<16)){opt.windowBits=-opt.windowBits;if(opt.windowBits===0){opt.windowBits=-15}}
if((opt.windowBits>=0)&&(opt.windowBits<16)&&!(options&&options.windowBits)){opt.windowBits+=32}
if((opt.windowBits>15)&&(opt.windowBits<48)){if((opt.windowBits&15)===0){opt.windowBits|=15}}
this.err=0;this.msg='';this.ended=!1;this.chunks=[];this.strm=new ZStream();this.strm.avail_out=0;var status=zlib_inflate.inflateInit2(this.strm,opt.windowBits);if(status!==c.Z_OK){throw new Error(msg[status])}
this.header=new GZheader();zlib_inflate.inflateGetHeader(this.strm,this.header)}
Inflate.prototype.push=function(data,mode){var strm=this.strm;var chunkSize=this.options.chunkSize;var dictionary=this.options.dictionary;var status,_mode;var next_out_utf8,tail,utf8str;var dict;var allowBufError=!1;if(this.ended){return!1}
_mode=(mode===~~mode)?mode:((mode===!0)?c.Z_FINISH:c.Z_NO_FLUSH);if(typeof data==='string'){strm.input=strings.binstring2buf(data)}else if(toString.call(data)==='[object ArrayBuffer]'){strm.input=new Uint8Array(data)}else{strm.input=data}
strm.next_in=0;strm.avail_in=strm.input.length;do{if(strm.avail_out===0){strm.output=new utils.Buf8(chunkSize);strm.next_out=0;strm.avail_out=chunkSize}
status=zlib_inflate.inflate(strm,c.Z_NO_FLUSH);if(status===c.Z_NEED_DICT&&dictionary){if(typeof dictionary==='string'){dict=strings.string2buf(dictionary)}else if(toString.call(dictionary)==='[object ArrayBuffer]'){dict=new Uint8Array(dictionary)}else{dict=dictionary}
status=zlib_inflate.inflateSetDictionary(this.strm,dict)}
if(status===c.Z_BUF_ERROR&&allowBufError===!0){status=c.Z_OK;allowBufError=!1}
if(status!==c.Z_STREAM_END&&status!==c.Z_OK){this.onEnd(status);this.ended=!0;return!1}
if(strm.next_out){if(strm.avail_out===0||status===c.Z_STREAM_END||(strm.avail_in===0&&(_mode===c.Z_FINISH||_mode===c.Z_SYNC_FLUSH))){if(this.options.to==='string'){next_out_utf8=strings.utf8border(strm.output,strm.next_out);tail=strm.next_out-next_out_utf8;utf8str=strings.buf2string(strm.output,next_out_utf8);strm.next_out=tail;strm.avail_out=chunkSize-tail;if(tail){utils.arraySet(strm.output,strm.output,next_out_utf8,tail,0)}
this.onData(utf8str)}else{this.onData(utils.shrinkBuf(strm.output,strm.next_out))}}}
if(strm.avail_in===0&&strm.avail_out===0){allowBufError=!0}}while((strm.avail_in>0||strm.avail_out===0)&&status!==c.Z_STREAM_END);if(status===c.Z_STREAM_END){_mode=c.Z_FINISH}
if(_mode===c.Z_FINISH){status=zlib_inflate.inflateEnd(this.strm);this.onEnd(status);this.ended=!0;return status===c.Z_OK}
if(_mode===c.Z_SYNC_FLUSH){this.onEnd(c.Z_OK);strm.avail_out=0;return!0}
return!0};Inflate.prototype.onData=function(chunk){this.chunks.push(chunk)};Inflate.prototype.onEnd=function(status){if(status===c.Z_OK){if(this.options.to==='string'){this.result=this.chunks.join('')}else{this.result=utils.flattenChunks(this.chunks)}}
this.chunks=[];this.err=status;this.msg=this.strm.msg};function inflate(input,options){var inflator=new Inflate(options);inflator.push(input,!0);if(inflator.err){throw inflator.msg}
return inflator.result}
function inflateRaw(input,options){options=options||{};options.raw=!0;return inflate(input,options)}
exports.Inflate=Inflate;exports.inflate=inflate;exports.inflateRaw=inflateRaw;exports.ungzip=inflate},{"./utils/common":77,"./utils/strings":78,"./zlib/constants":80,"./zlib/gzheader":83,"./zlib/inflate":85,"./zlib/messages":87,"./zlib/zstream":89}],77:[function(require,module,exports){'use strict';var TYPED_OK=(typeof Uint8Array!=='undefined')&&(typeof Uint16Array!=='undefined')&&(typeof Int32Array!=='undefined');exports.assign=function(obj){var sources=Array.prototype.slice.call(arguments,1);while(sources.length){var source=sources.shift();if(!source){continue}
if(typeof source!=='object'){throw new TypeError(source+'must be non-object')}
for(var p in source){if(source.hasOwnProperty(p)){obj[p]=source[p]}}}
return obj};exports.shrinkBuf=function(buf,size){if(buf.length===size){return buf}
if(buf.subarray){return buf.subarray(0,size)}
buf.length=size;return buf};var fnTyped={arraySet:function(dest,src,src_offs,len,dest_offs){if(src.subarray&&dest.subarray){dest.set(src.subarray(src_offs,src_offs+len),dest_offs);return}
for(var i=0;i<len;i++){dest[dest_offs+i]=src[src_offs+i]}},flattenChunks:function(chunks){var i,l,len,pos,chunk,result;len=0;for(i=0,l=chunks.length;i<l;i++){len+=chunks[i].length}
result=new Uint8Array(len);pos=0;for(i=0,l=chunks.length;i<l;i++){chunk=chunks[i];result.set(chunk,pos);pos+=chunk.length}
return result}};var fnUntyped={arraySet:function(dest,src,src_offs,len,dest_offs){for(var i=0;i<len;i++){dest[dest_offs+i]=src[src_offs+i]}},flattenChunks:function(chunks){return[].concat.apply([],chunks)}};exports.setTyped=function(on){if(on){exports.Buf8=Uint8Array;exports.Buf16=Uint16Array;exports.Buf32=Int32Array;exports.assign(exports,fnTyped)}else{exports.Buf8=Array;exports.Buf16=Array;exports.Buf32=Array;exports.assign(exports,fnUntyped)}};exports.setTyped(TYPED_OK)},{}],78:[function(require,module,exports){'use strict';var utils=require('./common');var STR_APPLY_OK=!0;var STR_APPLY_UIA_OK=!0;try{String.fromCharCode.apply(null,[0])}catch(__){STR_APPLY_OK=!1}
try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(__){STR_APPLY_UIA_OK=!1}
var _utf8len=new utils.Buf8(256);for(var q=0;q<256;q++){_utf8len[q]=(q>=252?6:q>=248?5:q>=240?4:q>=224?3:q>=192?2:1)}
_utf8len[254]=_utf8len[254]=1;exports.string2buf=function(str){var buf,c,c2,m_pos,i,str_len=str.length,buf_len=0;for(m_pos=0;m_pos<str_len;m_pos++){c=str.charCodeAt(m_pos);if((c&0xfc00)===0xd800&&(m_pos+1<str_len)){c2=str.charCodeAt(m_pos+1);if((c2&0xfc00)===0xdc00){c=0x10000+((c-0xd800)<<10)+(c2-0xdc00);m_pos++}}
buf_len+=c<0x80?1:c<0x800?2:c<0x10000?3:4}
buf=new utils.Buf8(buf_len);for(i=0,m_pos=0;i<buf_len;m_pos++){c=str.charCodeAt(m_pos);if((c&0xfc00)===0xd800&&(m_pos+1<str_len)){c2=str.charCodeAt(m_pos+1);if((c2&0xfc00)===0xdc00){c=0x10000+((c-0xd800)<<10)+(c2-0xdc00);m_pos++}}
if(c<0x80){buf[i++]=c}else if(c<0x800){buf[i++]=0xC0|(c>>>6);buf[i++]=0x80|(c&0x3f)}else if(c<0x10000){buf[i++]=0xE0|(c>>>12);buf[i++]=0x80|(c>>>6&0x3f);buf[i++]=0x80|(c&0x3f)}else{buf[i++]=0xf0|(c>>>18);buf[i++]=0x80|(c>>>12&0x3f);buf[i++]=0x80|(c>>>6&0x3f);buf[i++]=0x80|(c&0x3f)}}
return buf};function buf2binstring(buf,len){if(len<65537){if((buf.subarray&&STR_APPLY_UIA_OK)||(!buf.subarray&&STR_APPLY_OK)){return String.fromCharCode.apply(null,utils.shrinkBuf(buf,len))}}
var result='';for(var i=0;i<len;i++){result+=String.fromCharCode(buf[i])}
return result}
exports.buf2binstring=function(buf){return buf2binstring(buf,buf.length)};exports.binstring2buf=function(str){var buf=new utils.Buf8(str.length);for(var i=0,len=buf.length;i<len;i++){buf[i]=str.charCodeAt(i)}
return buf};exports.buf2string=function(buf,max){var i,out,c,c_len;var len=max||buf.length;var utf16buf=new Array(len*2);for(out=0,i=0;i<len;){c=buf[i++];if(c<0x80){utf16buf[out++]=c;continue}
c_len=_utf8len[c];if(c_len>4){utf16buf[out++]=0xfffd;i+=c_len-1;continue}
c&=c_len===2?0x1f:c_len===3?0x0f:0x07;while(c_len>1&&i<len){c=(c<<6)|(buf[i++]&0x3f);c_len--}
if(c_len>1){utf16buf[out++]=0xfffd;continue}
if(c<0x10000){utf16buf[out++]=c}else{c-=0x10000;utf16buf[out++]=0xd800|((c>>10)&0x3ff);utf16buf[out++]=0xdc00|(c&0x3ff)}}
return buf2binstring(utf16buf,out)};exports.utf8border=function(buf,max){var pos;max=max||buf.length;if(max>buf.length){max=buf.length}
pos=max-1;while(pos>=0&&(buf[pos]&0xC0)===0x80){pos--}
if(pos<0){return max}
if(pos===0){return max}
return(pos+_utf8len[buf[pos]]>max)?pos:max}},{"./common":77}],79:[function(require,module,exports){'use strict';function adler32(adler,buf,len,pos){var s1=(adler&0xffff)|0,s2=((adler>>>16)&0xffff)|0,n=0;while(len!==0){n=len>2000?2000:len;len-=n;do{s1=(s1+buf[pos++])|0;s2=(s2+s1)|0}while(--n);s1%=65521;s2%=65521}
return(s1|(s2<<16))|0}
module.exports=adler32},{}],80:[function(require,module,exports){'use strict';module.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],81:[function(require,module,exports){'use strict';function makeTable(){var c,table=[];for(var n=0;n<256;n++){c=n;for(var k=0;k<8;k++){c=((c&1)?(0xEDB88320^(c>>>1)):(c>>>1))}
table[n]=c}
return table}
var crcTable=makeTable();function crc32(crc,buf,len,pos){var t=crcTable,end=pos+len;crc^=-1;for(var i=pos;i<end;i++){crc=(crc>>>8)^t[(crc^buf[i])&0xFF]}
return(crc^(-1))}
module.exports=crc32},{}],82:[function(require,module,exports){'use strict';var utils=require('../utils/common');var trees=require('./trees');var adler32=require('./adler32');var crc32=require('./crc32');var msg=require('./messages');var Z_NO_FLUSH=0;var Z_PARTIAL_FLUSH=1;var Z_FULL_FLUSH=3;var Z_FINISH=4;var Z_BLOCK=5;var Z_OK=0;var Z_STREAM_END=1;var Z_STREAM_ERROR=-2;var Z_DATA_ERROR=-3;var Z_BUF_ERROR=-5;var Z_DEFAULT_COMPRESSION=-1;var Z_FILTERED=1;var Z_HUFFMAN_ONLY=2;var Z_RLE=3;var Z_FIXED=4;var Z_DEFAULT_STRATEGY=0;var Z_UNKNOWN=2;var Z_DEFLATED=8;var MAX_MEM_LEVEL=9;var MAX_WBITS=15;var DEF_MEM_LEVEL=8;var LENGTH_CODES=29;var LITERALS=256;var L_CODES=LITERALS+1+LENGTH_CODES;var D_CODES=30;var BL_CODES=19;var HEAP_SIZE=2*L_CODES+1;var MAX_BITS=15;var MIN_MATCH=3;var MAX_MATCH=258;var MIN_LOOKAHEAD=(MAX_MATCH+MIN_MATCH+1);var PRESET_DICT=0x20;var INIT_STATE=42;var EXTRA_STATE=69;var NAME_STATE=73;var COMMENT_STATE=91;var HCRC_STATE=103;var BUSY_STATE=113;var FINISH_STATE=666;var BS_NEED_MORE=1;var BS_BLOCK_DONE=2;var BS_FINISH_STARTED=3;var BS_FINISH_DONE=4;var OS_CODE=0x03;function err(strm,errorCode){strm.msg=msg[errorCode];return errorCode}
function rank(f){return((f)<<1)-((f)>4?9:0)}
function zero(buf){var len=buf.length;while(--len>=0){buf[len]=0}}
function flush_pending(strm){var s=strm.state;var len=s.pending;if(len>strm.avail_out){len=strm.avail_out}
if(len===0){return}
utils.arraySet(strm.output,s.pending_buf,s.pending_out,len,strm.next_out);strm.next_out+=len;s.pending_out+=len;strm.total_out+=len;strm.avail_out-=len;s.pending-=len;if(s.pending===0){s.pending_out=0}}
function flush_block_only(s,last){trees._tr_flush_block(s,(s.block_start>=0?s.block_start:-1),s.strstart-s.block_start,last);s.block_start=s.strstart;flush_pending(s.strm)}
function put_byte(s,b){s.pending_buf[s.pending++]=b}
function putShortMSB(s,b){s.pending_buf[s.pending++]=(b>>>8)&0xff;s.pending_buf[s.pending++]=b&0xff}
function read_buf(strm,buf,start,size){var len=strm.avail_in;if(len>size){len=size}
if(len===0){return 0}
strm.avail_in-=len;utils.arraySet(buf,strm.input,strm.next_in,len,start);if(strm.state.wrap===1){strm.adler=adler32(strm.adler,buf,len,start)}else if(strm.state.wrap===2){strm.adler=crc32(strm.adler,buf,len,start)}
strm.next_in+=len;strm.total_in+=len;return len}
function longest_match(s,cur_match){var chain_length=s.max_chain_length;var scan=s.strstart;var match;var len;var best_len=s.prev_length;var nice_match=s.nice_match;var limit=(s.strstart>(s.w_size-MIN_LOOKAHEAD))?s.strstart-(s.w_size-MIN_LOOKAHEAD):0;var _win=s.window;var wmask=s.w_mask;var prev=s.prev;var strend=s.strstart+MAX_MATCH;var scan_end1=_win[scan+best_len-1];var scan_end=_win[scan+best_len];if(s.prev_length>=s.good_match){chain_length>>=2}
if(nice_match>s.lookahead){nice_match=s.lookahead}
do{match=cur_match;if(_win[match+best_len]!==scan_end||_win[match+best_len-1]!==scan_end1||_win[match]!==_win[scan]||_win[++match]!==_win[scan+1]){continue}
scan+=2;match++;do{}while(_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&scan<strend);len=MAX_MATCH-(strend-scan);scan=strend-MAX_MATCH;if(len>best_len){s.match_start=cur_match;best_len=len;if(len>=nice_match){break}
scan_end1=_win[scan+best_len-1];scan_end=_win[scan+best_len]}}while((cur_match=prev[cur_match&wmask])>limit&&--chain_length!==0);if(best_len<=s.lookahead){return best_len}
return s.lookahead}
function fill_window(s){var _w_size=s.w_size;var p,n,m,more,str;do{more=s.window_size-s.lookahead-s.strstart;if(s.strstart>=_w_size+(_w_size-MIN_LOOKAHEAD)){utils.arraySet(s.window,s.window,_w_size,_w_size,0);s.match_start-=_w_size;s.strstart-=_w_size;s.block_start-=_w_size;n=s.hash_size;p=n;do{m=s.head[--p];s.head[p]=(m>=_w_size?m-_w_size:0)}while(--n);n=_w_size;p=n;do{m=s.prev[--p];s.prev[p]=(m>=_w_size?m-_w_size:0)}while(--n);more+=_w_size}
if(s.strm.avail_in===0){break}
n=read_buf(s.strm,s.window,s.strstart+s.lookahead,more);s.lookahead+=n;if(s.lookahead+s.insert>=MIN_MATCH){str=s.strstart-s.insert;s.ins_h=s.window[str];s.ins_h=((s.ins_h<<s.hash_shift)^s.window[str+1])&s.hash_mask;while(s.insert){s.ins_h=((s.ins_h<<s.hash_shift)^s.window[str+MIN_MATCH-1])&s.hash_mask;s.prev[str&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=str;str++;s.insert--;if(s.lookahead+s.insert<MIN_MATCH){break}}}}while(s.lookahead<MIN_LOOKAHEAD&&s.strm.avail_in!==0);}
function deflate_stored(s,flush){var max_block_size=0xffff;if(max_block_size>s.pending_buf_size-5){max_block_size=s.pending_buf_size-5}
for(;;){if(s.lookahead<=1){fill_window(s);if(s.lookahead===0&&flush===Z_NO_FLUSH){return BS_NEED_MORE}
if(s.lookahead===0){break}}
s.strstart+=s.lookahead;s.lookahead=0;var max_start=s.block_start+max_block_size;if(s.strstart===0||s.strstart>=max_start){s.lookahead=s.strstart-max_start;s.strstart=max_start;flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}
if(s.strstart-s.block_start>=(s.w_size-MIN_LOOKAHEAD)){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}}
s.insert=0;if(flush===Z_FINISH){flush_block_only(s,!0);if(s.strm.avail_out===0){return BS_FINISH_STARTED}
return BS_FINISH_DONE}
if(s.strstart>s.block_start){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}
return BS_NEED_MORE}
function deflate_fast(s,flush){var hash_head;var bflush;for(;;){if(s.lookahead<MIN_LOOKAHEAD){fill_window(s);if(s.lookahead<MIN_LOOKAHEAD&&flush===Z_NO_FLUSH){return BS_NEED_MORE}
if(s.lookahead===0){break}}
hash_head=0;if(s.lookahead>=MIN_MATCH){s.ins_h=((s.ins_h<<s.hash_shift)^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}
if(hash_head!==0&&((s.strstart-hash_head)<=(s.w_size-MIN_LOOKAHEAD))){s.match_length=longest_match(s,hash_head)}
if(s.match_length>=MIN_MATCH){bflush=trees._tr_tally(s,s.strstart-s.match_start,s.match_length-MIN_MATCH);s.lookahead-=s.match_length;if(s.match_length<=s.max_lazy_match&&s.lookahead>=MIN_MATCH){s.match_length--;do{s.strstart++;s.ins_h=((s.ins_h<<s.hash_shift)^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}while(--s.match_length!==0);s.strstart++}else{s.strstart+=s.match_length;s.match_length=0;s.ins_h=s.window[s.strstart];s.ins_h=((s.ins_h<<s.hash_shift)^s.window[s.strstart+1])&s.hash_mask}}else{bflush=trees._tr_tally(s,0,s.window[s.strstart]);s.lookahead--;s.strstart++}
if(bflush){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}}
s.insert=((s.strstart<(MIN_MATCH-1))?s.strstart:MIN_MATCH-1);if(flush===Z_FINISH){flush_block_only(s,!0);if(s.strm.avail_out===0){return BS_FINISH_STARTED}
return BS_FINISH_DONE}
if(s.last_lit){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}
return BS_BLOCK_DONE}
function deflate_slow(s,flush){var hash_head;var bflush;var max_insert;for(;;){if(s.lookahead<MIN_LOOKAHEAD){fill_window(s);if(s.lookahead<MIN_LOOKAHEAD&&flush===Z_NO_FLUSH){return BS_NEED_MORE}
if(s.lookahead===0){break}}
hash_head=0;if(s.lookahead>=MIN_MATCH){s.ins_h=((s.ins_h<<s.hash_shift)^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}
s.prev_length=s.match_length;s.prev_match=s.match_start;s.match_length=MIN_MATCH-1;if(hash_head!==0&&s.prev_length<s.max_lazy_match&&s.strstart-hash_head<=(s.w_size-MIN_LOOKAHEAD)){s.match_length=longest_match(s,hash_head);if(s.match_length<=5&&(s.strategy===Z_FILTERED||(s.match_length===MIN_MATCH&&s.strstart-s.match_start>4096))){s.match_length=MIN_MATCH-1}}
if(s.prev_length>=MIN_MATCH&&s.match_length<=s.prev_length){max_insert=s.strstart+s.lookahead-MIN_MATCH;bflush=trees._tr_tally(s,s.strstart-1-s.prev_match,s.prev_length-MIN_MATCH);s.lookahead-=s.prev_length-1;s.prev_length-=2;do{if(++s.strstart<=max_insert){s.ins_h=((s.ins_h<<s.hash_shift)^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}}while(--s.prev_length!==0);s.match_available=0;s.match_length=MIN_MATCH-1;s.strstart++;if(bflush){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}}else if(s.match_available){bflush=trees._tr_tally(s,0,s.window[s.strstart-1]);if(bflush){flush_block_only(s,!1)}
s.strstart++;s.lookahead--;if(s.strm.avail_out===0){return BS_NEED_MORE}}else{s.match_available=1;s.strstart++;s.lookahead--}}
if(s.match_available){bflush=trees._tr_tally(s,0,s.window[s.strstart-1]);s.match_available=0}
s.insert=s.strstart<MIN_MATCH-1?s.strstart:MIN_MATCH-1;if(flush===Z_FINISH){flush_block_only(s,!0);if(s.strm.avail_out===0){return BS_FINISH_STARTED}
return BS_FINISH_DONE}
if(s.last_lit){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}
return BS_BLOCK_DONE}
function deflate_rle(s,flush){var bflush;var prev;var scan,strend;var _win=s.window;for(;;){if(s.lookahead<=MAX_MATCH){fill_window(s);if(s.lookahead<=MAX_MATCH&&flush===Z_NO_FLUSH){return BS_NEED_MORE}
if(s.lookahead===0){break}}
s.match_length=0;if(s.lookahead>=MIN_MATCH&&s.strstart>0){scan=s.strstart-1;prev=_win[scan];if(prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]){strend=s.strstart+MAX_MATCH;do{}while(prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&scan<strend);s.match_length=MAX_MATCH-(strend-scan);if(s.match_length>s.lookahead){s.match_length=s.lookahead}}}
if(s.match_length>=MIN_MATCH){bflush=trees._tr_tally(s,1,s.match_length-MIN_MATCH);s.lookahead-=s.match_length;s.strstart+=s.match_length;s.match_length=0}else{bflush=trees._tr_tally(s,0,s.window[s.strstart]);s.lookahead--;s.strstart++}
if(bflush){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}}
s.insert=0;if(flush===Z_FINISH){flush_block_only(s,!0);if(s.strm.avail_out===0){return BS_FINISH_STARTED}
return BS_FINISH_DONE}
if(s.last_lit){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}
return BS_BLOCK_DONE}
function deflate_huff(s,flush){var bflush;for(;;){if(s.lookahead===0){fill_window(s);if(s.lookahead===0){if(flush===Z_NO_FLUSH){return BS_NEED_MORE}
break}}
s.match_length=0;bflush=trees._tr_tally(s,0,s.window[s.strstart]);s.lookahead--;s.strstart++;if(bflush){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}}
s.insert=0;if(flush===Z_FINISH){flush_block_only(s,!0);if(s.strm.avail_out===0){return BS_FINISH_STARTED}
return BS_FINISH_DONE}
if(s.last_lit){flush_block_only(s,!1);if(s.strm.avail_out===0){return BS_NEED_MORE}}
return BS_BLOCK_DONE}
function Config(good_length,max_lazy,nice_length,max_chain,func){this.good_length=good_length;this.max_lazy=max_lazy;this.nice_length=nice_length;this.max_chain=max_chain;this.func=func}
var configuration_table;configuration_table=[new Config(0,0,0,0,deflate_stored),new Config(4,4,8,4,deflate_fast),new Config(4,5,16,8,deflate_fast),new Config(4,6,32,32,deflate_fast),new Config(4,4,16,16,deflate_slow),new Config(8,16,32,32,deflate_slow),new Config(8,16,128,128,deflate_slow),new Config(8,32,128,256,deflate_slow),new Config(32,128,258,1024,deflate_slow),new Config(32,258,258,4096,deflate_slow)];function lm_init(s){s.window_size=2*s.w_size;zero(s.head);s.max_lazy_match=configuration_table[s.level].max_lazy;s.good_match=configuration_table[s.level].good_length;s.nice_match=configuration_table[s.level].nice_length;s.max_chain_length=configuration_table[s.level].max_chain;s.strstart=0;s.block_start=0;s.lookahead=0;s.insert=0;s.match_length=s.prev_length=MIN_MATCH-1;s.match_available=0;s.ins_h=0}
function DeflateState(){this.strm=null;this.status=0;this.pending_buf=null;this.pending_buf_size=0;this.pending_out=0;this.pending=0;this.wrap=0;this.gzhead=null;this.gzindex=0;this.method=Z_DEFLATED;this.last_flush=-1;this.w_size=0;this.w_bits=0;this.w_mask=0;this.window=null;this.window_size=0;this.prev=null;this.head=null;this.ins_h=0;this.hash_size=0;this.hash_bits=0;this.hash_mask=0;this.hash_shift=0;this.block_start=0;this.match_length=0;this.prev_match=0;this.match_available=0;this.strstart=0;this.match_start=0;this.lookahead=0;this.prev_length=0;this.max_chain_length=0;this.max_lazy_match=0;this.level=0;this.strategy=0;this.good_match=0;this.nice_match=0;this.dyn_ltree=new utils.Buf16(HEAP_SIZE*2);this.dyn_dtree=new utils.Buf16((2*D_CODES+1)*2);this.bl_tree=new utils.Buf16((2*BL_CODES+1)*2);zero(this.dyn_ltree);zero(this.dyn_dtree);zero(this.bl_tree);this.l_desc=null;this.d_desc=null;this.bl_desc=null;this.bl_count=new utils.Buf16(MAX_BITS+1);this.heap=new utils.Buf16(2*L_CODES+1);zero(this.heap);this.heap_len=0;this.heap_max=0;this.depth=new utils.Buf16(2*L_CODES+1);zero(this.depth);this.l_buf=0;this.lit_bufsize=0;this.last_lit=0;this.d_buf=0;this.opt_len=0;this.static_len=0;this.matches=0;this.insert=0;this.bi_buf=0;this.bi_valid=0}
function deflateResetKeep(strm){var s;if(!strm||!strm.state){return err(strm,Z_STREAM_ERROR)}
strm.total_in=strm.total_out=0;strm.data_type=Z_UNKNOWN;s=strm.state;s.pending=0;s.pending_out=0;if(s.wrap<0){s.wrap=-s.wrap}
s.status=(s.wrap?INIT_STATE:BUSY_STATE);strm.adler=(s.wrap===2)?0:1;s.last_flush=Z_NO_FLUSH;trees._tr_init(s);return Z_OK}
function deflateReset(strm){var ret=deflateResetKeep(strm);if(ret===Z_OK){lm_init(strm.state)}
return ret}
function deflateSetHeader(strm,head){if(!strm||!strm.state){return Z_STREAM_ERROR}
if(strm.state.wrap!==2){return Z_STREAM_ERROR}
strm.state.gzhead=head;return Z_OK}
function deflateInit2(strm,level,method,windowBits,memLevel,strategy){if(!strm){return Z_STREAM_ERROR}
var wrap=1;if(level===Z_DEFAULT_COMPRESSION){level=6}
if(windowBits<0){wrap=0;windowBits=-windowBits}else if(windowBits>15){wrap=2;windowBits-=16}
if(memLevel<1||memLevel>MAX_MEM_LEVEL||method!==Z_DEFLATED||windowBits<8||windowBits>15||level<0||level>9||strategy<0||strategy>Z_FIXED){return err(strm,Z_STREAM_ERROR)}
if(windowBits===8){windowBits=9}
var s=new DeflateState();strm.state=s;s.strm=strm;s.wrap=wrap;s.gzhead=null;s.w_bits=windowBits;s.w_size=1<<s.w_bits;s.w_mask=s.w_size-1;s.hash_bits=memLevel+7;s.hash_size=1<<s.hash_bits;s.hash_mask=s.hash_size-1;s.hash_shift=~~((s.hash_bits+MIN_MATCH-1)/MIN_MATCH);s.window=new utils.Buf8(s.w_size*2);s.head=new utils.Buf16(s.hash_size);s.prev=new utils.Buf16(s.w_size);s.lit_bufsize=1<<(memLevel+6);s.pending_buf_size=s.lit_bufsize*4;s.pending_buf=new utils.Buf8(s.pending_buf_size);s.d_buf=1*s.lit_bufsize;s.l_buf=(1+2)*s.lit_bufsize;s.level=level;s.strategy=strategy;s.method=method;return deflateReset(strm)}
function deflateInit(strm,level){return deflateInit2(strm,level,Z_DEFLATED,MAX_WBITS,DEF_MEM_LEVEL,Z_DEFAULT_STRATEGY)}
function deflate(strm,flush){var old_flush,s;var beg,val;if(!strm||!strm.state||flush>Z_BLOCK||flush<0){return strm?err(strm,Z_STREAM_ERROR):Z_STREAM_ERROR}
s=strm.state;if(!strm.output||(!strm.input&&strm.avail_in!==0)||(s.status===FINISH_STATE&&flush!==Z_FINISH)){return err(strm,(strm.avail_out===0)?Z_BUF_ERROR:Z_STREAM_ERROR)}
s.strm=strm;old_flush=s.last_flush;s.last_flush=flush;if(s.status===INIT_STATE){if(s.wrap===2){strm.adler=0;put_byte(s,31);put_byte(s,139);put_byte(s,8);if(!s.gzhead){put_byte(s,0);put_byte(s,0);put_byte(s,0);put_byte(s,0);put_byte(s,0);put_byte(s,s.level===9?2:(s.strategy>=Z_HUFFMAN_ONLY||s.level<2?4:0));put_byte(s,OS_CODE);s.status=BUSY_STATE}else{put_byte(s,(s.gzhead.text?1:0)+(s.gzhead.hcrc?2:0)+(!s.gzhead.extra?0:4)+(!s.gzhead.name?0:8)+(!s.gzhead.comment?0:16));put_byte(s,s.gzhead.time&0xff);put_byte(s,(s.gzhead.time>>8)&0xff);put_byte(s,(s.gzhead.time>>16)&0xff);put_byte(s,(s.gzhead.time>>24)&0xff);put_byte(s,s.level===9?2:(s.strategy>=Z_HUFFMAN_ONLY||s.level<2?4:0));put_byte(s,s.gzhead.os&0xff);if(s.gzhead.extra&&s.gzhead.extra.length){put_byte(s,s.gzhead.extra.length&0xff);put_byte(s,(s.gzhead.extra.length>>8)&0xff)}
if(s.gzhead.hcrc){strm.adler=crc32(strm.adler,s.pending_buf,s.pending,0)}
s.gzindex=0;s.status=EXTRA_STATE}}else{var header=(Z_DEFLATED+((s.w_bits-8)<<4))<<8;var level_flags=-1;if(s.strategy>=Z_HUFFMAN_ONLY||s.level<2){level_flags=0}else if(s.level<6){level_flags=1}else if(s.level===6){level_flags=2}else{level_flags=3}
header|=(level_flags<<6);if(s.strstart!==0){header|=PRESET_DICT}
header+=31-(header%31);s.status=BUSY_STATE;putShortMSB(s,header);if(s.strstart!==0){putShortMSB(s,strm.adler>>>16);putShortMSB(s,strm.adler&0xffff)}
strm.adler=1}}
if(s.status===EXTRA_STATE){if(s.gzhead.extra){beg=s.pending;while(s.gzindex<(s.gzhead.extra.length&0xffff)){if(s.pending===s.pending_buf_size){if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}
flush_pending(strm);beg=s.pending;if(s.pending===s.pending_buf_size){break}}
put_byte(s,s.gzhead.extra[s.gzindex]&0xff);s.gzindex++}
if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}
if(s.gzindex===s.gzhead.extra.length){s.gzindex=0;s.status=NAME_STATE}}else{s.status=NAME_STATE}}
if(s.status===NAME_STATE){if(s.gzhead.name){beg=s.pending;do{if(s.pending===s.pending_buf_size){if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}
flush_pending(strm);beg=s.pending;if(s.pending===s.pending_buf_size){val=1;break}}
if(s.gzindex<s.gzhead.name.length){val=s.gzhead.name.charCodeAt(s.gzindex++)&0xff}else{val=0}
put_byte(s,val)}while(val!==0);if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}
if(val===0){s.gzindex=0;s.status=COMMENT_STATE}}else{s.status=COMMENT_STATE}}
if(s.status===COMMENT_STATE){if(s.gzhead.comment){beg=s.pending;do{if(s.pending===s.pending_buf_size){if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}
flush_pending(strm);beg=s.pending;if(s.pending===s.pending_buf_size){val=1;break}}
if(s.gzindex<s.gzhead.comment.length){val=s.gzhead.comment.charCodeAt(s.gzindex++)&0xff}else{val=0}
put_byte(s,val)}while(val!==0);if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}
if(val===0){s.status=HCRC_STATE}}else{s.status=HCRC_STATE}}
if(s.status===HCRC_STATE){if(s.gzhead.hcrc){if(s.pending+2>s.pending_buf_size){flush_pending(strm)}
if(s.pending+2<=s.pending_buf_size){put_byte(s,strm.adler&0xff);put_byte(s,(strm.adler>>8)&0xff);strm.adler=0;s.status=BUSY_STATE}}else{s.status=BUSY_STATE}}
if(s.pending!==0){flush_pending(strm);if(strm.avail_out===0){s.last_flush=-1;return Z_OK}}else if(strm.avail_in===0&&rank(flush)<=rank(old_flush)&&flush!==Z_FINISH){return err(strm,Z_BUF_ERROR)}
if(s.status===FINISH_STATE&&strm.avail_in!==0){return err(strm,Z_BUF_ERROR)}
if(strm.avail_in!==0||s.lookahead!==0||(flush!==Z_NO_FLUSH&&s.status!==FINISH_STATE)){var bstate=(s.strategy===Z_HUFFMAN_ONLY)?deflate_huff(s,flush):(s.strategy===Z_RLE?deflate_rle(s,flush):configuration_table[s.level].func(s,flush));if(bstate===BS_FINISH_STARTED||bstate===BS_FINISH_DONE){s.status=FINISH_STATE}
if(bstate===BS_NEED_MORE||bstate===BS_FINISH_STARTED){if(strm.avail_out===0){s.last_flush=-1}
return Z_OK}
if(bstate===BS_BLOCK_DONE){if(flush===Z_PARTIAL_FLUSH){trees._tr_align(s)}else if(flush!==Z_BLOCK){trees._tr_stored_block(s,0,0,!1);if(flush===Z_FULL_FLUSH){zero(s.head);if(s.lookahead===0){s.strstart=0;s.block_start=0;s.insert=0}}}
flush_pending(strm);if(strm.avail_out===0){s.last_flush=-1;return Z_OK}}}
if(flush!==Z_FINISH){return Z_OK}
if(s.wrap<=0){return Z_STREAM_END}
if(s.wrap===2){put_byte(s,strm.adler&0xff);put_byte(s,(strm.adler>>8)&0xff);put_byte(s,(strm.adler>>16)&0xff);put_byte(s,(strm.adler>>24)&0xff);put_byte(s,strm.total_in&0xff);put_byte(s,(strm.total_in>>8)&0xff);put_byte(s,(strm.total_in>>16)&0xff);put_byte(s,(strm.total_in>>24)&0xff)}else{putShortMSB(s,strm.adler>>>16);putShortMSB(s,strm.adler&0xffff)}
flush_pending(strm);if(s.wrap>0){s.wrap=-s.wrap}
return s.pending!==0?Z_OK:Z_STREAM_END}
function deflateEnd(strm){var status;if(!strm||!strm.state){return Z_STREAM_ERROR}
status=strm.state.status;if(status!==INIT_STATE&&status!==EXTRA_STATE&&status!==NAME_STATE&&status!==COMMENT_STATE&&status!==HCRC_STATE&&status!==BUSY_STATE&&status!==FINISH_STATE){return err(strm,Z_STREAM_ERROR)}
strm.state=null;return status===BUSY_STATE?err(strm,Z_DATA_ERROR):Z_OK}
function deflateSetDictionary(strm,dictionary){var dictLength=dictionary.length;var s;var str,n;var wrap;var avail;var next;var input;var tmpDict;if(!strm||!strm.state){return Z_STREAM_ERROR}
s=strm.state;wrap=s.wrap;if(wrap===2||(wrap===1&&s.status!==INIT_STATE)||s.lookahead){return Z_STREAM_ERROR}
if(wrap===1){strm.adler=adler32(strm.adler,dictionary,dictLength,0)}
s.wrap=0;if(dictLength>=s.w_size){if(wrap===0){zero(s.head);s.strstart=0;s.block_start=0;s.insert=0}
tmpDict=new utils.Buf8(s.w_size);utils.arraySet(tmpDict,dictionary,dictLength-s.w_size,s.w_size,0);dictionary=tmpDict;dictLength=s.w_size}
avail=strm.avail_in;next=strm.next_in;input=strm.input;strm.avail_in=dictLength;strm.next_in=0;strm.input=dictionary;fill_window(s);while(s.lookahead>=MIN_MATCH){str=s.strstart;n=s.lookahead-(MIN_MATCH-1);do{s.ins_h=((s.ins_h<<s.hash_shift)^s.window[str+MIN_MATCH-1])&s.hash_mask;s.prev[str&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=str;str++}while(--n);s.strstart=str;s.lookahead=MIN_MATCH-1;fill_window(s)}
s.strstart+=s.lookahead;s.block_start=s.strstart;s.insert=s.lookahead;s.lookahead=0;s.match_length=s.prev_length=MIN_MATCH-1;s.match_available=0;strm.next_in=next;strm.input=input;strm.avail_in=avail;s.wrap=wrap;return Z_OK}
exports.deflateInit=deflateInit;exports.deflateInit2=deflateInit2;exports.deflateReset=deflateReset;exports.deflateResetKeep=deflateResetKeep;exports.deflateSetHeader=deflateSetHeader;exports.deflate=deflate;exports.deflateEnd=deflateEnd;exports.deflateSetDictionary=deflateSetDictionary;exports.deflateInfo='pako deflate (from Nodeca project)'},{"../utils/common":77,"./adler32":79,"./crc32":81,"./messages":87,"./trees":88}],83:[function(require,module,exports){'use strict';function GZheader(){this.text=0;this.time=0;this.xflags=0;this.os=0;this.extra=null;this.extra_len=0;this.name='';this.comment='';this.hcrc=0;this.done=!1}
module.exports=GZheader},{}],84:[function(require,module,exports){'use strict';var BAD=30;var TYPE=12;module.exports=function inflate_fast(strm,start){var state;var _in;var last;var _out;var beg;var end;var dmax;var wsize;var whave;var wnext;var s_window;var hold;var bits;var lcode;var dcode;var lmask;var dmask;var here;var op;var len;var dist;var from;var from_source;var input,output;state=strm.state;_in=strm.next_in;input=strm.input;last=_in+(strm.avail_in-5);_out=strm.next_out;output=strm.output;beg=_out-(start-strm.avail_out);end=_out+(strm.avail_out-257);dmax=state.dmax;wsize=state.wsize;whave=state.whave;wnext=state.wnext;s_window=state.window;hold=state.hold;bits=state.bits;lcode=state.lencode;dcode=state.distcode;lmask=(1<<state.lenbits)-1;dmask=(1<<state.distbits)-1;top:do{if(bits<15){hold+=input[_in++]<<bits;bits+=8;hold+=input[_in++]<<bits;bits+=8}
here=lcode[hold&lmask];dolen:for(;;){op=here>>>24;hold>>>=op;bits-=op;op=(here>>>16)&0xff;if(op===0){output[_out++]=here&0xffff}else if(op&16){len=here&0xffff;op&=15;if(op){if(bits<op){hold+=input[_in++]<<bits;bits+=8}
len+=hold&((1<<op)-1);hold>>>=op;bits-=op}
if(bits<15){hold+=input[_in++]<<bits;bits+=8;hold+=input[_in++]<<bits;bits+=8}
here=dcode[hold&dmask];dodist:for(;;){op=here>>>24;hold>>>=op;bits-=op;op=(here>>>16)&0xff;if(op&16){dist=here&0xffff;op&=15;if(bits<op){hold+=input[_in++]<<bits;bits+=8;if(bits<op){hold+=input[_in++]<<bits;bits+=8}}
dist+=hold&((1<<op)-1);if(dist>dmax){strm.msg='invalid distance too far back';state.mode=BAD;break top}
hold>>>=op;bits-=op;op=_out-beg;if(dist>op){op=dist-op;if(op>whave){if(state.sane){strm.msg='invalid distance too far back';state.mode=BAD;break top}}
from=0;from_source=s_window;if(wnext===0){from+=wsize-op;if(op<len){len-=op;do{output[_out++]=s_window[from++]}while(--op);from=_out-dist;from_source=output}}else if(wnext<op){from+=wsize+wnext-op;op-=wnext;if(op<len){len-=op;do{output[_out++]=s_window[from++]}while(--op);from=0;if(wnext<len){op=wnext;len-=op;do{output[_out++]=s_window[from++]}while(--op);from=_out-dist;from_source=output}}}else{from+=wnext-op;if(op<len){len-=op;do{output[_out++]=s_window[from++]}while(--op);from=_out-dist;from_source=output}}
while(len>2){output[_out++]=from_source[from++];output[_out++]=from_source[from++];output[_out++]=from_source[from++];len-=3}
if(len){output[_out++]=from_source[from++];if(len>1){output[_out++]=from_source[from++]}}}else{from=_out-dist;do{output[_out++]=output[from++];output[_out++]=output[from++];output[_out++]=output[from++];len-=3}while(len>2);if(len){output[_out++]=output[from++];if(len>1){output[_out++]=output[from++]}}}}else if((op&64)===0){here=dcode[(here&0xffff)+(hold&((1<<op)-1))];continue dodist}else{strm.msg='invalid distance code';state.mode=BAD;break top}
break}}else if((op&64)===0){here=lcode[(here&0xffff)+(hold&((1<<op)-1))];continue dolen}else if(op&32){state.mode=TYPE;break top}else{strm.msg='invalid literal/length code';state.mode=BAD;break top}
break}}while(_in<last&&_out<end);len=bits>>3;_in-=len;bits-=len<<3;hold&=(1<<bits)-1;strm.next_in=_in;strm.next_out=_out;strm.avail_in=(_in<last?5+(last-_in):5-(_in-last));strm.avail_out=(_out<end?257+(end-_out):257-(_out-end));state.hold=hold;state.bits=bits;return}},{}],85:[function(require,module,exports){'use strict';var utils=require('../utils/common');var adler32=require('./adler32');var crc32=require('./crc32');var inflate_fast=require('./inffast');var inflate_table=require('./inftrees');var CODES=0;var LENS=1;var DISTS=2;var Z_FINISH=4;var Z_BLOCK=5;var Z_TREES=6;var Z_OK=0;var Z_STREAM_END=1;var Z_NEED_DICT=2;var Z_STREAM_ERROR=-2;var Z_DATA_ERROR=-3;var Z_MEM_ERROR=-4;var Z_BUF_ERROR=-5;var Z_DEFLATED=8;var HEAD=1;var FLAGS=2;var TIME=3;var OS=4;var EXLEN=5;var EXTRA=6;var NAME=7;var COMMENT=8;var HCRC=9;var DICTID=10;var DICT=11;var TYPE=12;var TYPEDO=13;var STORED=14;var COPY_=15;var COPY=16;var TABLE=17;var LENLENS=18;var CODELENS=19;var LEN_=20;var LEN=21;var LENEXT=22;var DIST=23;var DISTEXT=24;var MATCH=25;var LIT=26;var CHECK=27;var LENGTH=28;var DONE=29;var BAD=30;var MEM=31;var SYNC=32;var ENOUGH_LENS=852;var ENOUGH_DISTS=592;var MAX_WBITS=15;var DEF_WBITS=MAX_WBITS;function zswap32(q){return(((q>>>24)&0xff)+((q>>>8)&0xff00)+((q&0xff00)<<8)+((q&0xff)<<24))}
function InflateState(){this.mode=0;this.last=!1;this.wrap=0;this.havedict=!1;this.flags=0;this.dmax=0;this.check=0;this.total=0;this.head=null;this.wbits=0;this.wsize=0;this.whave=0;this.wnext=0;this.window=null;this.hold=0;this.bits=0;this.length=0;this.offset=0;this.extra=0;this.lencode=null;this.distcode=null;this.lenbits=0;this.distbits=0;this.ncode=0;this.nlen=0;this.ndist=0;this.have=0;this.next=null;this.lens=new utils.Buf16(320);this.work=new utils.Buf16(288);this.lendyn=null;this.distdyn=null;this.sane=0;this.back=0;this.was=0}
function inflateResetKeep(strm){var state;if(!strm||!strm.state){return Z_STREAM_ERROR}
state=strm.state;strm.total_in=strm.total_out=state.total=0;strm.msg='';if(state.wrap){strm.adler=state.wrap&1}
state.mode=HEAD;state.last=0;state.havedict=0;state.dmax=32768;state.head=null;state.hold=0;state.bits=0;state.lencode=state.lendyn=new utils.Buf32(ENOUGH_LENS);state.distcode=state.distdyn=new utils.Buf32(ENOUGH_DISTS);state.sane=1;state.back=-1;return Z_OK}
function inflateReset(strm){var state;if(!strm||!strm.state){return Z_STREAM_ERROR}
state=strm.state;state.wsize=0;state.whave=0;state.wnext=0;return inflateResetKeep(strm)}
function inflateReset2(strm,windowBits){var wrap;var state;if(!strm||!strm.state){return Z_STREAM_ERROR}
state=strm.state;if(windowBits<0){wrap=0;windowBits=-windowBits}else{wrap=(windowBits>>4)+1;if(windowBits<48){windowBits&=15}}
if(windowBits&&(windowBits<8||windowBits>15)){return Z_STREAM_ERROR}
if(state.window!==null&&state.wbits!==windowBits){state.window=null}
state.wrap=wrap;state.wbits=windowBits;return inflateReset(strm)}
function inflateInit2(strm,windowBits){var ret;var state;if(!strm){return Z_STREAM_ERROR}
state=new InflateState();strm.state=state;state.window=null;ret=inflateReset2(strm,windowBits);if(ret!==Z_OK){strm.state=null}
return ret}
function inflateInit(strm){return inflateInit2(strm,DEF_WBITS)}
var virgin=!0;var lenfix,distfix;function fixedtables(state){if(virgin){var sym;lenfix=new utils.Buf32(512);distfix=new utils.Buf32(32);sym=0;while(sym<144){state.lens[sym++]=8}
while(sym<256){state.lens[sym++]=9}
while(sym<280){state.lens[sym++]=7}
while(sym<288){state.lens[sym++]=8}
inflate_table(LENS,state.lens,0,288,lenfix,0,state.work,{bits:9});sym=0;while(sym<32){state.lens[sym++]=5}
inflate_table(DISTS,state.lens,0,32,distfix,0,state.work,{bits:5});virgin=!1}
state.lencode=lenfix;state.lenbits=9;state.distcode=distfix;state.distbits=5}
function updatewindow(strm,src,end,copy){var dist;var state=strm.state;if(state.window===null){state.wsize=1<<state.wbits;state.wnext=0;state.whave=0;state.window=new utils.Buf8(state.wsize)}
if(copy>=state.wsize){utils.arraySet(state.window,src,end-state.wsize,state.wsize,0);state.wnext=0;state.whave=state.wsize}else{dist=state.wsize-state.wnext;if(dist>copy){dist=copy}
utils.arraySet(state.window,src,end-copy,dist,state.wnext);copy-=dist;if(copy){utils.arraySet(state.window,src,end-copy,copy,0);state.wnext=copy;state.whave=state.wsize}else{state.wnext+=dist;if(state.wnext===state.wsize){state.wnext=0}
if(state.whave<state.wsize){state.whave+=dist}}}
return 0}
function inflate(strm,flush){var state;var input,output;var next;var put;var have,left;var hold;var bits;var _in,_out;var copy;var from;var from_source;var here=0;var here_bits,here_op,here_val;var last_bits,last_op,last_val;var len;var ret;var hbuf=new utils.Buf8(4);var opts;var n;var order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!strm||!strm.state||!strm.output||(!strm.input&&strm.avail_in!==0)){return Z_STREAM_ERROR}
state=strm.state;if(state.mode===TYPE){state.mode=TYPEDO}
put=strm.next_out;output=strm.output;left=strm.avail_out;next=strm.next_in;input=strm.input;have=strm.avail_in;hold=state.hold;bits=state.bits;_in=have;_out=left;ret=Z_OK;inf_leave:for(;;){switch(state.mode){case HEAD:if(state.wrap===0){state.mode=TYPEDO;break}
while(bits<16){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if((state.wrap&2)&&hold===0x8b1f){state.check=0;hbuf[0]=hold&0xff;hbuf[1]=(hold>>>8)&0xff;state.check=crc32(state.check,hbuf,2,0);hold=0;bits=0;state.mode=FLAGS;break}
state.flags=0;if(state.head){state.head.done=!1}
if(!(state.wrap&1)||(((hold&0xff)<<8)+(hold>>8))%31){strm.msg='incorrect header check';state.mode=BAD;break}
if((hold&0x0f)!==Z_DEFLATED){strm.msg='unknown compression method';state.mode=BAD;break}
hold>>>=4;bits-=4;len=(hold&0x0f)+8;if(state.wbits===0){state.wbits=len}else if(len>state.wbits){strm.msg='invalid window size';state.mode=BAD;break}
state.dmax=1<<len;strm.adler=state.check=1;state.mode=hold&0x200?DICTID:TYPE;hold=0;bits=0;break;case FLAGS:while(bits<16){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
state.flags=hold;if((state.flags&0xff)!==Z_DEFLATED){strm.msg='unknown compression method';state.mode=BAD;break}
if(state.flags&0xe000){strm.msg='unknown header flags set';state.mode=BAD;break}
if(state.head){state.head.text=((hold>>8)&1)}
if(state.flags&0x0200){hbuf[0]=hold&0xff;hbuf[1]=(hold>>>8)&0xff;state.check=crc32(state.check,hbuf,2,0)}
hold=0;bits=0;state.mode=TIME;case TIME:while(bits<32){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if(state.head){state.head.time=hold}
if(state.flags&0x0200){hbuf[0]=hold&0xff;hbuf[1]=(hold>>>8)&0xff;hbuf[2]=(hold>>>16)&0xff;hbuf[3]=(hold>>>24)&0xff;state.check=crc32(state.check,hbuf,4,0)}
hold=0;bits=0;state.mode=OS;case OS:while(bits<16){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if(state.head){state.head.xflags=(hold&0xff);state.head.os=(hold>>8)}
if(state.flags&0x0200){hbuf[0]=hold&0xff;hbuf[1]=(hold>>>8)&0xff;state.check=crc32(state.check,hbuf,2,0)}
hold=0;bits=0;state.mode=EXLEN;case EXLEN:if(state.flags&0x0400){while(bits<16){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
state.length=hold;if(state.head){state.head.extra_len=hold}
if(state.flags&0x0200){hbuf[0]=hold&0xff;hbuf[1]=(hold>>>8)&0xff;state.check=crc32(state.check,hbuf,2,0)}
hold=0;bits=0}else if(state.head){state.head.extra=null}
state.mode=EXTRA;case EXTRA:if(state.flags&0x0400){copy=state.length;if(copy>have){copy=have}
if(copy){if(state.head){len=state.head.extra_len-state.length;if(!state.head.extra){state.head.extra=new Array(state.head.extra_len)}
utils.arraySet(state.head.extra,input,next,copy,len)}
if(state.flags&0x0200){state.check=crc32(state.check,input,copy,next)}
have-=copy;next+=copy;state.length-=copy}
if(state.length){break inf_leave}}
state.length=0;state.mode=NAME;case NAME:if(state.flags&0x0800){if(have===0){break inf_leave}
copy=0;do{len=input[next+copy++];if(state.head&&len&&(state.length<65536)){state.head.name+=String.fromCharCode(len)}}while(len&&copy<have);if(state.flags&0x0200){state.check=crc32(state.check,input,copy,next)}
have-=copy;next+=copy;if(len){break inf_leave}}else if(state.head){state.head.name=null}
state.length=0;state.mode=COMMENT;case COMMENT:if(state.flags&0x1000){if(have===0){break inf_leave}
copy=0;do{len=input[next+copy++];if(state.head&&len&&(state.length<65536)){state.head.comment+=String.fromCharCode(len)}}while(len&&copy<have);if(state.flags&0x0200){state.check=crc32(state.check,input,copy,next)}
have-=copy;next+=copy;if(len){break inf_leave}}else if(state.head){state.head.comment=null}
state.mode=HCRC;case HCRC:if(state.flags&0x0200){while(bits<16){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if(hold!==(state.check&0xffff)){strm.msg='header crc mismatch';state.mode=BAD;break}
hold=0;bits=0}
if(state.head){state.head.hcrc=((state.flags>>9)&1);state.head.done=!0}
strm.adler=state.check=0;state.mode=TYPE;break;case DICTID:while(bits<32){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
strm.adler=state.check=zswap32(hold);hold=0;bits=0;state.mode=DICT;case DICT:if(state.havedict===0){strm.next_out=put;strm.avail_out=left;strm.next_in=next;strm.avail_in=have;state.hold=hold;state.bits=bits;return Z_NEED_DICT}
strm.adler=state.check=1;state.mode=TYPE;case TYPE:if(flush===Z_BLOCK||flush===Z_TREES){break inf_leave}
case TYPEDO:if(state.last){hold>>>=bits&7;bits-=bits&7;state.mode=CHECK;break}
while(bits<3){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
state.last=(hold&0x01);hold>>>=1;bits-=1;switch((hold&0x03)){case 0:state.mode=STORED;break;case 1:fixedtables(state);state.mode=LEN_;if(flush===Z_TREES){hold>>>=2;bits-=2;break inf_leave}
break;case 2:state.mode=TABLE;break;case 3:strm.msg='invalid block type';state.mode=BAD}
hold>>>=2;bits-=2;break;case STORED:hold>>>=bits&7;bits-=bits&7;while(bits<32){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if((hold&0xffff)!==((hold>>>16)^0xffff)){strm.msg='invalid stored block lengths';state.mode=BAD;break}
state.length=hold&0xffff;hold=0;bits=0;state.mode=COPY_;if(flush===Z_TREES){break inf_leave}
case COPY_:state.mode=COPY;case COPY:copy=state.length;if(copy){if(copy>have){copy=have}
if(copy>left){copy=left}
if(copy===0){break inf_leave}
utils.arraySet(output,input,next,copy,put);have-=copy;next+=copy;left-=copy;put+=copy;state.length-=copy;break}
state.mode=TYPE;break;case TABLE:while(bits<14){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
state.nlen=(hold&0x1f)+257;hold>>>=5;bits-=5;state.ndist=(hold&0x1f)+1;hold>>>=5;bits-=5;state.ncode=(hold&0x0f)+4;hold>>>=4;bits-=4;if(state.nlen>286||state.ndist>30){strm.msg='too many length or distance symbols';state.mode=BAD;break}
state.have=0;state.mode=LENLENS;case LENLENS:while(state.have<state.ncode){while(bits<3){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
state.lens[order[state.have++]]=(hold&0x07);hold>>>=3;bits-=3}
while(state.have<19){state.lens[order[state.have++]]=0}
state.lencode=state.lendyn;state.lenbits=7;opts={bits:state.lenbits};ret=inflate_table(CODES,state.lens,0,19,state.lencode,0,state.work,opts);state.lenbits=opts.bits;if(ret){strm.msg='invalid code lengths set';state.mode=BAD;break}
state.have=0;state.mode=CODELENS;case CODELENS:while(state.have<state.nlen+state.ndist){for(;;){here=state.lencode[hold&((1<<state.lenbits)-1)];here_bits=here>>>24;here_op=(here>>>16)&0xff;here_val=here&0xffff;if((here_bits)<=bits){break}
if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if(here_val<16){hold>>>=here_bits;bits-=here_bits;state.lens[state.have++]=here_val}else{if(here_val===16){n=here_bits+2;while(bits<n){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
hold>>>=here_bits;bits-=here_bits;if(state.have===0){strm.msg='invalid bit length repeat';state.mode=BAD;break}
len=state.lens[state.have-1];copy=3+(hold&0x03);hold>>>=2;bits-=2}else if(here_val===17){n=here_bits+3;while(bits<n){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
hold>>>=here_bits;bits-=here_bits;len=0;copy=3+(hold&0x07);hold>>>=3;bits-=3}else{n=here_bits+7;while(bits<n){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
hold>>>=here_bits;bits-=here_bits;len=0;copy=11+(hold&0x7f);hold>>>=7;bits-=7}
if(state.have+copy>state.nlen+state.ndist){strm.msg='invalid bit length repeat';state.mode=BAD;break}
while(copy--){state.lens[state.have++]=len}}}
if(state.mode===BAD){break}
if(state.lens[256]===0){strm.msg='invalid code -- missing end-of-block';state.mode=BAD;break}
state.lenbits=9;opts={bits:state.lenbits};ret=inflate_table(LENS,state.lens,0,state.nlen,state.lencode,0,state.work,opts);state.lenbits=opts.bits;if(ret){strm.msg='invalid literal/lengths set';state.mode=BAD;break}
state.distbits=6;state.distcode=state.distdyn;opts={bits:state.distbits};ret=inflate_table(DISTS,state.lens,state.nlen,state.ndist,state.distcode,0,state.work,opts);state.distbits=opts.bits;if(ret){strm.msg='invalid distances set';state.mode=BAD;break}
state.mode=LEN_;if(flush===Z_TREES){break inf_leave}
case LEN_:state.mode=LEN;case LEN:if(have>=6&&left>=258){strm.next_out=put;strm.avail_out=left;strm.next_in=next;strm.avail_in=have;state.hold=hold;state.bits=bits;inflate_fast(strm,_out);put=strm.next_out;output=strm.output;left=strm.avail_out;next=strm.next_in;input=strm.input;have=strm.avail_in;hold=state.hold;bits=state.bits;if(state.mode===TYPE){state.back=-1}
break}
state.back=0;for(;;){here=state.lencode[hold&((1<<state.lenbits)-1)];here_bits=here>>>24;here_op=(here>>>16)&0xff;here_val=here&0xffff;if(here_bits<=bits){break}
if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if(here_op&&(here_op&0xf0)===0){last_bits=here_bits;last_op=here_op;last_val=here_val;for(;;){here=state.lencode[last_val+((hold&((1<<(last_bits+last_op))-1))>>last_bits)];here_bits=here>>>24;here_op=(here>>>16)&0xff;here_val=here&0xffff;if((last_bits+here_bits)<=bits){break}
if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
hold>>>=last_bits;bits-=last_bits;state.back+=last_bits}
hold>>>=here_bits;bits-=here_bits;state.back+=here_bits;state.length=here_val;if(here_op===0){state.mode=LIT;break}
if(here_op&32){state.back=-1;state.mode=TYPE;break}
if(here_op&64){strm.msg='invalid literal/length code';state.mode=BAD;break}
state.extra=here_op&15;state.mode=LENEXT;case LENEXT:if(state.extra){n=state.extra;while(bits<n){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
state.length+=hold&((1<<state.extra)-1);hold>>>=state.extra;bits-=state.extra;state.back+=state.extra}
state.was=state.length;state.mode=DIST;case DIST:for(;;){here=state.distcode[hold&((1<<state.distbits)-1)];here_bits=here>>>24;here_op=(here>>>16)&0xff;here_val=here&0xffff;if((here_bits)<=bits){break}
if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if((here_op&0xf0)===0){last_bits=here_bits;last_op=here_op;last_val=here_val;for(;;){here=state.distcode[last_val+((hold&((1<<(last_bits+last_op))-1))>>last_bits)];here_bits=here>>>24;here_op=(here>>>16)&0xff;here_val=here&0xffff;if((last_bits+here_bits)<=bits){break}
if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
hold>>>=last_bits;bits-=last_bits;state.back+=last_bits}
hold>>>=here_bits;bits-=here_bits;state.back+=here_bits;if(here_op&64){strm.msg='invalid distance code';state.mode=BAD;break}
state.offset=here_val;state.extra=(here_op)&15;state.mode=DISTEXT;case DISTEXT:if(state.extra){n=state.extra;while(bits<n){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
state.offset+=hold&((1<<state.extra)-1);hold>>>=state.extra;bits-=state.extra;state.back+=state.extra}
if(state.offset>state.dmax){strm.msg='invalid distance too far back';state.mode=BAD;break}
state.mode=MATCH;case MATCH:if(left===0){break inf_leave}
copy=_out-left;if(state.offset>copy){copy=state.offset-copy;if(copy>state.whave){if(state.sane){strm.msg='invalid distance too far back';state.mode=BAD;break}}
if(copy>state.wnext){copy-=state.wnext;from=state.wsize-copy}else{from=state.wnext-copy}
if(copy>state.length){copy=state.length}
from_source=state.window}else{from_source=output;from=put-state.offset;copy=state.length}
if(copy>left){copy=left}
left-=copy;state.length-=copy;do{output[put++]=from_source[from++]}while(--copy);if(state.length===0){state.mode=LEN}
break;case LIT:if(left===0){break inf_leave}
output[put++]=state.length;left--;state.mode=LEN;break;case CHECK:if(state.wrap){while(bits<32){if(have===0){break inf_leave}
have--;hold|=input[next++]<<bits;bits+=8}
_out-=left;strm.total_out+=_out;state.total+=_out;if(_out){strm.adler=state.check=(state.flags?crc32(state.check,output,_out,put-_out):adler32(state.check,output,_out,put-_out))}
_out=left;if((state.flags?hold:zswap32(hold))!==state.check){strm.msg='incorrect data check';state.mode=BAD;break}
hold=0;bits=0}
state.mode=LENGTH;case LENGTH:if(state.wrap&&state.flags){while(bits<32){if(have===0){break inf_leave}
have--;hold+=input[next++]<<bits;bits+=8}
if(hold!==(state.total&0xffffffff)){strm.msg='incorrect length check';state.mode=BAD;break}
hold=0;bits=0}
state.mode=DONE;case DONE:ret=Z_STREAM_END;break inf_leave;case BAD:ret=Z_DATA_ERROR;break inf_leave;case MEM:return Z_MEM_ERROR;case SYNC:default:return Z_STREAM_ERROR}}
strm.next_out=put;strm.avail_out=left;strm.next_in=next;strm.avail_in=have;state.hold=hold;state.bits=bits;if(state.wsize||(_out!==strm.avail_out&&state.mode<BAD&&(state.mode<CHECK||flush!==Z_FINISH))){if(updatewindow(strm,strm.output,strm.next_out,_out-strm.avail_out)){state.mode=MEM;return Z_MEM_ERROR}}
_in-=strm.avail_in;_out-=strm.avail_out;strm.total_in+=_in;strm.total_out+=_out;state.total+=_out;if(state.wrap&&_out){strm.adler=state.check=(state.flags?crc32(state.check,output,_out,strm.next_out-_out):adler32(state.check,output,_out,strm.next_out-_out))}
strm.data_type=state.bits+(state.last?64:0)+(state.mode===TYPE?128:0)+(state.mode===LEN_||state.mode===COPY_?256:0);if(((_in===0&&_out===0)||flush===Z_FINISH)&&ret===Z_OK){ret=Z_BUF_ERROR}
return ret}
function inflateEnd(strm){if(!strm||!strm.state){return Z_STREAM_ERROR}
var state=strm.state;if(state.window){state.window=null}
strm.state=null;return Z_OK}
function inflateGetHeader(strm,head){var state;if(!strm||!strm.state){return Z_STREAM_ERROR}
state=strm.state;if((state.wrap&2)===0){return Z_STREAM_ERROR}
state.head=head;head.done=!1;return Z_OK}
function inflateSetDictionary(strm,dictionary){var dictLength=dictionary.length;var state;var dictid;var ret;if(!strm||!strm.state){return Z_STREAM_ERROR}
state=strm.state;if(state.wrap!==0&&state.mode!==DICT){return Z_STREAM_ERROR}
if(state.mode===DICT){dictid=1;dictid=adler32(dictid,dictionary,dictLength,0);if(dictid!==state.check){return Z_DATA_ERROR}}
ret=updatewindow(strm,dictionary,dictLength,dictLength);if(ret){state.mode=MEM;return Z_MEM_ERROR}
state.havedict=1;return Z_OK}
exports.inflateReset=inflateReset;exports.inflateReset2=inflateReset2;exports.inflateResetKeep=inflateResetKeep;exports.inflateInit=inflateInit;exports.inflateInit2=inflateInit2;exports.inflate=inflate;exports.inflateEnd=inflateEnd;exports.inflateGetHeader=inflateGetHeader;exports.inflateSetDictionary=inflateSetDictionary;exports.inflateInfo='pako inflate (from Nodeca project)'},{"../utils/common":77,"./adler32":79,"./crc32":81,"./inffast":84,"./inftrees":86}],86:[function(require,module,exports){'use strict';var utils=require('../utils/common');var MAXBITS=15;var ENOUGH_LENS=852;var ENOUGH_DISTS=592;var CODES=0;var LENS=1;var DISTS=2;var lbase=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0];var lext=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78];var dbase=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0];var dext=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];module.exports=function inflate_table(type,lens,lens_index,codes,table,table_index,work,opts){var bits=opts.bits;var len=0;var sym=0;var min=0,max=0;var root=0;var curr=0;var drop=0;var left=0;var used=0;var huff=0;var incr;var fill;var low;var mask;var next;var base=null;var base_index=0;var end;var count=new utils.Buf16(MAXBITS+1);var offs=new utils.Buf16(MAXBITS+1);var extra=null;var extra_index=0;var here_bits,here_op,here_val;for(len=0;len<=MAXBITS;len++){count[len]=0}
for(sym=0;sym<codes;sym++){count[lens[lens_index+sym]]++}
root=bits;for(max=MAXBITS;max>=1;max--){if(count[max]!==0){break}}
if(root>max){root=max}
if(max===0){table[table_index++]=(1<<24)|(64<<16)|0;table[table_index++]=(1<<24)|(64<<16)|0;opts.bits=1;return 0}
for(min=1;min<max;min++){if(count[min]!==0){break}}
if(root<min){root=min}
left=1;for(len=1;len<=MAXBITS;len++){left<<=1;left-=count[len];if(left<0){return-1}}
if(left>0&&(type===CODES||max!==1)){return-1}
offs[1]=0;for(len=1;len<MAXBITS;len++){offs[len+1]=offs[len]+count[len]}
for(sym=0;sym<codes;sym++){if(lens[lens_index+sym]!==0){work[offs[lens[lens_index+sym]]++]=sym}}
if(type===CODES){base=extra=work;end=19}else if(type===LENS){base=lbase;base_index-=257;extra=lext;extra_index-=257;end=256}else{base=dbase;extra=dext;end=-1}
huff=0;sym=0;len=min;next=table_index;curr=root;drop=0;low=-1;used=1<<root;mask=used-1;if((type===LENS&&used>ENOUGH_LENS)||(type===DISTS&&used>ENOUGH_DISTS)){return 1}
var i=0;for(;;){i++;here_bits=len-drop;if(work[sym]<end){here_op=0;here_val=work[sym]}else if(work[sym]>end){here_op=extra[extra_index+work[sym]];here_val=base[base_index+work[sym]]}else{here_op=32+64;here_val=0}
incr=1<<(len-drop);fill=1<<curr;min=fill;do{fill-=incr;table[next+(huff>>drop)+fill]=(here_bits<<24)|(here_op<<16)|here_val|0}while(fill!==0);incr=1<<(len-1);while(huff&incr){incr>>=1}
if(incr!==0){huff&=incr-1;huff+=incr}else{huff=0}
sym++;if(--count[len]===0){if(len===max){break}
len=lens[lens_index+work[sym]]}
if(len>root&&(huff&mask)!==low){if(drop===0){drop=root}
next+=min;curr=len-drop;left=1<<curr;while(curr+drop<max){left-=count[curr+drop];if(left<=0){break}
curr++;left<<=1}
used+=1<<curr;if((type===LENS&&used>ENOUGH_LENS)||(type===DISTS&&used>ENOUGH_DISTS)){return 1}
low=huff&mask;table[low]=(root<<24)|(curr<<16)|(next-table_index)|0}}
if(huff!==0){table[next+huff]=((len-drop)<<24)|(64<<16)|0}
opts.bits=root;return 0}},{"../utils/common":77}],87:[function(require,module,exports){'use strict';module.exports={2:'need dictionary',1:'stream end',0:'','-1':'file error','-2':'stream error','-3':'data error','-4':'insufficient memory','-5':'buffer error','-6':'incompatible version'}},{}],88:[function(require,module,exports){'use strict';var utils=require('../utils/common');var Z_FIXED=4;var Z_BINARY=0;var Z_TEXT=1;var Z_UNKNOWN=2;function zero(buf){var len=buf.length;while(--len>=0){buf[len]=0}}
var STORED_BLOCK=0;var STATIC_TREES=1;var DYN_TREES=2;var MIN_MATCH=3;var MAX_MATCH=258;var LENGTH_CODES=29;var LITERALS=256;var L_CODES=LITERALS+1+LENGTH_CODES;var D_CODES=30;var BL_CODES=19;var HEAP_SIZE=2*L_CODES+1;var MAX_BITS=15;var Buf_size=16;var MAX_BL_BITS=7;var END_BLOCK=256;var REP_3_6=16;var REPZ_3_10=17;var REPZ_11_138=18;var extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];var extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];var extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];var bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];var DIST_CODE_LEN=512;var static_ltree=new Array((L_CODES+2)*2);zero(static_ltree);var static_dtree=new Array(D_CODES*2);zero(static_dtree);var _dist_code=new Array(DIST_CODE_LEN);zero(_dist_code);var _length_code=new Array(MAX_MATCH-MIN_MATCH+1);zero(_length_code);var base_length=new Array(LENGTH_CODES);zero(base_length);var base_dist=new Array(D_CODES);zero(base_dist);function StaticTreeDesc(static_tree,extra_bits,extra_base,elems,max_length){this.static_tree=static_tree;this.extra_bits=extra_bits;this.extra_base=extra_base;this.elems=elems;this.max_length=max_length;this.has_stree=static_tree&&static_tree.length}
var static_l_desc;var static_d_desc;var static_bl_desc;function TreeDesc(dyn_tree,stat_desc){this.dyn_tree=dyn_tree;this.max_code=0;this.stat_desc=stat_desc}
function d_code(dist){return dist<256?_dist_code[dist]:_dist_code[256+(dist>>>7)]}
function put_short(s,w){s.pending_buf[s.pending++]=(w)&0xff;s.pending_buf[s.pending++]=(w>>>8)&0xff}
function send_bits(s,value,length){if(s.bi_valid>(Buf_size-length)){s.bi_buf|=(value<<s.bi_valid)&0xffff;put_short(s,s.bi_buf);s.bi_buf=value>>(Buf_size-s.bi_valid);s.bi_valid+=length-Buf_size}else{s.bi_buf|=(value<<s.bi_valid)&0xffff;s.bi_valid+=length}}
function send_code(s,c,tree){send_bits(s,tree[c*2],tree[c*2+1])}
function bi_reverse(code,len){var res=0;do{res|=code&1;code>>>=1;res<<=1}while(--len>0);return res>>>1}
function bi_flush(s){if(s.bi_valid===16){put_short(s,s.bi_buf);s.bi_buf=0;s.bi_valid=0}else if(s.bi_valid>=8){s.pending_buf[s.pending++]=s.bi_buf&0xff;s.bi_buf>>=8;s.bi_valid-=8}}
function gen_bitlen(s,desc){var tree=desc.dyn_tree;var max_code=desc.max_code;var stree=desc.stat_desc.static_tree;var has_stree=desc.stat_desc.has_stree;var extra=desc.stat_desc.extra_bits;var base=desc.stat_desc.extra_base;var max_length=desc.stat_desc.max_length;var h;var n,m;var bits;var xbits;var f;var overflow=0;for(bits=0;bits<=MAX_BITS;bits++){s.bl_count[bits]=0}
tree[s.heap[s.heap_max]*2+1]=0;for(h=s.heap_max+1;h<HEAP_SIZE;h++){n=s.heap[h];bits=tree[tree[n*2+1]*2+1]+1;if(bits>max_length){bits=max_length;overflow++}
tree[n*2+1]=bits;if(n>max_code){continue}
s.bl_count[bits]++;xbits=0;if(n>=base){xbits=extra[n-base]}
f=tree[n*2];s.opt_len+=f*(bits+xbits);if(has_stree){s.static_len+=f*(stree[n*2+1]+xbits)}}
if(overflow===0){return}
do{bits=max_length-1;while(s.bl_count[bits]===0){bits--}
s.bl_count[bits]--;s.bl_count[bits+1]+=2;s.bl_count[max_length]--;overflow-=2}while(overflow>0);for(bits=max_length;bits!==0;bits--){n=s.bl_count[bits];while(n!==0){m=s.heap[--h];if(m>max_code){continue}
if(tree[m*2+1]!==bits){s.opt_len+=(bits-tree[m*2+1])*tree[m*2];tree[m*2+1]=bits}
n--}}}
function gen_codes(tree,max_code,bl_count){var next_code=new Array(MAX_BITS+1);var code=0;var bits;var n;for(bits=1;bits<=MAX_BITS;bits++){next_code[bits]=code=(code+bl_count[bits-1])<<1}
for(n=0;n<=max_code;n++){var len=tree[n*2+1];if(len===0){continue}
tree[n*2]=bi_reverse(next_code[len]++,len)}}
function tr_static_init(){var n;var bits;var length;var code;var dist;var bl_count=new Array(MAX_BITS+1);length=0;for(code=0;code<LENGTH_CODES-1;code++){base_length[code]=length;for(n=0;n<(1<<extra_lbits[code]);n++){_length_code[length++]=code}}
_length_code[length-1]=code;dist=0;for(code=0;code<16;code++){base_dist[code]=dist;for(n=0;n<(1<<extra_dbits[code]);n++){_dist_code[dist++]=code}}
dist>>=7;for(;code<D_CODES;code++){base_dist[code]=dist<<7;for(n=0;n<(1<<(extra_dbits[code]-7));n++){_dist_code[256+dist++]=code}}
for(bits=0;bits<=MAX_BITS;bits++){bl_count[bits]=0}
n=0;while(n<=143){static_ltree[n*2+1]=8;n++;bl_count[8]++}
while(n<=255){static_ltree[n*2+1]=9;n++;bl_count[9]++}
while(n<=279){static_ltree[n*2+1]=7;n++;bl_count[7]++}
while(n<=287){static_ltree[n*2+1]=8;n++;bl_count[8]++}
gen_codes(static_ltree,L_CODES+1,bl_count);for(n=0;n<D_CODES;n++){static_dtree[n*2+1]=5;static_dtree[n*2]=bi_reverse(n,5)}
static_l_desc=new StaticTreeDesc(static_ltree,extra_lbits,LITERALS+1,L_CODES,MAX_BITS);static_d_desc=new StaticTreeDesc(static_dtree,extra_dbits,0,D_CODES,MAX_BITS);static_bl_desc=new StaticTreeDesc(new Array(0),extra_blbits,0,BL_CODES,MAX_BL_BITS)}
function init_block(s){var n;for(n=0;n<L_CODES;n++){s.dyn_ltree[n*2]=0}
for(n=0;n<D_CODES;n++){s.dyn_dtree[n*2]=0}
for(n=0;n<BL_CODES;n++){s.bl_tree[n*2]=0}
s.dyn_ltree[END_BLOCK*2]=1;s.opt_len=s.static_len=0;s.last_lit=s.matches=0}
function bi_windup(s){if(s.bi_valid>8){put_short(s,s.bi_buf)}else if(s.bi_valid>0){s.pending_buf[s.pending++]=s.bi_buf}
s.bi_buf=0;s.bi_valid=0}
function copy_block(s,buf,len,header){bi_windup(s);if(header){put_short(s,len);put_short(s,~len)}
utils.arraySet(s.pending_buf,s.window,buf,len,s.pending);s.pending+=len}
function smaller(tree,n,m,depth){var _n2=n*2;var _m2=m*2;return(tree[_n2]<tree[_m2]||(tree[_n2]===tree[_m2]&&depth[n]<=depth[m]))}
function pqdownheap(s,tree,k){var v=s.heap[k];var j=k<<1;while(j<=s.heap_len){if(j<s.heap_len&&smaller(tree,s.heap[j+1],s.heap[j],s.depth)){j++}
if(smaller(tree,v,s.heap[j],s.depth)){break}
s.heap[k]=s.heap[j];k=j;j<<=1}
s.heap[k]=v}
function compress_block(s,ltree,dtree){var dist;var lc;var lx=0;var code;var extra;if(s.last_lit!==0){do{dist=(s.pending_buf[s.d_buf+lx*2]<<8)|(s.pending_buf[s.d_buf+lx*2+1]);lc=s.pending_buf[s.l_buf+lx];lx++;if(dist===0){send_code(s,lc,ltree)}else{code=_length_code[lc];send_code(s,code+LITERALS+1,ltree);extra=extra_lbits[code];if(extra!==0){lc-=base_length[code];send_bits(s,lc,extra)}
dist--;code=d_code(dist);send_code(s,code,dtree);extra=extra_dbits[code];if(extra!==0){dist-=base_dist[code];send_bits(s,dist,extra)}}}while(lx<s.last_lit);}
send_code(s,END_BLOCK,ltree)}
function build_tree(s,desc){var tree=desc.dyn_tree;var stree=desc.stat_desc.static_tree;var has_stree=desc.stat_desc.has_stree;var elems=desc.stat_desc.elems;var n,m;var max_code=-1;var node;s.heap_len=0;s.heap_max=HEAP_SIZE;for(n=0;n<elems;n++){if(tree[n*2]!==0){s.heap[++s.heap_len]=max_code=n;s.depth[n]=0}else{tree[n*2+1]=0}}
while(s.heap_len<2){node=s.heap[++s.heap_len]=(max_code<2?++max_code:0);tree[node*2]=1;s.depth[node]=0;s.opt_len--;if(has_stree){s.static_len-=stree[node*2+1]}}
desc.max_code=max_code;for(n=(s.heap_len>>1);n>=1;n--){pqdownheap(s,tree,n)}
node=elems;do{n=s.heap[1];s.heap[1]=s.heap[s.heap_len--];pqdownheap(s,tree,1);m=s.heap[1];s.heap[--s.heap_max]=n;s.heap[--s.heap_max]=m;tree[node*2]=tree[n*2]+tree[m*2];s.depth[node]=(s.depth[n]>=s.depth[m]?s.depth[n]:s.depth[m])+1;tree[n*2+1]=tree[m*2+1]=node;s.heap[1]=node++;pqdownheap(s,tree,1)}while(s.heap_len>=2);s.heap[--s.heap_max]=s.heap[1];gen_bitlen(s,desc);gen_codes(tree,max_code,s.bl_count)}
function scan_tree(s,tree,max_code){var n;var prevlen=-1;var curlen;var nextlen=tree[0*2+1];var count=0;var max_count=7;var min_count=4;if(nextlen===0){max_count=138;min_count=3}
tree[(max_code+1)*2+1]=0xffff;for(n=0;n<=max_code;n++){curlen=nextlen;nextlen=tree[(n+1)*2+1];if(++count<max_count&&curlen===nextlen){continue}else if(count<min_count){s.bl_tree[curlen*2]+=count}else if(curlen!==0){if(curlen!==prevlen){s.bl_tree[curlen*2]++}
s.bl_tree[REP_3_6*2]++}else if(count<=10){s.bl_tree[REPZ_3_10*2]++}else{s.bl_tree[REPZ_11_138*2]++}
count=0;prevlen=curlen;if(nextlen===0){max_count=138;min_count=3}else if(curlen===nextlen){max_count=6;min_count=3}else{max_count=7;min_count=4}}}
function send_tree(s,tree,max_code){var n;var prevlen=-1;var curlen;var nextlen=tree[0*2+1];var count=0;var max_count=7;var min_count=4;if(nextlen===0){max_count=138;min_count=3}
for(n=0;n<=max_code;n++){curlen=nextlen;nextlen=tree[(n+1)*2+1];if(++count<max_count&&curlen===nextlen){continue}else if(count<min_count){do{send_code(s,curlen,s.bl_tree)}while(--count!==0);}else if(curlen!==0){if(curlen!==prevlen){send_code(s,curlen,s.bl_tree);count--}
send_code(s,REP_3_6,s.bl_tree);send_bits(s,count-3,2)}else if(count<=10){send_code(s,REPZ_3_10,s.bl_tree);send_bits(s,count-3,3)}else{send_code(s,REPZ_11_138,s.bl_tree);send_bits(s,count-11,7)}
count=0;prevlen=curlen;if(nextlen===0){max_count=138;min_count=3}else if(curlen===nextlen){max_count=6;min_count=3}else{max_count=7;min_count=4}}}
function build_bl_tree(s){var max_blindex;scan_tree(s,s.dyn_ltree,s.l_desc.max_code);scan_tree(s,s.dyn_dtree,s.d_desc.max_code);build_tree(s,s.bl_desc);for(max_blindex=BL_CODES-1;max_blindex>=3;max_blindex--){if(s.bl_tree[bl_order[max_blindex]*2+1]!==0){break}}
s.opt_len+=3*(max_blindex+1)+5+5+4;return max_blindex}
function send_all_trees(s,lcodes,dcodes,blcodes){var rank;send_bits(s,lcodes-257,5);send_bits(s,dcodes-1,5);send_bits(s,blcodes-4,4);for(rank=0;rank<blcodes;rank++){send_bits(s,s.bl_tree[bl_order[rank]*2+1],3)}
send_tree(s,s.dyn_ltree,lcodes-1);send_tree(s,s.dyn_dtree,dcodes-1)}
function detect_data_type(s){var black_mask=0xf3ffc07f;var n;for(n=0;n<=31;n++,black_mask>>>=1){if((black_mask&1)&&(s.dyn_ltree[n*2]!==0)){return Z_BINARY}}
if(s.dyn_ltree[9*2]!==0||s.dyn_ltree[10*2]!==0||s.dyn_ltree[13*2]!==0){return Z_TEXT}
for(n=32;n<LITERALS;n++){if(s.dyn_ltree[n*2]!==0){return Z_TEXT}}
return Z_BINARY}
var static_init_done=!1;function _tr_init(s){if(!static_init_done){tr_static_init();static_init_done=!0}
s.l_desc=new TreeDesc(s.dyn_ltree,static_l_desc);s.d_desc=new TreeDesc(s.dyn_dtree,static_d_desc);s.bl_desc=new TreeDesc(s.bl_tree,static_bl_desc);s.bi_buf=0;s.bi_valid=0;init_block(s)}
function _tr_stored_block(s,buf,stored_len,last){send_bits(s,(STORED_BLOCK<<1)+(last?1:0),3);copy_block(s,buf,stored_len,!0)}
function _tr_align(s){send_bits(s,STATIC_TREES<<1,3);send_code(s,END_BLOCK,static_ltree);bi_flush(s)}
function _tr_flush_block(s,buf,stored_len,last){var opt_lenb,static_lenb;var max_blindex=0;if(s.level>0){if(s.strm.data_type===Z_UNKNOWN){s.strm.data_type=detect_data_type(s)}
build_tree(s,s.l_desc);build_tree(s,s.d_desc);max_blindex=build_bl_tree(s);opt_lenb=(s.opt_len+3+7)>>>3;static_lenb=(s.static_len+3+7)>>>3;if(static_lenb<=opt_lenb){opt_lenb=static_lenb}}else{opt_lenb=static_lenb=stored_len+5}
if((stored_len+4<=opt_lenb)&&(buf!==-1)){_tr_stored_block(s,buf,stored_len,last)}else if(s.strategy===Z_FIXED||static_lenb===opt_lenb){send_bits(s,(STATIC_TREES<<1)+(last?1:0),3);compress_block(s,static_ltree,static_dtree)}else{send_bits(s,(DYN_TREES<<1)+(last?1:0),3);send_all_trees(s,s.l_desc.max_code+1,s.d_desc.max_code+1,max_blindex+1);compress_block(s,s.dyn_ltree,s.dyn_dtree)}
init_block(s);if(last){bi_windup(s)}}
function _tr_tally(s,dist,lc){s.pending_buf[s.d_buf+s.last_lit*2]=(dist>>>8)&0xff;s.pending_buf[s.d_buf+s.last_lit*2+1]=dist&0xff;s.pending_buf[s.l_buf+s.last_lit]=lc&0xff;s.last_lit++;if(dist===0){s.dyn_ltree[lc*2]++}else{s.matches++;dist--;s.dyn_ltree[(_length_code[lc]+LITERALS+1)*2]++;s.dyn_dtree[d_code(dist)*2]++}
return(s.last_lit===s.lit_bufsize-1)}
exports._tr_init=_tr_init;exports._tr_stored_block=_tr_stored_block;exports._tr_flush_block=_tr_flush_block;exports._tr_tally=_tr_tally;exports._tr_align=_tr_align},{"../utils/common":77}],89:[function(require,module,exports){'use strict';function ZStream(){this.input=null;this.next_in=0;this.avail_in=0;this.total_in=0;this.output=null;this.next_out=0;this.avail_out=0;this.total_out=0;this.msg='';this.state=null;this.data_type=2;this.adler=0}
module.exports=ZStream},{}],90:[function(require,module,exports){(function(process){'use strict';if(!process.version||process.version.indexOf('v0.')===0||process.version.indexOf('v1.')===0&&process.version.indexOf('v1.8.')!==0){module.exports=nextTick}else{module.exports=process.nextTick}
function nextTick(fn,arg1,arg2,arg3){if(typeof fn!=='function'){throw new TypeError('"callback" argument must be a function')}
var len=arguments.length;var args,i;switch(len){case 0:case 1:return process.nextTick(fn);case 2:return process.nextTick(function afterTickOne(){fn.call(null,arg1)});case 3:return process.nextTick(function afterTickTwo(){fn.call(null,arg1,arg2)});case 4:return process.nextTick(function afterTickThree(){fn.call(null,arg1,arg2,arg3)});default:args=new Array(len-1);i=0;while(i<args.length){args[i++]=arguments[i]}
return process.nextTick(function afterTick(){fn.apply(null,args)})}}}).call(this,require('_process'))},{"_process":91}],91:[function(require,module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error('setTimeout has not been defined')}
function defaultClearTimeout(){throw new Error('clearTimeout has not been defined')}(function(){try{if(typeof setTimeout==='function'){cachedSetTimeout=setTimeout}else{cachedSetTimeout=defaultSetTimout}}catch(e){cachedSetTimeout=defaultSetTimout}
try{if(typeof clearTimeout==='function'){cachedClearTimeout=clearTimeout}else{cachedClearTimeout=defaultClearTimeout}}catch(e){cachedClearTimeout=defaultClearTimeout}}())
function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0)}
if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0)}
try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}
function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker)}
if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker)}
try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}
var queue=[];var draining=!1;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return}
draining=!1;if(currentQueue.length){queue=currentQueue.concat(queue)}else{queueIndex=-1}
if(queue.length){drainQueue()}}
function drainQueue(){if(draining){return}
var timeout=runTimeout(cleanUpNextTick);draining=!0;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run()}}
queueIndex=-1;len=queue.length}
currentQueue=null;draining=!1;runClearTimeout(timeout)}
process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i]}}
queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue)}};function Item(fun,array){this.fun=fun;this.array=array}
Item.prototype.run=function(){this.fun.apply(null,this.array)};process.title='browser';process.browser=!0;process.env={};process.argv=[];process.version='';process.versions={};function noop(){}
process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.binding=function(name){throw new Error('process.binding is not supported')};process.cwd=function(){return'/'};process.chdir=function(dir){throw new Error('process.chdir is not supported')};process.umask=function(){return 0}},{}],92:[function(require,module,exports){module.exports=require("./lib/_stream_duplex.js")},{"./lib/_stream_duplex.js":93}],93:[function(require,module,exports){'use strict';var objectKeys=Object.keys||function(obj){var keys=[];for(var key in obj){keys.push(key)}return keys};module.exports=Duplex;var processNextTick=require('process-nextick-args');var util=require('core-util-is');util.inherits=require('inherits');var Readable=require('./_stream_readable');var Writable=require('./_stream_writable');util.inherits(Duplex,Readable);var keys=objectKeys(Writable.prototype);for(var v=0;v<keys.length;v++){var method=keys[v];if(!Duplex.prototype[method])Duplex.prototype[method]=Writable.prototype[method]}
function Duplex(options){if(!(this instanceof Duplex))return new Duplex(options);Readable.call(this,options);Writable.call(this,options);if(options&&options.readable===!1)this.readable=!1;if(options&&options.writable===!1)this.writable=!1;this.allowHalfOpen=!0;if(options&&options.allowHalfOpen===!1)this.allowHalfOpen=!1;this.once('end',onend)}
function onend(){if(this.allowHalfOpen||this._writableState.ended)return;processNextTick(onEndNT,this)}
function onEndNT(self){self.end()}
function forEach(xs,f){for(var i=0,l=xs.length;i<l;i++){f(xs[i],i)}}},{"./_stream_readable":95,"./_stream_writable":97,"core-util-is":26,"inherits":35,"process-nextick-args":90}],94:[function(require,module,exports){'use strict';module.exports=PassThrough;var Transform=require('./_stream_transform');var util=require('core-util-is');util.inherits=require('inherits');util.inherits(PassThrough,Transform);function PassThrough(options){if(!(this instanceof PassThrough))return new PassThrough(options);Transform.call(this,options)}
PassThrough.prototype._transform=function(chunk,encoding,cb){cb(null,chunk)}},{"./_stream_transform":96,"core-util-is":26,"inherits":35}],95:[function(require,module,exports){(function(process){'use strict';module.exports=Readable;var processNextTick=require('process-nextick-args');var isArray=require('isarray');var Buffer=require('buffer').Buffer;Readable.ReadableState=ReadableState;var EE=require('events');var EElistenerCount=function(emitter,type){return emitter.listeners(type).length};var Stream;(function(){try{Stream=require('st'+'ream')}catch(_){}finally{if(!Stream)Stream=require('events').EventEmitter}})();var Buffer=require('buffer').Buffer;var util=require('core-util-is');util.inherits=require('inherits');var debugUtil=require('util');var debug=undefined;if(debugUtil&&debugUtil.debuglog){debug=debugUtil.debuglog('stream')}else{debug=function(){}}
var StringDecoder;util.inherits(Readable,Stream);var Duplex;function ReadableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.readableObjectMode;var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;this.highWaterMark=~~this.highWaterMark;this.buffer=[];this.length=0;this.pipes=null;this.pipesCount=0;this.flowing=null;this.ended=!1;this.endEmitted=!1;this.reading=!1;this.sync=!0;this.needReadable=!1;this.emittedReadable=!1;this.readableListening=!1;this.resumeScheduled=!1;this.defaultEncoding=options.defaultEncoding||'utf8';this.ranOut=!1;this.awaitDrain=0;this.readingMore=!1;this.decoder=null;this.encoding=null;if(options.encoding){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this.decoder=new StringDecoder(options.encoding);this.encoding=options.encoding}}
var Duplex;function Readable(options){Duplex=Duplex||require('./_stream_duplex');if(!(this instanceof Readable))return new Readable(options);this._readableState=new ReadableState(options,this);this.readable=!0;if(options&&typeof options.read==='function')this._read=options.read;Stream.call(this)}
Readable.prototype.push=function(chunk,encoding){var state=this._readableState;if(!state.objectMode&&typeof chunk==='string'){encoding=encoding||state.defaultEncoding;if(encoding!==state.encoding){chunk=new Buffer(chunk,encoding);encoding=''}}
return readableAddChunk(this,state,chunk,encoding,!1)};Readable.prototype.unshift=function(chunk){var state=this._readableState;return readableAddChunk(this,state,chunk,'',!0)};Readable.prototype.isPaused=function(){return this._readableState.flowing===!1};function readableAddChunk(stream,state,chunk,encoding,addToFront){var er=chunkInvalid(state,chunk);if(er){stream.emit('error',er)}else if(chunk===null){state.reading=!1;onEofChunk(stream,state)}else if(state.objectMode||chunk&&chunk.length>0){if(state.ended&&!addToFront){var e=new Error('stream.push() after EOF');stream.emit('error',e)}else if(state.endEmitted&&addToFront){var e=new Error('stream.unshift() after end event');stream.emit('error',e)}else{var skipAdd;if(state.decoder&&!addToFront&&!encoding){chunk=state.decoder.write(chunk);skipAdd=!state.objectMode&&chunk.length===0}
if(!addToFront)state.reading=!1;if(!skipAdd){if(state.flowing&&state.length===0&&!state.sync){stream.emit('data',chunk);stream.read(0)}else{state.length+=state.objectMode?1:chunk.length;if(addToFront)state.buffer.unshift(chunk);else state.buffer.push(chunk);if(state.needReadable)emitReadable(stream)}}
maybeReadMore(stream,state)}}else if(!addToFront){state.reading=!1}
return needMoreData(state)}
function needMoreData(state){return!state.ended&&(state.needReadable||state.length<state.highWaterMark||state.length===0)}
Readable.prototype.setEncoding=function(enc){if(!StringDecoder)StringDecoder=require('string_decoder/').StringDecoder;this._readableState.decoder=new StringDecoder(enc);this._readableState.encoding=enc;return this};var MAX_HWM=0x800000;function computeNewHighWaterMark(n){if(n>=MAX_HWM){n=MAX_HWM}else{n--;n|=n>>>1;n|=n>>>2;n|=n>>>4;n|=n>>>8;n|=n>>>16;n++}
return n}
function howMuchToRead(n,state){if(state.length===0&&state.ended)return 0;if(state.objectMode)return n===0?0:1;if(n===null||isNaN(n)){if(state.flowing&&state.buffer.length)return state.buffer[0].length;else return state.length}
if(n<=0)return 0;if(n>state.highWaterMark)state.highWaterMark=computeNewHighWaterMark(n);if(n>state.length){if(!state.ended){state.needReadable=!0;return 0}else{return state.length}}
return n}
Readable.prototype.read=function(n){debug('read',n);var state=this._readableState;var nOrig=n;if(typeof n!=='number'||n>0)state.emittedReadable=!1;if(n===0&&state.needReadable&&(state.length>=state.highWaterMark||state.ended)){debug('read: emitReadable',state.length,state.ended);if(state.length===0&&state.ended)endReadable(this);else emitReadable(this);return null}
n=howMuchToRead(n,state);if(n===0&&state.ended){if(state.length===0)endReadable(this);return null}
var doRead=state.needReadable;debug('need readable',doRead);if(state.length===0||state.length-n<state.highWaterMark){doRead=!0;debug('length less than watermark',doRead)}
if(state.ended||state.reading){doRead=!1;debug('reading or ended',doRead)}
if(doRead){debug('do read');state.reading=!0;state.sync=!0;if(state.length===0)state.needReadable=!0;this._read(state.highWaterMark);state.sync=!1}
if(doRead&&!state.reading)n=howMuchToRead(nOrig,state);var ret;if(n>0)ret=fromList(n,state);else ret=null;if(ret===null){state.needReadable=!0;n=0}
state.length-=n;if(state.length===0&&!state.ended)state.needReadable=!0;if(nOrig!==n&&state.ended&&state.length===0)endReadable(this);if(ret!==null)this.emit('data',ret);return ret};function chunkInvalid(state,chunk){var er=null;if(!Buffer.isBuffer(chunk)&&typeof chunk!=='string'&&chunk!==null&&chunk!==undefined&&!state.objectMode){er=new TypeError('Invalid non-string/buffer chunk')}
return er}
function onEofChunk(stream,state){if(state.ended)return;if(state.decoder){var chunk=state.decoder.end();if(chunk&&chunk.length){state.buffer.push(chunk);state.length+=state.objectMode?1:chunk.length}}
state.ended=!0;emitReadable(stream)}
function emitReadable(stream){var state=stream._readableState;state.needReadable=!1;if(!state.emittedReadable){debug('emitReadable',state.flowing);state.emittedReadable=!0;if(state.sync)processNextTick(emitReadable_,stream);else emitReadable_(stream)}}
function emitReadable_(stream){debug('emit readable');stream.emit('readable');flow(stream)}
function maybeReadMore(stream,state){if(!state.readingMore){state.readingMore=!0;processNextTick(maybeReadMore_,stream,state)}}
function maybeReadMore_(stream,state){var len=state.length;while(!state.reading&&!state.flowing&&!state.ended&&state.length<state.highWaterMark){debug('maybeReadMore read 0');stream.read(0);if(len===state.length)
break;else len=state.length}
state.readingMore=!1}
Readable.prototype._read=function(n){this.emit('error',new Error('not implemented'))};Readable.prototype.pipe=function(dest,pipeOpts){var src=this;var state=this._readableState;switch(state.pipesCount){case 0:state.pipes=dest;break;case 1:state.pipes=[state.pipes,dest];break;default:state.pipes.push(dest);break}
state.pipesCount+=1;debug('pipe count=%d opts=%j',state.pipesCount,pipeOpts);var doEnd=(!pipeOpts||pipeOpts.end!==!1)&&dest!==process.stdout&&dest!==process.stderr;var endFn=doEnd?onend:cleanup;if(state.endEmitted)processNextTick(endFn);else src.once('end',endFn);dest.on('unpipe',onunpipe);function onunpipe(readable){debug('onunpipe');if(readable===src){cleanup()}}
function onend(){debug('onend');dest.end()}
var ondrain=pipeOnDrain(src);dest.on('drain',ondrain);var cleanedUp=!1;function cleanup(){debug('cleanup');dest.removeListener('close',onclose);dest.removeListener('finish',onfinish);dest.removeListener('drain',ondrain);dest.removeListener('error',onerror);dest.removeListener('unpipe',onunpipe);src.removeListener('end',onend);src.removeListener('end',cleanup);src.removeListener('data',ondata);cleanedUp=!0;if(state.awaitDrain&&(!dest._writableState||dest._writableState.needDrain))ondrain()}
src.on('data',ondata);function ondata(chunk){debug('ondata');var ret=dest.write(chunk);if(!1===ret){if(state.pipesCount===1&&state.pipes[0]===dest&&src.listenerCount('data')===1&&!cleanedUp){debug('false write response, pause',src._readableState.awaitDrain);src._readableState.awaitDrain++}
src.pause()}}
function onerror(er){debug('onerror',er);unpipe();dest.removeListener('error',onerror);if(EElistenerCount(dest,'error')===0)dest.emit('error',er)}
if(!dest._events||!dest._events.error)dest.on('error',onerror);else if(isArray(dest._events.error))dest._events.error.unshift(onerror);else dest._events.error=[onerror,dest._events.error];function onclose(){dest.removeListener('finish',onfinish);unpipe()}
dest.once('close',onclose);function onfinish(){debug('onfinish');dest.removeListener('close',onclose);unpipe()}
dest.once('finish',onfinish);function unpipe(){debug('unpipe');src.unpipe(dest)}
dest.emit('pipe',src);if(!state.flowing){debug('pipe resume');src.resume()}
return dest};function pipeOnDrain(src){return function(){var state=src._readableState;debug('pipeOnDrain',state.awaitDrain);if(state.awaitDrain)state.awaitDrain--;if(state.awaitDrain===0&&EElistenerCount(src,'data')){state.flowing=!0;flow(src)}}}
Readable.prototype.unpipe=function(dest){var state=this._readableState;if(state.pipesCount===0)return this;if(state.pipesCount===1){if(dest&&dest!==state.pipes)return this;if(!dest)dest=state.pipes;state.pipes=null;state.pipesCount=0;state.flowing=!1;if(dest)dest.emit('unpipe',this);return this}
if(!dest){var dests=state.pipes;var len=state.pipesCount;state.pipes=null;state.pipesCount=0;state.flowing=!1;for(var _i=0;_i<len;_i++){dests[_i].emit('unpipe',this)}return this}
var i=indexOf(state.pipes,dest);if(i===-1)return this;state.pipes.splice(i,1);state.pipesCount-=1;if(state.pipesCount===1)state.pipes=state.pipes[0];dest.emit('unpipe',this);return this};Readable.prototype.on=function(ev,fn){var res=Stream.prototype.on.call(this,ev,fn);if(ev==='data'&&!1!==this._readableState.flowing){this.resume()}
if(ev==='readable'&&!this._readableState.endEmitted){var state=this._readableState;if(!state.readableListening){state.readableListening=!0;state.emittedReadable=!1;state.needReadable=!0;if(!state.reading){processNextTick(nReadingNextTick,this)}else if(state.length){emitReadable(this,state)}}}
return res};Readable.prototype.addListener=Readable.prototype.on;function nReadingNextTick(self){debug('readable nexttick read 0');self.read(0)}
Readable.prototype.resume=function(){var state=this._readableState;if(!state.flowing){debug('resume');state.flowing=!0;resume(this,state)}
return this};function resume(stream,state){if(!state.resumeScheduled){state.resumeScheduled=!0;processNextTick(resume_,stream,state)}}
function resume_(stream,state){if(!state.reading){debug('resume read 0');stream.read(0)}
state.resumeScheduled=!1;stream.emit('resume');flow(stream);if(state.flowing&&!state.reading)stream.read(0)}
Readable.prototype.pause=function(){debug('call pause flowing=%j',this._readableState.flowing);if(!1!==this._readableState.flowing){debug('pause');this._readableState.flowing=!1;this.emit('pause')}
return this};function flow(stream){var state=stream._readableState;debug('flow',state.flowing);if(state.flowing){do{var chunk=stream.read()}while(null!==chunk&&state.flowing);}}
Readable.prototype.wrap=function(stream){var state=this._readableState;var paused=!1;var self=this;stream.on('end',function(){debug('wrapped end');if(state.decoder&&!state.ended){var chunk=state.decoder.end();if(chunk&&chunk.length)self.push(chunk)}
self.push(null)});stream.on('data',function(chunk){debug('wrapped data');if(state.decoder)chunk=state.decoder.write(chunk);if(state.objectMode&&(chunk===null||chunk===undefined))return;else if(!state.objectMode&&(!chunk||!chunk.length))return;var ret=self.push(chunk);if(!ret){paused=!0;stream.pause()}});for(var i in stream){if(this[i]===undefined&&typeof stream[i]==='function'){this[i]=function(method){return function(){return stream[method].apply(stream,arguments)}}(i)}}
var events=['error','close','destroy','pause','resume'];forEach(events,function(ev){stream.on(ev,self.emit.bind(self,ev))});self._read=function(n){debug('wrapped _read',n);if(paused){paused=!1;stream.resume()}};return self};Readable._fromList=fromList;function fromList(n,state){var list=state.buffer;var length=state.length;var stringMode=!!state.decoder;var objectMode=!!state.objectMode;var ret;if(list.length===0)return null;if(length===0)ret=null;else if(objectMode)ret=list.shift();else if(!n||n>=length){if(stringMode)ret=list.join('');else if(list.length===1)ret=list[0];else ret=Buffer.concat(list,length);list.length=0}else{if(n<list[0].length){var buf=list[0];ret=buf.slice(0,n);list[0]=buf.slice(n)}else if(n===list[0].length){ret=list.shift()}else{if(stringMode)ret='';else ret=new Buffer(n);var c=0;for(var i=0,l=list.length;i<l&&c<n;i++){var buf=list[0];var cpy=Math.min(n-c,buf.length);if(stringMode)ret+=buf.slice(0,cpy);else buf.copy(ret,c,0,cpy);if(cpy<buf.length)list[0]=buf.slice(cpy);else list.shift();c+=cpy}}}
return ret}
function endReadable(stream){var state=stream._readableState;if(state.length>0)throw new Error('endReadable called on non-empty stream');if(!state.endEmitted){state.ended=!0;processNextTick(endReadableNT,state,stream)}}
function endReadableNT(state,stream){if(!state.endEmitted&&state.length===0){state.endEmitted=!0;stream.readable=!1;stream.emit('end')}}
function forEach(xs,f){for(var i=0,l=xs.length;i<l;i++){f(xs[i],i)}}
function indexOf(xs,x){for(var i=0,l=xs.length;i<l;i++){if(xs[i]===x)return i}
return-1}}).call(this,require('_process'))},{"./_stream_duplex":93,"_process":91,"buffer":4,"core-util-is":26,"events":32,"inherits":35,"isarray":37,"process-nextick-args":90,"string_decoder/":103,"util":3}],96:[function(require,module,exports){'use strict';module.exports=Transform;var Duplex=require('./_stream_duplex');var util=require('core-util-is');util.inherits=require('inherits');util.inherits(Transform,Duplex);function TransformState(stream){this.afterTransform=function(er,data){return afterTransform(stream,er,data)};this.needTransform=!1;this.transforming=!1;this.writecb=null;this.writechunk=null;this.writeencoding=null}
function afterTransform(stream,er,data){var ts=stream._transformState;ts.transforming=!1;var cb=ts.writecb;if(!cb)return stream.emit('error',new Error('no writecb in Transform class'));ts.writechunk=null;ts.writecb=null;if(data!==null&&data!==undefined)stream.push(data);cb(er);var rs=stream._readableState;rs.reading=!1;if(rs.needReadable||rs.length<rs.highWaterMark){stream._read(rs.highWaterMark)}}
function Transform(options){if(!(this instanceof Transform))return new Transform(options);Duplex.call(this,options);this._transformState=new TransformState(this);var stream=this;this._readableState.needReadable=!0;this._readableState.sync=!1;if(options){if(typeof options.transform==='function')this._transform=options.transform;if(typeof options.flush==='function')this._flush=options.flush}
this.once('prefinish',function(){if(typeof this._flush==='function')this._flush(function(er){done(stream,er)});else done(stream)})}
Transform.prototype.push=function(chunk,encoding){this._transformState.needTransform=!1;return Duplex.prototype.push.call(this,chunk,encoding)};Transform.prototype._transform=function(chunk,encoding,cb){throw new Error('not implemented')};Transform.prototype._write=function(chunk,encoding,cb){var ts=this._transformState;ts.writecb=cb;ts.writechunk=chunk;ts.writeencoding=encoding;if(!ts.transforming){var rs=this._readableState;if(ts.needTransform||rs.needReadable||rs.length<rs.highWaterMark)this._read(rs.highWaterMark)}};Transform.prototype._read=function(n){var ts=this._transformState;if(ts.writechunk!==null&&ts.writecb&&!ts.transforming){ts.transforming=!0;this._transform(ts.writechunk,ts.writeencoding,ts.afterTransform)}else{ts.needTransform=!0}};function done(stream,er){if(er)return stream.emit('error',er);var ws=stream._writableState;var ts=stream._transformState;if(ws.length)throw new Error('calling transform done when ws.length != 0');if(ts.transforming)throw new Error('calling transform done when still transforming');return stream.push(null)}},{"./_stream_duplex":93,"core-util-is":26,"inherits":35}],97:[function(require,module,exports){(function(process){'use strict';module.exports=Writable;var processNextTick=require('process-nextick-args');var asyncWrite=!process.browser&&['v0.10','v0.9.'].indexOf(process.version.slice(0,5))>-1?setImmediate:processNextTick;var Buffer=require('buffer').Buffer;Writable.WritableState=WritableState;var util=require('core-util-is');util.inherits=require('inherits');var internalUtil={deprecate:require('util-deprecate')};var Stream;(function(){try{Stream=require('st'+'ream')}catch(_){}finally{if(!Stream)Stream=require('events').EventEmitter}})();var Buffer=require('buffer').Buffer;util.inherits(Writable,Stream);function nop(){}
function WriteReq(chunk,encoding,cb){this.chunk=chunk;this.encoding=encoding;this.callback=cb;this.next=null}
var Duplex;function WritableState(options,stream){Duplex=Duplex||require('./_stream_duplex');options=options||{};this.objectMode=!!options.objectMode;if(stream instanceof Duplex)this.objectMode=this.objectMode||!!options.writableObjectMode;var hwm=options.highWaterMark;var defaultHwm=this.objectMode?16:16*1024;this.highWaterMark=hwm||hwm===0?hwm:defaultHwm;this.highWaterMark=~~this.highWaterMark;this.needDrain=!1;this.ending=!1;this.ended=!1;this.finished=!1;var noDecode=options.decodeStrings===!1;this.decodeStrings=!noDecode;this.defaultEncoding=options.defaultEncoding||'utf8';this.length=0;this.writing=!1;this.corked=0;this.sync=!0;this.bufferProcessing=!1;this.onwrite=function(er){onwrite(stream,er)};this.writecb=null;this.writelen=0;this.bufferedRequest=null;this.lastBufferedRequest=null;this.pendingcb=0;this.prefinished=!1;this.errorEmitted=!1;this.bufferedRequestCount=0;this.corkedRequestsFree=new CorkedRequest(this);this.corkedRequestsFree.next=new CorkedRequest(this)}
WritableState.prototype.getBuffer=function writableStateGetBuffer(){var current=this.bufferedRequest;var out=[];while(current){out.push(current);current=current.next}
return out};(function(){try{Object.defineProperty(WritableState.prototype,'buffer',{get:internalUtil.deprecate(function(){return this.getBuffer()},'_writableState.buffer is deprecated. Use _writableState.getBuffer '+'instead.')})}catch(_){}})();var Duplex;function Writable(options){Duplex=Duplex||require('./_stream_duplex');if(!(this instanceof Writable)&&!(this instanceof Duplex))return new Writable(options);this._writableState=new WritableState(options,this);this.writable=!0;if(options){if(typeof options.write==='function')this._write=options.write;if(typeof options.writev==='function')this._writev=options.writev}
Stream.call(this)}
Writable.prototype.pipe=function(){this.emit('error',new Error('Cannot pipe. Not readable.'))};function writeAfterEnd(stream,cb){var er=new Error('write after end');stream.emit('error',er);processNextTick(cb,er)}
function validChunk(stream,state,chunk,cb){var valid=!0;if(!Buffer.isBuffer(chunk)&&typeof chunk!=='string'&&chunk!==null&&chunk!==undefined&&!state.objectMode){var er=new TypeError('Invalid non-string/buffer chunk');stream.emit('error',er);processNextTick(cb,er);valid=!1}
return valid}
Writable.prototype.write=function(chunk,encoding,cb){var state=this._writableState;var ret=!1;if(typeof encoding==='function'){cb=encoding;encoding=null}
if(Buffer.isBuffer(chunk))encoding='buffer';else if(!encoding)encoding=state.defaultEncoding;if(typeof cb!=='function')cb=nop;if(state.ended)writeAfterEnd(this,cb);else if(validChunk(this,state,chunk,cb)){state.pendingcb++;ret=writeOrBuffer(this,state,chunk,encoding,cb)}
return ret};Writable.prototype.cork=function(){var state=this._writableState;state.corked++};Writable.prototype.uncork=function(){var state=this._writableState;if(state.corked){state.corked--;if(!state.writing&&!state.corked&&!state.finished&&!state.bufferProcessing&&state.bufferedRequest)clearBuffer(this,state)}};Writable.prototype.setDefaultEncoding=function setDefaultEncoding(encoding){if(typeof encoding==='string')encoding=encoding.toLowerCase();if(!(['hex','utf8','utf-8','ascii','binary','base64','ucs2','ucs-2','utf16le','utf-16le','raw'].indexOf((encoding+'').toLowerCase())>-1))throw new TypeError('Unknown encoding: '+encoding);this._writableState.defaultEncoding=encoding};function decodeChunk(state,chunk,encoding){if(!state.objectMode&&state.decodeStrings!==!1&&typeof chunk==='string'){chunk=new Buffer(chunk,encoding)}
return chunk}
function writeOrBuffer(stream,state,chunk,encoding,cb){chunk=decodeChunk(state,chunk,encoding);if(Buffer.isBuffer(chunk))encoding='buffer';var len=state.objectMode?1:chunk.length;state.length+=len;var ret=state.length<state.highWaterMark;if(!ret)state.needDrain=!0;if(state.writing||state.corked){var last=state.lastBufferedRequest;state.lastBufferedRequest=new WriteReq(chunk,encoding,cb);if(last){last.next=state.lastBufferedRequest}else{state.bufferedRequest=state.lastBufferedRequest}
state.bufferedRequestCount+=1}else{doWrite(stream,state,!1,len,chunk,encoding,cb)}
return ret}
function doWrite(stream,state,writev,len,chunk,encoding,cb){state.writelen=len;state.writecb=cb;state.writing=!0;state.sync=!0;if(writev)stream._writev(chunk,state.onwrite);else stream._write(chunk,encoding,state.onwrite);state.sync=!1}
function onwriteError(stream,state,sync,er,cb){--state.pendingcb;if(sync)processNextTick(cb,er);else cb(er);stream._writableState.errorEmitted=!0;stream.emit('error',er)}
function onwriteStateUpdate(state){state.writing=!1;state.writecb=null;state.length-=state.writelen;state.writelen=0}
function onwrite(stream,er){var state=stream._writableState;var sync=state.sync;var cb=state.writecb;onwriteStateUpdate(state);if(er)onwriteError(stream,state,sync,er,cb);else{var finished=needFinish(state);if(!finished&&!state.corked&&!state.bufferProcessing&&state.bufferedRequest){clearBuffer(stream,state)}
if(sync){asyncWrite(afterWrite,stream,state,finished,cb)}else{afterWrite(stream,state,finished,cb)}}}
function afterWrite(stream,state,finished,cb){if(!finished)onwriteDrain(stream,state);state.pendingcb--;cb();finishMaybe(stream,state)}
function onwriteDrain(stream,state){if(state.length===0&&state.needDrain){state.needDrain=!1;stream.emit('drain')}}
function clearBuffer(stream,state){state.bufferProcessing=!0;var entry=state.bufferedRequest;if(stream._writev&&entry&&entry.next){var l=state.bufferedRequestCount;var buffer=new Array(l);var holder=state.corkedRequestsFree;holder.entry=entry;var count=0;while(entry){buffer[count]=entry;entry=entry.next;count+=1}
doWrite(stream,state,!0,state.length,buffer,'',holder.finish);state.pendingcb++;state.lastBufferedRequest=null;state.corkedRequestsFree=holder.next;holder.next=null}else{while(entry){var chunk=entry.chunk;var encoding=entry.encoding;var cb=entry.callback;var len=state.objectMode?1:chunk.length;doWrite(stream,state,!1,len,chunk,encoding,cb);entry=entry.next;if(state.writing){break}}
if(entry===null)state.lastBufferedRequest=null}
state.bufferedRequestCount=0;state.bufferedRequest=entry;state.bufferProcessing=!1}
Writable.prototype._write=function(chunk,encoding,cb){cb(new Error('not implemented'))};Writable.prototype._writev=null;Writable.prototype.end=function(chunk,encoding,cb){var state=this._writableState;if(typeof chunk==='function'){cb=chunk;chunk=null;encoding=null}else if(typeof encoding==='function'){cb=encoding;encoding=null}
if(chunk!==null&&chunk!==undefined)this.write(chunk,encoding);if(state.corked){state.corked=1;this.uncork()}
if(!state.ending&&!state.finished)endWritable(this,state,cb)};function needFinish(state){return state.ending&&state.length===0&&state.bufferedRequest===null&&!state.finished&&!state.writing}
function prefinish(stream,state){if(!state.prefinished){state.prefinished=!0;stream.emit('prefinish')}}
function finishMaybe(stream,state){var need=needFinish(state);if(need){if(state.pendingcb===0){prefinish(stream,state);state.finished=!0;stream.emit('finish')}else{prefinish(stream,state)}}
return need}
function endWritable(stream,state,cb){state.ending=!0;finishMaybe(stream,state);if(cb){if(state.finished)processNextTick(cb);else stream.once('finish',cb)}
state.ended=!0;stream.writable=!1}
function CorkedRequest(state){var _this=this;this.next=null;this.entry=null;this.finish=function(err){var entry=_this.entry;_this.entry=null;while(entry){var cb=entry.callback;state.pendingcb--;cb(err);entry=entry.next}
if(state.corkedRequestsFree){state.corkedRequestsFree.next=_this}else{state.corkedRequestsFree=_this}}}}).call(this,require('_process'))},{"./_stream_duplex":93,"_process":91,"buffer":4,"core-util-is":26,"events":32,"inherits":35,"process-nextick-args":90,"util-deprecate":104}],98:[function(require,module,exports){module.exports=require("./lib/_stream_passthrough.js")},{"./lib/_stream_passthrough.js":94}],99:[function(require,module,exports){var Stream=(function(){try{return require('st'+'ream')}catch(_){}}());exports=module.exports=require('./lib/_stream_readable.js');exports.Stream=Stream||exports;exports.Readable=exports;exports.Writable=require('./lib/_stream_writable.js');exports.Duplex=require('./lib/_stream_duplex.js');exports.Transform=require('./lib/_stream_transform.js');exports.PassThrough=require('./lib/_stream_passthrough.js')},{"./lib/_stream_duplex.js":93,"./lib/_stream_passthrough.js":94,"./lib/_stream_readable.js":95,"./lib/_stream_transform.js":96,"./lib/_stream_writable.js":97}],100:[function(require,module,exports){module.exports=require("./lib/_stream_transform.js")},{"./lib/_stream_transform.js":96}],101:[function(require,module,exports){module.exports=require("./lib/_stream_writable.js")},{"./lib/_stream_writable.js":97}],102:[function(require,module,exports){module.exports=Stream;var EE=require('events').EventEmitter;var inherits=require('inherits');inherits(Stream,EE);Stream.Readable=require('readable-stream/readable.js');Stream.Writable=require('readable-stream/writable.js');Stream.Duplex=require('readable-stream/duplex.js');Stream.Transform=require('readable-stream/transform.js');Stream.PassThrough=require('readable-stream/passthrough.js');Stream.Stream=Stream;function Stream(){EE.call(this)}
Stream.prototype.pipe=function(dest,options){var source=this;function ondata(chunk){if(dest.writable){if(!1===dest.write(chunk)&&source.pause){source.pause()}}}
source.on('data',ondata);function ondrain(){if(source.readable&&source.resume){source.resume()}}
dest.on('drain',ondrain);if(!dest._isStdio&&(!options||options.end!==!1)){source.on('end',onend);source.on('close',onclose)}
var didOnEnd=!1;function onend(){if(didOnEnd)return;didOnEnd=!0;dest.end()}
function onclose(){if(didOnEnd)return;didOnEnd=!0;if(typeof dest.destroy==='function')dest.destroy()}
function onerror(er){cleanup();if(EE.listenerCount(this,'error')===0){throw er}}
source.on('error',onerror);dest.on('error',onerror);function cleanup(){source.removeListener('data',ondata);dest.removeListener('drain',ondrain);source.removeListener('end',onend);source.removeListener('close',onclose);source.removeListener('error',onerror);dest.removeListener('error',onerror);source.removeListener('end',cleanup);source.removeListener('close',cleanup);dest.removeListener('close',cleanup)}
source.on('end',cleanup);source.on('close',cleanup);dest.on('close',cleanup);dest.emit('pipe',source);return dest}},{"events":32,"inherits":35,"readable-stream/duplex.js":92,"readable-stream/passthrough.js":98,"readable-stream/readable.js":99,"readable-stream/transform.js":100,"readable-stream/writable.js":101}],103:[function(require,module,exports){var Buffer=require('buffer').Buffer;var isBufferEncoding=Buffer.isEncoding||function(encoding){switch(encoding&&encoding.toLowerCase()){case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':return!0;default:return!1}}
function assertEncoding(encoding){if(encoding&&!isBufferEncoding(encoding)){throw new Error('Unknown encoding: '+encoding)}}
var StringDecoder=exports.StringDecoder=function(encoding){this.encoding=(encoding||'utf8').toLowerCase().replace(/[-_]/,'');assertEncoding(encoding);switch(this.encoding){case 'utf8':this.surrogateSize=3;break;case 'ucs2':case 'utf16le':this.surrogateSize=2;this.detectIncompleteChar=utf16DetectIncompleteChar;break;case 'base64':this.surrogateSize=3;this.detectIncompleteChar=base64DetectIncompleteChar;break;default:this.write=passThroughWrite;return}
this.charBuffer=new Buffer(6);this.charReceived=0;this.charLength=0};StringDecoder.prototype.write=function(buffer){var charStr='';while(this.charLength){var available=(buffer.length>=this.charLength-this.charReceived)?this.charLength-this.charReceived:buffer.length;buffer.copy(this.charBuffer,this.charReceived,0,available);this.charReceived+=available;if(this.charReceived<this.charLength){return''}
buffer=buffer.slice(available,buffer.length);charStr=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var charCode=charStr.charCodeAt(charStr.length-1);if(charCode>=0xD800&&charCode<=0xDBFF){this.charLength+=this.surrogateSize;charStr='';continue}
this.charReceived=this.charLength=0;if(buffer.length===0){return charStr}
break}
this.detectIncompleteChar(buffer);var end=buffer.length;if(this.charLength){buffer.copy(this.charBuffer,0,buffer.length-this.charReceived,end);end-=this.charReceived}
charStr+=buffer.toString(this.encoding,0,end);var end=charStr.length-1;var charCode=charStr.charCodeAt(end);if(charCode>=0xD800&&charCode<=0xDBFF){var size=this.surrogateSize;this.charLength+=size;this.charReceived+=size;this.charBuffer.copy(this.charBuffer,size,0,size);buffer.copy(this.charBuffer,0,0,size);return charStr.substring(0,end)}
return charStr};StringDecoder.prototype.detectIncompleteChar=function(buffer){var i=(buffer.length>=3)?3:buffer.length;for(;i>0;i--){var c=buffer[buffer.length-i];if(i==1&&c>>5==0x06){this.charLength=2;break}
if(i<=2&&c>>4==0x0E){this.charLength=3;break}
if(i<=3&&c>>3==0x1E){this.charLength=4;break}}
this.charReceived=i};StringDecoder.prototype.end=function(buffer){var res='';if(buffer&&buffer.length)
res=this.write(buffer);if(this.charReceived){var cr=this.charReceived;var buf=this.charBuffer;var enc=this.encoding;res+=buf.slice(0,cr).toString(enc)}
return res};function passThroughWrite(buffer){return buffer.toString(this.encoding)}
function utf16DetectIncompleteChar(buffer){this.charReceived=buffer.length%2;this.charLength=this.charReceived?2:0}
function base64DetectIncompleteChar(buffer){this.charReceived=buffer.length%3;this.charLength=this.charReceived?3:0}},{"buffer":4}],104:[function(require,module,exports){(function(global){module.exports=deprecate;function deprecate(fn,msg){if(config('noDeprecation')){return fn}
var warned=!1;function deprecated(){if(!warned){if(config('throwDeprecation')){throw new Error(msg)}else if(config('traceDeprecation')){console.trace(msg)}else{console.warn(msg)}
warned=!0}
return fn.apply(this,arguments)}
return deprecated}
function config(name){try{if(!global.localStorage)return!1}catch(_){return!1}
var val=global.localStorage[name];if(null==val)return!1;return String(val).toLowerCase()==='true'}}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],105:[function(require,module,exports){arguments[4][35][0].apply(exports,arguments)},{"dup":35}],106:[function(require,module,exports){module.exports=function isBuffer(arg){return arg&&typeof arg==='object'&&typeof arg.copy==='function'&&typeof arg.fill==='function'&&typeof arg.readUInt8==='function'}},{}],107:[function(require,module,exports){(function(process,global){var formatRegExp=/%[sdj%]/g;exports.format=function(f){if(!isString(f)){var objects=[];for(var i=0;i<arguments.length;i++){objects.push(inspect(arguments[i]))}
return objects.join(' ')}
var i=1;var args=arguments;var len=args.length;var str=String(f).replace(formatRegExp,function(x){if(x==='%%')return'%';if(i>=len)return x;switch(x){case '%s':return String(args[i++]);case '%d':return Number(args[i++]);case '%j':try{return JSON.stringify(args[i++])}catch(_){return'[Circular]'}
default:return x}});for(var x=args[i];i<len;x=args[++i]){if(isNull(x)||!isObject(x)){str+=' '+x}else{str+=' '+inspect(x)}}
return str};exports.deprecate=function(fn,msg){if(isUndefined(global.process)){return function(){return exports.deprecate(fn,msg).apply(this,arguments)}}
if(process.noDeprecation===!0){return fn}
var warned=!1;function deprecated(){if(!warned){if(process.throwDeprecation){throw new Error(msg)}else if(process.traceDeprecation){console.trace(msg)}else{console.error(msg)}
warned=!0}
return fn.apply(this,arguments)}
return deprecated};var debugs={};var debugEnviron;exports.debuglog=function(set){if(isUndefined(debugEnviron))
debugEnviron=process.env.NODE_DEBUG||'';set=set.toUpperCase();if(!debugs[set]){if(new RegExp('\\b'+set+'\\b','i').test(debugEnviron)){var pid=process.pid;debugs[set]=function(){var msg=exports.format.apply(exports,arguments);console.error('%s %d: %s',set,pid,msg)}}else{debugs[set]=function(){}}}
return debugs[set]};function inspect(obj,opts){var ctx={seen:[],stylize:stylizeNoColor};if(arguments.length>=3)ctx.depth=arguments[2];if(arguments.length>=4)ctx.colors=arguments[3];if(isBoolean(opts)){ctx.showHidden=opts}else if(opts){exports._extend(ctx,opts)}
if(isUndefined(ctx.showHidden))ctx.showHidden=!1;if(isUndefined(ctx.depth))ctx.depth=2;if(isUndefined(ctx.colors))ctx.colors=!1;if(isUndefined(ctx.customInspect))ctx.customInspect=!0;if(ctx.colors)ctx.stylize=stylizeWithColor;return formatValue(ctx,obj,ctx.depth)}
exports.inspect=inspect;inspect.colors={'bold':[1,22],'italic':[3,23],'underline':[4,24],'inverse':[7,27],'white':[37,39],'grey':[90,39],'black':[30,39],'blue':[34,39],'cyan':[36,39],'green':[32,39],'magenta':[35,39],'red':[31,39],'yellow':[33,39]};inspect.styles={'special':'cyan','number':'yellow','boolean':'yellow','undefined':'grey','null':'bold','string':'green','date':'magenta','regexp':'red'};function stylizeWithColor(str,styleType){var style=inspect.styles[styleType];if(style){return'\u001b['+inspect.colors[style][0]+'m'+str+'\u001b['+inspect.colors[style][1]+'m'}else{return str}}
function stylizeNoColor(str,styleType){return str}
function arrayToHash(array){var hash={};array.forEach(function(val,idx){hash[val]=!0});return hash}
function formatValue(ctx,value,recurseTimes){if(ctx.customInspect&&value&&isFunction(value.inspect)&&value.inspect!==exports.inspect&&!(value.constructor&&value.constructor.prototype===value)){var ret=value.inspect(recurseTimes,ctx);if(!isString(ret)){ret=formatValue(ctx,ret,recurseTimes)}
return ret}
var primitive=formatPrimitive(ctx,value);if(primitive){return primitive}
var keys=Object.keys(value);var visibleKeys=arrayToHash(keys);if(ctx.showHidden){keys=Object.getOwnPropertyNames(value)}
if(isError(value)&&(keys.indexOf('message')>=0||keys.indexOf('description')>=0)){return formatError(value)}
if(keys.length===0){if(isFunction(value)){var name=value.name?': '+value.name:'';return ctx.stylize('[Function'+name+']','special')}
if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp')}
if(isDate(value)){return ctx.stylize(Date.prototype.toString.call(value),'date')}
if(isError(value)){return formatError(value)}}
var base='',array=!1,braces=['{','}'];if(isArray(value)){array=!0;braces=['[',']']}
if(isFunction(value)){var n=value.name?': '+value.name:'';base=' [Function'+n+']'}
if(isRegExp(value)){base=' '+RegExp.prototype.toString.call(value)}
if(isDate(value)){base=' '+Date.prototype.toUTCString.call(value)}
if(isError(value)){base=' '+formatError(value)}
if(keys.length===0&&(!array||value.length==0)){return braces[0]+base+braces[1]}
if(recurseTimes<0){if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp')}else{return ctx.stylize('[Object]','special')}}
ctx.seen.push(value);var output;if(array){output=formatArray(ctx,value,recurseTimes,visibleKeys,keys)}else{output=keys.map(function(key){return formatProperty(ctx,value,recurseTimes,visibleKeys,key,array)})}
ctx.seen.pop();return reduceToSingleString(output,base,braces)}
function formatPrimitive(ctx,value){if(isUndefined(value))
return ctx.stylize('undefined','undefined');if(isString(value)){var simple='\''+JSON.stringify(value).replace(/^"|"$/g,'').replace(/'/g,"\\'").replace(/\\"/g,'"')+'\'';return ctx.stylize(simple,'string')}
if(isNumber(value))
return ctx.stylize(''+value,'number');if(isBoolean(value))
return ctx.stylize(''+value,'boolean');if(isNull(value))
return ctx.stylize('null','null')}
function formatError(value){return'['+Error.prototype.toString.call(value)+']'}
function formatArray(ctx,value,recurseTimes,visibleKeys,keys){var output=[];for(var i=0,l=value.length;i<l;++i){if(hasOwnProperty(value,String(i))){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,String(i),!0))}else{output.push('')}}
keys.forEach(function(key){if(!key.match(/^\d+$/)){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,key,!0))}});return output}
function formatProperty(ctx,value,recurseTimes,visibleKeys,key,array){var name,str,desc;desc=Object.getOwnPropertyDescriptor(value,key)||{value:value[key]};if(desc.get){if(desc.set){str=ctx.stylize('[Getter/Setter]','special')}else{str=ctx.stylize('[Getter]','special')}}else{if(desc.set){str=ctx.stylize('[Setter]','special')}}
if(!hasOwnProperty(visibleKeys,key)){name='['+key+']'}
if(!str){if(ctx.seen.indexOf(desc.value)<0){if(isNull(recurseTimes)){str=formatValue(ctx,desc.value,null)}else{str=formatValue(ctx,desc.value,recurseTimes-1)}
if(str.indexOf('\n')>-1){if(array){str=str.split('\n').map(function(line){return'  '+line}).join('\n').substr(2)}else{str='\n'+str.split('\n').map(function(line){return'   '+line}).join('\n')}}}else{str=ctx.stylize('[Circular]','special')}}
if(isUndefined(name)){if(array&&key.match(/^\d+$/)){return str}
name=JSON.stringify(''+key);if(name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){name=name.substr(1,name.length-2);name=ctx.stylize(name,'name')}else{name=name.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");name=ctx.stylize(name,'string')}}
return name+': '+str}
function reduceToSingleString(output,base,braces){var numLinesEst=0;var length=output.reduce(function(prev,cur){numLinesEst++;if(cur.indexOf('\n')>=0)numLinesEst++;return prev+cur.replace(/\u001b\[\d\d?m/g,'').length+1},0);if(length>60){return braces[0]+(base===''?'':base+'\n ')+' '+output.join(',\n  ')+' '+braces[1]}
return braces[0]+base+' '+output.join(', ')+' '+braces[1]}
function isArray(ar){return Array.isArray(ar)}
exports.isArray=isArray;function isBoolean(arg){return typeof arg==='boolean'}
exports.isBoolean=isBoolean;function isNull(arg){return arg===null}
exports.isNull=isNull;function isNullOrUndefined(arg){return arg==null}
exports.isNullOrUndefined=isNullOrUndefined;function isNumber(arg){return typeof arg==='number'}
exports.isNumber=isNumber;function isString(arg){return typeof arg==='string'}
exports.isString=isString;function isSymbol(arg){return typeof arg==='symbol'}
exports.isSymbol=isSymbol;function isUndefined(arg){return arg===void 0}
exports.isUndefined=isUndefined;function isRegExp(re){return isObject(re)&&objectToString(re)==='[object RegExp]'}
exports.isRegExp=isRegExp;function isObject(arg){return typeof arg==='object'&&arg!==null}
exports.isObject=isObject;function isDate(d){return isObject(d)&&objectToString(d)==='[object Date]'}
exports.isDate=isDate;function isError(e){return isObject(e)&&(objectToString(e)==='[object Error]'||e instanceof Error)}
exports.isError=isError;function isFunction(arg){return typeof arg==='function'}
exports.isFunction=isFunction;function isPrimitive(arg){return arg===null||typeof arg==='boolean'||typeof arg==='number'||typeof arg==='string'||typeof arg==='symbol'||typeof arg==='undefined'}
exports.isPrimitive=isPrimitive;exports.isBuffer=require('./support/isBuffer');function objectToString(o){return Object.prototype.toString.call(o)}
function pad(n){return n<10?'0'+n.toString(10):n.toString(10)}
var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];function timestamp(){var d=new Date();var time=[pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join(':');return[d.getDate(),months[d.getMonth()],time].join(' ')}
exports.log=function(){console.log('%s - %s',timestamp(),exports.format.apply(exports,arguments))};exports.inherits=require('inherits');exports._extend=function(origin,add){if(!add||!isObject(add))return origin;var keys=Object.keys(add);var i=keys.length;while(i--){origin[keys[i]]=add[keys[i]]}
return origin};function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop)}}).call(this,require('_process'),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./support/isBuffer":106,"_process":91,"inherits":105}],108:[function(require,module,exports){var zip=require('./zip');module.exports=function(gj,options){zip(gj,options).then(function(content){location.href='data:application/zip;base64,'+content})}},{"./zip":117}],109:[function(require,module,exports){module.exports.enlarge=function enlargeExtent(extent,pt){if(pt[0]<extent.xmin)extent.xmin=pt[0];if(pt[0]>extent.xmax)extent.xmax=pt[0];if(pt[1]<extent.ymin)extent.ymin=pt[1];if(pt[1]>extent.ymax)extent.ymax=pt[1];return extent};module.exports.enlargeExtent=function enlargeExtent(extent,ext){if(ext.xmax>extent.xmax)extent.xmax=ext.xmax;if(ext.xmin<extent.xmin)extent.xmin=ext.xmin;if(ext.ymax>extent.ymax)extent.ymax=ext.ymax;if(ext.ymin<extent.ymin)extent.ymin=ext.ymin;return extent};module.exports.blank=function(){return{xmin:Number.MAX_VALUE,ymin:Number.MAX_VALUE,xmax:-Number.MAX_VALUE,ymax:-Number.MAX_VALUE}}},{}],110:[function(require,module,exports){var types=require('./types').jstypes;module.exports.geojson=geojson;module.exports.obj=obj;function geojson(features){var fields={};features.forEach(collect);function collect(f){inherit(fields,f.properties)}
return obj(fields)}
function inherit(a,b){for(var i in b){a[i]=b[i]}
return a}
function obj(_){var fields={},o=[];for(var p in _)fields[p]=typeof _[p];for(var n in fields){o.push({name:n,type:types[fields[n]]})}
return o}},{"./types":115}],111:[function(require,module,exports){module.exports.point=justType('Point','POINT');module.exports.line=justType('LineString','POLYLINE');module.exports.polygon=justType('Polygon','POLYGON');function justType(type,TYPE){return function(gj){var oftype=gj.features.filter(isType(type));return{geometries:oftype.map(justCoords),properties:oftype.map(justProps),type:TYPE}}}
function justCoords(t){return t.geometry.coordinates}
function justProps(t){return t.properties}
function isType(t){return function(f){return f.geometry.type.replace('Multi','')===t}}},{}],112:[function(require,module,exports){var ext=require('./extent');module.exports.write=function writePoints(coordinates,extent,shpView,shxView){var contentLength=28,fileLength=100,shpI=0,shxI=0;coordinates.forEach(function writePoint(coords,i){shpView.setInt32(shpI,i);shpView.setInt32(shpI+4,10);shpView.setInt32(shpI+8,1,!0);shpView.setFloat64(shpI+12,coords[0],!0);shpView.setFloat64(shpI+20,coords[1],!0);shxView.setInt32(shxI,fileLength/2);shxView.setInt32(shxI+4,10);shxI+=8;shpI+=contentLength;fileLength+=contentLength})};module.exports.extent=function(coordinates){return coordinates.reduce(function(extent,coords){return ext.enlarge(extent,coords)},ext.blank())};module.exports.parts=function parts(geometries,TYPE){return geometries.length};module.exports.shxLength=function(coordinates){return coordinates.length*8};module.exports.shpLength=function(coordinates){return coordinates.length*28}},{"./extent":109}],113:[function(require,module,exports){var ext=require('./extent'),types=require('./types');module.exports.write=function writePoints(geometries,extent,shpView,shxView,TYPE){var shpI=0,shxI=0,shxOffset=100;geometries.forEach(writePolyLine);function writePolyLine(coordinates,i){var flattened=justCoords(coordinates),noParts=parts([coordinates],TYPE),contentLength=(flattened.length*16)+48+(noParts-1)*4;var featureExtent=flattened.reduce(function(extent,c){return ext.enlarge(extent,c)},ext.blank());shxView.setInt32(shxI,shxOffset/2);shxView.setInt32(shxI+4,contentLength/2);shxI+=8;shxOffset+=contentLength+8;shpView.setInt32(shpI,i+1);shpView.setInt32(shpI+4,contentLength/2);shpView.setInt32(shpI+8,TYPE,!0);shpView.setFloat64(shpI+12,featureExtent.xmin,!0);shpView.setFloat64(shpI+20,featureExtent.ymin,!0);shpView.setFloat64(shpI+28,featureExtent.xmax,!0);shpView.setFloat64(shpI+36,featureExtent.ymax,!0);shpView.setInt32(shpI+44,noParts,!0);shpView.setInt32(shpI+48,flattened.length,!0);shpView.setInt32(shpI+52,0,!0);var onlyParts=coordinates.reduce(function(arr,coords){if(Array.isArray(coords[0][0])){arr=arr.concat(coords)}else{arr.push(coords)}
return arr},[]);for(var p=1;p<noParts;p++){shpView.setInt32(shpI+52+(p*4),onlyParts.reduce(function(a,b,idx){return idx<p?a+b.length:a},0),!0)}
flattened.forEach(function writeLine(coords,i){shpView.setFloat64(shpI+56+(i*16)+(noParts-1)*4,coords[0],!0);shpView.setFloat64(shpI+56+(i*16)+(noParts-1)*4+8,coords[1],!0)});shpI+=contentLength+8}};module.exports.shpLength=function(geometries){return(geometries.length*56)+(justCoords(geometries).length*16)};module.exports.shxLength=function(geometries){return geometries.length*8};module.exports.extent=function(coordinates){return justCoords(coordinates).reduce(function(extent,c){return ext.enlarge(extent,c)},ext.blank())};function parts(geometries,TYPE){var no=1;if(TYPE===types.geometries.POLYGON||TYPE===types.geometries.POLYLINE){no=geometries.reduce(function(no,coords){no+=coords.length;if(Array.isArray(coords[0][0][0])){no+=coords.reduce(function(no,rings){return no+rings.length-1},0)}
return no},0)}
return no}
module.exports.parts=parts;function totalPoints(geometries){var sum=0;geometries.forEach(function(g){sum+=g.length});return sum}
function justCoords(coords,l){if(l===undefined)l=[];if(typeof coords[0][0]=='object'){return coords.reduce(function(memo,c){return memo.concat(justCoords(c))},l)}else{return coords}}},{"./extent":109,"./types":115}],114:[function(require,module,exports){module.exports='GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'},{}],115:[function(require,module,exports){module.exports.geometries={NULL:0,POINT:1,POLYLINE:3,POLYGON:5,MULTIPOINT:8,POINTZ:11,POLYLINEZ:13,POLYGONZ:15,MULTIPOINTZ:18,POINTM:21,POLYLINEM:23,POLYGONM:25,MULTIPOINTM:28,MULTIPATCH:31,}},{}],116:[function(require,module,exports){var types=require('./types'),dbf=require('dbf'),prj=require('./prj'),ext=require('./extent'),getFields=require('./fields'),assert=require('assert'),pointWriter=require('./points'),polyWriter=require('./poly');var writers={1:pointWriter,5:polyWriter,3:polyWriter};var recordHeaderLength=8;module.exports=write;function write(rows,geometry_type,geometries,callback){var TYPE=types.geometries[geometry_type],writer=writers[TYPE],parts=writer.parts(geometries,TYPE),shpLength=100+(parts-geometries.length)*4+writer.shpLength(geometries),shxLength=100+writer.shxLength(geometries),shpBuffer=new ArrayBuffer(shpLength),shpView=new DataView(shpBuffer),shxBuffer=new ArrayBuffer(shxLength),shxView=new DataView(shxBuffer),extent=writer.extent(geometries);writeHeader(shpView,TYPE);writeHeader(shxView,TYPE);writeExtent(extent,shpView);writeExtent(extent,shxView);writer.write(geometries,extent,new DataView(shpBuffer,100),new DataView(shxBuffer,100),TYPE);shpView.setInt32(24,shpLength/2);shxView.setInt32(24,(50+geometries.length*4));var dbfBuf=dbf.structure(rows);callback(null,{shp:shpView,shx:shxView,dbf:dbfBuf,prj:prj})}
function writeHeader(view,TYPE){view.setInt32(0,9994);view.setInt32(28,1000,!0);view.setInt32(32,TYPE,!0)}
function writeExtent(extent,view){view.setFloat64(36,extent.xmin,!0);view.setFloat64(44,extent.ymin,!0);view.setFloat64(52,extent.xmax,!0);view.setFloat64(60,extent.ymax,!0)}},{"./extent":109,"./fields":110,"./points":112,"./poly":113,"./prj":114,"./types":115,"assert":1,"dbf":27}],117:[function(require,module,exports){(function(process){var write=require('./write'),geojson=require('./geojson'),prj=require('./prj'),JSZip=require('jszip');module.exports=function(gj,options){var zip=new JSZip(),layers=zip.folder(options&&options.folder?options.folder:'layers');[geojson.point(gj),geojson.line(gj),geojson.polygon(gj)].forEach(function(l){if(l.geometries.length&&l.geometries[0].length){write(l.properties,l.type,l.geometries,function(err,files){var fileName=options&&options.types[l.type.toLowerCase()]?options.types[l.type.toLowerCase()]:l.type;layers.file(fileName+'.shp',files.shp.buffer,{binary:!0});layers.file(fileName+'.shx',files.shx.buffer,{binary:!0});layers.file(fileName+'.dbf',files.dbf.buffer,{binary:!0});layers.file(fileName+'.prj',prj)})}});var generateOptions={compression:'STORE',type:'base64'};if(!process.browser){generateOptions.type='nodebuffer'}
return zip.generateAsync(generateOptions)}}).call(this,require('_process'))},{"./geojson":111,"./prj":114,"./write":116,"_process":91,"jszip":47}],118:[function(require,module,exports){module.exports.download=require('./src/download')
module.exports.write=require('./src/write')
module.exports.zip=require('./src/zip')},{"./src/download":108,"./src/write":116,"./src/zip":117}]},{},[118])(118)})