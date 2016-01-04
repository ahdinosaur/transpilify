# transpilify

Applies browserify transforms to your source code, without actually bundling it.

This is useful if you have a module that would typically use some browserify transforms (like [glslify](https://www.npmjs.com/package/glslify) or [browserify-css](https://www.npmjs.com/package/browserify-css)), but you would like to publish a bundler-agnostic distribution to npm.

## Install

With [npm](https://www.npmjs.com):

```shell
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
var transpiler = createTranspiler({
  transform: 'brfs'
})

transpiler('foo.js')
  .pipe(process.stdout)
```

## CLI Usage

```shell
transpilify path/to/index.js [options]
```

Transpiles the file at `path/to/index.js` using the `options`, and outputs to `process.stdout`.

Options:

  - `--transform`, `-t` are written like browserify CLI transforms

## examples

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

```shell
transpilify index.js --transform brfs > dist/index.js
```

The resulting `dist/index.js` file will have the contents statically inlined, without any additional overhead of a traditional bundler.

```js
console.log("Hello, world!")
```

Another example, using babelify and presets:

```shell
transpilify index.js -t [ babelify --preset [ es2015 react ] ] > bundle.js
```

## Roadmap / TODO

- Handle entire source folders in CLI/API, like `babel` does.
- Consider using async version of `resolve`...?
- Investigate better source map support
- Document API usage
