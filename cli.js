#!/usr/bin/env node

var fs = require('fs')
var minimist = require('minimist')

var createTranspiler = require('./')

var args = minimist(process.argv.slice(2))

var sourceFilename = args._[0]
var source = sourceFilename ?
  sourceFilename :
  process.stdin

createTranspiler(args)(source, process.stdout)
