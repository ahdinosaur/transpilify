# transpilify

[![stability][stability-image]][stability-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Applies browserify transforms to your source code, without actually bundling it.

This is useful if you have a module that would typically use some browserify transforms (like [glslify](https://www.npmjs.com/package/glslify) or [browserify-css](https://www.npmjs.com/package/browserify-css)), but you would like to publish a bundler-agnostic distribution to npm.

#### work in progress

This module is still a work in progress and may be subject to more changes.

## Install

With [npm](https://www.npmjs.com):

```sh
npm install -g transpilify
```

## API Usage

#### `transpile = createTranspiler([opt])`

Returns a function, `transpile`, which creates a transform stream. The options:

- `transform` a transform or array of transforms, same usage as browserify
- `basedir` the base directory used to resolve transform names from

The `transform` elements can be a string (local dependency) or function (conventional transform stream). You can use a tuple to specify the transform and its options. For example:

```js
var transpiler = createTranspiler({
  transform: [
    // local dependency
    'brfs',
    // transform + options
    [ 'glslify', { transform: [ 'glslify-hex' ] },
    // transform function
    require('babelify').configure({
      presets: [ 'es2015' ]
    })
  ]
})
```

#### `stream = transpiler(filename)`

Creates a new transform stream for the given `filename`, reading it from disk.

For example:

```js
var createTranspiler = require('transpilify')
var transpiler = createTranspiler({
  transform: 'brfs'
})

transpiler('src/index.js')
  .pipe(process.stdout)
```

## CLI Usage

Accepts a single file (to stdout or `--out-file`) or a single directory (to `--out-dir`).

```sh
# to stdout
transpilify src/index.js [opts]

# to file
transpilify src/index.js --out-file build.js [opts]

# transpile whole directory
transpilify src/ --out-dir dist/ [opts]
```

Options:

  - `--transform`, `-t` are written like browserify CLI transforms; supports subarg
    - e.g. `--transform brfs`
  - `--out-file`, `-o` write results to a file
  - `--out-dir`, `-d` transpile directory & contents to destination
  - `--ignore`, `-i` a pattern or array of glob patterns to ignore (will not emit files matching these globs)
  - `--extensions`, `-x`
    - a list of comma-separated extensions to accept for transformation
    - defaults to `".js,.jsx,.es6,.es"`
  - `--quiet` do not print any debug logs to stderr

## Browserify Examples

For example, we have a Node/Browser `index.js` file:

```js
var fs = require('fs')
var str = fs.readFileSync(__dirname + '/hello.txt', 'utf8')
console.log(str)
```

And our static file:

```txt
Hello, world!
```

After installing `brfs` locally as a devDependency, we can transpile:

```sh
transpilify index.js --transform brfs > dist/index.js
```

The resulting `dist/index.js` file will have the contents statically inlined, without any additional overhead of a traditional bundler.

```js
console.log("Hello, world!")
```

Another example, using babelify and presets:

```sh
transpilify index.js -t [ babelify --presets [ es2015 react ] ] > bundle.js
```

## Custom Transform Example

Say you want a simple transform for your Node/Browser/whatever module, without the complexities of a bundler, babel plugins, or what have you.

Add a transform:

```js
// uppercase.js
var through = require('through2')
module.exports = function (filename) {
  return through(function (buf, enc, next) {
    next(null, buf.toString().toUpperCase())
  })
}
```

Now you can reference the `uppercase.js` file during transpilation:

```sh
transpilify index.js -t ./uppercase.js
```

This will uppercase your entire source file.

## Roadmap / TODO

- Investigate better source map support

[stability-image]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[stability-url]: https://nodejs.org/api/documentation.html#documentation_stability_index
[npm-image]: https://img.shields.io/npm/v/transpilify.svg?style=flat-square
[npm-url]: https://npmjs.org/package/transpilify
[downloads-image]: http://img.shields.io/npm/dm/transpilify.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/transpilify
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
