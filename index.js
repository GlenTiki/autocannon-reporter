#! /usr/bin/env node

'use strict'

const minimist = require('minimist')
const fs = require('fs')
const path = require('path')
const JSONStream = require('JSONStream')
const help = fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8')

function start () {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['help'],
    alias: {
      input: 'i',
      version: 'v',
      help: 'h'
    },
    default: {
    }
  })

  argv.outputPath = path.join(process.cwd(), 'report.html')
  argv.outputPathFolder = path.dirname(argv.outputPath)

  if (argv.version) {
    console.log('autocannon', 'v' + require('./package').version)
    console.log('node', process.version)
    return
  }

  if (argv.help) {
    console.error(help)
    return
  }

  if (process.stdin.isTTY) {
    if (!argv.input) {
      console.error('input (-i) is required when not piping into this')
      console.error(help)
      return
    }

    argv.inputPath = path.isAbsolute(argv.input) ? argv.input : path.join(process.cwd(), argv.input)
    const results = require(argv.inputPath)
    generateReport(results)
  } else {
    const stream = JSONStream.parse()
    stream.on('data', generateReport)
    process.stdin.pipe(stream)
  }
}

function generateReport (results, cb) {
  console.log(results)
}

function writeReport (report, path) {

}

module.exports.generateReport = generateReport
module.exports.writeReport = writeReport

if (require.main === module) {
  start()
}
