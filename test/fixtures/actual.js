var fs = require('fs')
var str = fs.readFileSync(__dirname + '/hello.txt', 'utf8')
console.log(str)

var glslify = require('glslify')
console.log(glslify('./vert.glsl'))
console.log(() => { console.log(`Testing es2015`) })
