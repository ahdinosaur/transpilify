var fs = require('fs')
var multipipe = require('multipipe')
var assign = require('object-assign')
var resolve = require('resolve')

module.exports = createTranspiler
function createTranspiler (opts) {
  opts = opts || {}
  var transformers = getTransformers(opts)

  return function transpile (filename) {
    var source = fs.createReadStream(filename)
    if (transformers.length === 0) {
      return source
    }

    var transform = transformers.map(function (tr) {
      // clone the options so that userland transforms can't mutate
      var transformOpts = assign({}, tr[1])
      return tr[0](filename, transformOpts)
    })

    return multipipe.apply(null,
      [ source ].concat(transform)
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
