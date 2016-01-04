var transpilify = require('../')
var test = require('tape')
var path = require('path')
var fs = require('fs')
var concat = require('concat-stream')
var babelify = require('babelify').configure({
  presets: 'es2015'
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
  transpile(fixture, concat(function (body) {
    t.equal(body.toString(), expected, 'matches source output')
  }))
})