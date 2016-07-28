#! /usr/bin/env node

'use strict'

const minimist = require('minimist')
const fs = require('fs')
const path = require('path')
const buildReport = require('./template')
const help = fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8')
const ndjson = require('ndjson')
const steed = require('steed')

function start () {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['help'],
    alias: {
      input: 'i',
      compare: 'c',
      version: 'v',
      help: 'h'
    },
    default: {
    }
  })

  if (argv.version) {
    console.log('autocannon-reporter', 'v' + require('./package').version)
    console.log('node', process.version)
    return
  }

  if (argv.help) {
    console.error(help)
    return
  }

  if (argv.compare) {
    argv._.push(argv.compare)
    argv.compare = argv._
  }
  argv.outputPath = path.join(process.cwd(), 'report.html')
  argv.outputPathFolder = path.dirname(argv.outputPath)

  if (process.stdin.isTTY) {
    if (!argv.input) {
      console.error('input (-i) is required when not piping into this')
      console.error(help)
      return
    }

    argv.inputPath = path.isAbsolute(argv.input) ? argv.input : path.join(process.cwd(), argv.input)
    argv.compare = argv.compare || []
    steed.map(argv.compare, (val, cb) => {
      val = path.isAbsolute(val) ? val : path.join(process.cwd(), val)
      fs.access(val, fs.F_OK, function (err) {
        if (err) return cb(new Error('Can\'t access ' + val))
        cb(null, require(val))
      })
    }, (err, compare) => {
      if (err) return console.log(err)
      compare = sort(compare)
      const results = require(argv.inputPath)
      const report = buildReport(results, compare)
      writeReport(report, argv.outputPath, (err) => {
        if (err) console.err('Error writting report: ', err)
        else console.log('Report written to: ', argv.outputPath)
      })
    })
  } else {
    let compare = []
    process.stdin
     .pipe(ndjson.parse())
     .on('data', (json) => { compare.push(json) })
     .on('finish', () => {
       compare = sort(compare)
       const report = buildReport(compare[0], compare)
       writeReport(report, argv.outputPath, (err) => {
         if (err) console.err('Error writting report: ', err)
         else console.log('Report written to: ', argv.outputPath)
       })
     })
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

function sort (array) {
  array.sort(function (a, b) {
    if (a.finish < b.finish) {
      return 1
    }
    if (a.finish > b.finish) {
      return -1
    }
    return 0
  })
  return array
}
