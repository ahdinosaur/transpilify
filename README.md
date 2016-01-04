# transpilify

Applies browserify transforms to your source code, without actually bundling it.

This is useful if you have a module that would typically use some browserify transforms (like [glslify](https://www.npmjs.com/package/glslify) or [browserify-css](https://www.npmjs.com/package/browserify-css)), but you would like to publish a bundler-agnostic distribution to npm.

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
  - `--out-file`, `-o` write results to a file
  - `--out-dir`, `-d` transpile directory & contents to destination
  - `--quiet` do not print any debug logs to stderr

> *Note:* Currently, when you use `--out-dir`, only files ending with `.js` and `.jsx` will be sent through the transform streams. This will be configurable in a later version.

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
transpilify index.js -t [ babelify --preset [ es2015 react ] ] > bundle.js
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
transpilify hello.txt -t ./uppercase.js
```

Prints:

```sh
HELLO, WORLD!
```

## Roadmap / TODO

- Investigate better source map support
- Investigate better way of handling non-JS extensions with `--out-dir`