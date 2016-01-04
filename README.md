# transpilify

[*experimental*](https://github.com/tristanls/stability-index#stability-1---experimental)

Applies browserify transforms to your source code, without actually bundling it.

This is useful if you have a module that would typically use some browserify transforms (like [glslify](https://www.npmjs.com/package/glslify) or [browserify-css](https://www.npmjs.com/package/browserify-css)), but you would like to publish a bundler-agnostic distribution to npm.

## install

with [npm](https://www.npmjs.com), do

```shell
npm install -g transpilify
```

## CLI usage

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
