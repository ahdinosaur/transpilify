var transpilify = require('../')
var test = require('tape')
var path = require('path')
var fs = require('fs')
var bl = require('bl')
var uppercaser = require('./uppercase')
var babelify = require('babelify').configure({
  presets: 'es2015'
})

test('handles simple transform function', function (t) {
  t.plan(1)

  var transpile = transpilify({
    transform: uppercaser
  })

  var fixture = path.resolve(__dirname, 'fixtures', 'hello.txt')
  transpile(fixture).pipe(bl(function (err, body) {
    if (err) return t.fail(err)
    t.equal(body.toString(), 'HELLO', 'matches source output')
  }))
})

test('handles require path to simple transform function', function (t) {
  t.plan(1)

  var transpile = transpilify({
    transform: require.resolve('./uppercase.js')
  })

  var fixture = path.resolve(__dirname, 'fixtures', 'hello.txt')
  transpile(fixture).pipe(bl(function (err, body) {
    if (err) return t.fail(err)
    t.equal(body.toString(), 'HELLO', 'matches source output')
  }))
})

test('simple transpiler using browserify transforms', function (t) {
  t.plan(1)

  var transpile = transpilify({
    transform: [
      'brfs',
      [ 'glslify', { transform: ['glslify-hex'] } ],
      babelify
    ]
  })

  var expectedFile = path.resolve(__dirname, 'fixtures', 'expected.js')
  var expected = fs.readFileSync(expectedFile, 'utf8')

  var fixture = path.resolve(__dirname, 'fixtures', 'actual.js')
  transpile(fixture).pipe(bl(function (err, body) {
    if (err) return t.fail(err)
    t.equal(body.toString(), expected, 'matches source output')
  }))
})
