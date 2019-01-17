import pathRegExp from 'path-to-regexp';

const hasOwnProperty = Object.prototype.hasOwnProperty;

function decode_param(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = 'Failed to decode param \'' + val + '\'';
      err.status = err.statusCode = 400;
    }

    throw err;
  }
}

class Layer {
  constructor(path, options, fn) {
    if (!(this instanceof Layer)) {
      return new Layer(path, options, fn)
    }

    let opts = options || {}
    this.name = options.name || fn.name || 'path-to-regexp-layer';
    this.method = options.method && options.method.toLowerCase() || 'get';
    this.regexp = pathRegExp(path, this.keys = [], opts);
    this.origin = path;
    this.path = undefined;
    this.params = undefined;
    this.handle = fn;

    // set fast path flags
    this.regexp.fast_star = path === '*'
    this.regexp.fast_slash = path === '/' && opts.end === false
  }

  match(path, method) {
    let match = undefined;
    if (this.method !== undefined && method !== undefined) {
      if (this.method !== method.toLowerCase()) {
        return false;
      }
    }
    if (path != null) {
      // fast path non-ending match for / (any path matches)
      if (this.regexp.fast_slash) {
        this.params = {}
        this.path = ''
        return true
      }

      // fast path for * (everything matched in a param)
      if (this.regexp.fast_star) {
        this.params = {
          '0': decode_param(path)
        }
        this.path = path
        return true
      }

      // match the path
      match = this.regexp.exec(path)
    }

    if (!match) {
      this.params = undefined;
      this.path = undefined;
      return false;
    }

    // store values
    this.params = {};
    this.path = match[0]

    var keys = this.keys;
    var params = this.params;

    for (var i = 1; i < match.length; i++) {
      var key = keys[i - 1];
      var prop = key.name;
      var val = decode_param(match[i])

      if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
        params[prop] = val;
      }
    }

    return true;
  }
}


export default Layer;