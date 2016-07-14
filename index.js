#! /usr/bin/env node

'use strict'

const minimist = require('minimist')
const fs = require('fs')
const path = require('path')
const concat = require('concat-stream')
const buildReport = require('./template')
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
    console.log('here 1')
    if (!argv.input) {
      console.error('input (-i) is required when not piping into this')
      console.error(help)
      return
    }

    argv.inputPath = path.isAbsolute(argv.input) ? argv.input : path.join(process.cwd(), argv.input)
    const results = require(argv.inputPath)
    const report = buildReport(results)
    writeReport(report, argv.outputPath, (err) => {
      if (err) console.err('Error writting report: ', err)
      else console.log('Report written to: ', argv.outputPath)
    })
  } else {
    console.log('here 2')
    const concatStream = concat((res) => {
      const results = JSON.parse(res.toString())
      const report = buildReport(results)
      writeReport(report, argv.outputPath, (err) => {
        if (err) console.err('Error writting report: ', err)
        else console.log('Report written to: ', argv.outputPath)
      })
    })
    process.stdin.pipe(concatStream)
  }
}

function writeReport (report, path, cb) {
  fs.writeFile(path, report, cb)
}

module.exports.buildReport = buildReport
module.exports.writeReport = writeReport

if (require.main === module) {
  start()
}
