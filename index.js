var fs = require('fs')
var defined = require('defined')
var pump = require('pump')
var assign = require('object-assign')
var resolve = require('resolve')

module.exports = createTranspiler

function createTranspiler (options) {
  options = defined(options, {})
  var transformers = getTransformers(options)

  return function transpile (filename, writable, cb) {
    cb = cb || function () {}
    var source = fs.createReadStream(filename)
    var transform = transformers.map(function (tr) {
      // clone the options so that userland transforms can't mutate
      var transformOpts = assign({}, tr[1])
      return tr[0](filename, transformOpts)
    })

    var sink = typeof writable === 'string'
      ? fs.createWriteStream(writable)
      : writable
    return pump.apply(null,
      [ source ].concat(transform).concat([ sink, cb ])
    )
  }
}

// -> fn(err, [ [ transformFn, transformOpts ] ])
function getTransformers (opts) {
  var cwd = opts.basedir || process.cwd()
  var transforms = [].concat(opts.transform).filter(Boolean)
  return transforms.map(function (item) {
    // support [ 'brfs', {} ] and 'brfs'
    var transform
    var transformOpts = {}
    if (Array.isArray(item)) {
      transform = item[0]
      transformOpts = item[1] || {}
    } else {
      transform = item
    }
    if (typeof transform === 'string') {
      // resolve module names like in browserify
      var file = resolve.sync(transform, {
        basedir: cwd
      })
      transform = require(file)
      if (typeof transform !== 'function') {
        throw new Error(
          'Transform at ' + file + ' must export a function'
        )
      }
    } else if (typeof transform !== 'function') {
      throw new Error(
        'Expected string or function for transform, got ' + item
      )
    }
    return [ transform, transformOpts ]
  })
}
