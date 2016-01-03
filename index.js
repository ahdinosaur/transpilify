var fs = require('fs')
var defined = require('defined')
var pumpify = require('pumpify')
var pump = require('pump')

module.exports = createTranspiler

function createTranspiler (options) {
  var options = defined(options, {})

  var transformers = (Array.isArray(options.transform) ?
    options.transform :
    options.transform == null ? [] : [options.transform]
  ).map(function (tr) {
    if (typeof tr === 'string') {
      return require(tr)
    } else {
      return tr
    }
  })

  return function transpile (readable, writable) {
    var source = typeof readable === 'string' ?
      fs.createReadStream(readable) :
      readable

    var transform = transformers.map(function (tr) {
      if (Array.isArray(tr)) {
        return tr[0](readable, tr[1])
      } else {
        return tr(readable)
      }
    })

    var sink = typeof writable === 'string' ?
      fs.createWriteStream(writable) :
      writable

    return pump.apply(null,
      [source].concat(transform).concat([sink])
    )
  }
}
