#!/usr/bin/env node

var subarg = require('subarg')
var assign = require('object-assign')
var path = require('path')

var createTranspiler = require('./')
var globby = require('globby')
var args = subarg(process.argv.slice(2), {
  alias: {
    transform: 't',
    output: 'o'
  }
})

var basedir = args.basedir || process.cwd()

// Handle subarg in CLI transforms
var transforms = []
  .concat(args.transform)
  .filter(Boolean)
  .map(function (t) {
    if (typeof t === 'string') {
      return t
    } else if (t && typeof t === 'object') {
      if (!t._[0] || typeof t._[0] !== 'string') {
        return bail('Expected first parameter to be a transform string')
      }
      var name = t._[0]
      delete t._
      return [ name, t ]
    } else {
      bail('Unexpected transform of type ' + typeof t)
    }
  })

var opts = assign({}, args, { transform: transforms })
var transpiler = createTranspiler(opts)
globby(args._).then(result).catch(bail)

function result (paths) {
  if (paths.length === 0) {
    return bail('Must specify at least one entry point, e.g.\n' +
      '  transpilify index.js > dist/indx.js')
  }
  if (paths.length > 1 && !args.output) {
    return bail('When multiple files are specified, you must pass an --output flag.\n' +
      '  transpilify *.js -o dist/')
  }

  if (paths.length === 1) {
    var file = paths[0]
    var sink
    if (args.output) {
      sink = path.resolve(basedir, args.output, path.basename(file))
    } else {
      sink = process.stdout
    }
    transpiler(file, sink)
  } else {
    // TODO: whole directories is still WIP
    // It should also be available through API.
    // var outdir = path.resolve(basedir, args.output)
    // fs.stat(outdir, function (err, stat) {
    //   if (err) return bail(err)
    //   if (!stat.isDirectory()) {
    //     return bail('--output must be a directory.')
    //   }
        // toDirectory(paths, outdir)
    // })
  }
}

// function toDirectory (paths, dir) {
//   var outdir = path.resolve(basedir, args.output)
//   mapLimit(paths, 25, function (file, next) {
//     var main = path.relative(basedir, file)
//     var sink = path.join(outdir, path.basename(file))
//     var stream = transpiler(file, sink)
//     stream.once('error', function (err) {
//       next(err)
//     })
//     stream.once('close', function () {
//       next(null)
//     })
//   }, function (err) {
//     if (err) return bail(err)
//   })
// }

function bail (msg) {
  console.error(typeof msg === 'string' ? ('ERROR: ' + msg) : msg.stack)
  process.exit(1)
}
