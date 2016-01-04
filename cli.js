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
var color = require('term-color')

var args = subarg(process.argv.slice(2), {
  boolean: [ 'quiet' ],
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
    return bail('You must specify a path for --out-file or --out-dir options')
  }

  if (args.outFile || (!args.outFile && !args.outDir)) {
    var file = paths[0]

    fs.stat(file, function (err, stat) {
      if (err && err.code === 'ENOENT') return bail('Missing input file: ' + file)
      if (err) return bail(err)
      if (!stat.isFile()) return bail('Input is not a file: ' + file)

      var output = transpiler(file)
      if (args.outFile) {
        // Although this is a bit non-standard for unix tools,
        // we do it because vinyl-fs is using mkdirp under the hood.
        var newDir = path.resolve(basedir, path.dirname(args.outFile))
        mkdirp.sync(newDir)

        var sink = path.resolve(basedir, args.outFile)
        var inPath = path.relative(basedir, file)
        var outPath = path.relative(basedir, args.outFile)
        logFile(inPath, outPath)
        output.pipe(fs.createWriteStream(sink))
      } else {
        output.pipe(process.stdout)
      }
    })
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

function toDirectory (paths, dir) {
  // copy all files
  var rootDir = paths[0]
  var globs = [ path.join(rootDir, '/**/*') ]
  vinylfs.src(globs)
    .pipe(through2.obj(write, flush))
    .pipe(vinylfs.dest(dir))

  function write (file, _, next) {
    if (file.isNull() || !/\.jsx?$/i.test(file.path)) {
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
        logFile(oldPath, newPath)
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

function logFile (src, dst) {
  if (args.quiet) return
  console.error(src, color.dim('->'), dst)
}
