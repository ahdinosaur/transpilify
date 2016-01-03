# transpilify

simple transpiler using browserify transforms

## install

with [npm](https://www.npmjs.com), do

```shell
npm install -g transpilify
```

## usage

```shell
transpilify [filename] [browserify options]
```

at the moment the supported browserify options are:

- `--transform`

## example

```shell
transpilify index.js --transform babelify
```

```shell
transpilify index.js --transform babelify > index.out.js
```

## ecosystem

each `transpilify` transform should output source maps.

TODO bundlify module should tree shake and combine source maps.
