var fs = require('fs')
var str = fs.readFileSync(__dirname + '/hello.txt', 'utf8')
console.log(str)
