#!/usr/bin/env node
var subarg = require('subarg')
var assign = require('object-assign')
var path = require('path')

var createTranspiler = require('./')
var vinylfs = require('vinyl-fs')
var bl = require('bl')
var fs = require('fs')
var through2 = require('through2')
var mkdirp = require('mkdirp')

var args = subarg(process.argv.slice(2), {
  alias: {
    transform: 't',
    outDir: [ 'out-dir', 'd' ],
    outFile: [ 'out-file', 'o' ]
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
run(args._)

function run (paths) {
  if (args.outDir && args.outFile) {
    return bail('Cannot specify both --out-dir and --out-file!')
  }

  if (paths.length !== 1) {
    return bail('Must specify one entry point, e.g.\n' +
      '  transpilify index.js > dist/indx.js')
  }

  if ((args.outFile && typeof args.outFile !== 'string') ||
      (args.outDir && typeof args.outDir !== 'string')) {
    return bail('Output option must be a path string')
  }

  if (args.outFile || (!args.outFile && !args.outDir)) {
    var file = paths[0]
    var sink
    if (args.outFile) {
      sink = path.resolve(basedir, args.outFile, path.basename(file))
      log(file, sink)
    } else {
      sink = process.stdout
    }

    // support stdout and file writing
    sink = typeof sink === 'string'
      ? fs.createWriteStream(sink)
      : sink
    transpiler(file).pipe(sink)
  } else {
    var outdir = path.resolve(basedir, args.outDir)
    fs.stat(outdir, function (err, stat) {
      // skip errors since vinyl-fs will mkdirp
      if (!err && !stat.isDirectory()) {
        return bail('--out-dir must be a directory')
      }
      toDirectory(paths, args.outDir)
    })
  }
}

function log (src, dst) {
  console.error(src, '->', dst)
}

function toDirectory (paths, dir) {
  // copy all files
  var rootDir = paths[0]
  var globs = [ path.join(rootDir, '/**/*') ]
  vinylfs.src(globs)
    .pipe(through2.obj(write, flush))
    .pipe(vinylfs.dest(dir))

  function write (file, _, next) {
    if (file.isNull() || !/\.js$/i.test(file.path)) {
      this.push(file)
      next()
      return
    }

    var stream = this
    if (file.isStream()) {
      return stream.emit('error', new Error(
        'Received a streaming file instead of a buffer source'
      ))
    }

    transpiler(file.path)
      .pipe(bl(function (err, buffer) {
        if (err) return stream.emit('error', err)

        var oldPath = path.relative(basedir, file.path)
        var newPath = [ dir, oldPath ].join(path.sep)
        log(oldPath, newPath)
        file.contents = buffer
        stream.push(file)
        next()
      }))
  }

  function flush () {
    this.push(null)
    this.emit('end')
  }
}

function bail (msg) {
  console.error(typeof msg === 'string' ? ('ERROR: ' + msg) : msg.stack)
  process.exit(1)
}
