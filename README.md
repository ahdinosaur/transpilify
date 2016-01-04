# transpilify

[*experimental*](https://github.com/tristanls/stability-index#stability-1---experimental)

Transpiles source file(s) using the specified browserify transforms, without actually bundling.

This is useful if you have a module that would typically use some browserify transforms (like [glslify](https://www.npmjs.com/package/glslify) or [browserify-css](https://www.npmjs.com/package/browserify-css)), but you would like to publish a bundler-agnostic distribution to npm.

## install

with [npm](https://www.npmjs.com), do

```shell
npm install -g transpilify
```

## usage

```shell
transpilify globs [options]
```

Where `globs` is a single file or glob, or a series of file or globs, such as `'src/**/*.js'`. If the globs resolve to multiple files, you will need to specify an `--output` directory.

Options:

- `--transform`, `-t` behaves like browserify transform option
- `--output`, `-o` the output folder

If no output is specified and only one file is given, the result will be printed to `process.stdout`.

## examples

```shell
transpilify index.js --transform $(pwd)/node_modules/babelify
```

```shell
transpilify index.js --transform $(pwd)/node_modules/babelify > index.out.js
```

## (?) TODO

`transpilify` module should also output source maps.

`bundlify` module should tree shake and combine source maps.
