var through = require('through2')
module.exports = function (filename) {
  return through(function (buf, enc, next) {
    next(null, buf.toString().toUpperCase())
  })
}
