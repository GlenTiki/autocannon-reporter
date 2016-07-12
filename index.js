#! /usr/bin/env node

'use strict'

const minimist = require('minimist')
const fs = require('fs')
const path = require('path')
const JSONStream = require('JSONStream')
const Handlebars = require('handlebars')
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
    generateReport(results, (report) => { writeReport(report, argv.outputPath ()=>{}) })
  } else {
    const stream = JSONStream.parse()
    stream.on('data', (results) => {
      generateReport(results, argv.outputPath)
    })
    process.stdin.pipe(stream)
  }
}

function generateReport (results, cb) {
  console.log(results)
  const filename = path.join(__dirname, 'template', 'index.html')
  const template = fs.readFileSync(filename, 'utf8')
  const partialsPath = path.join(__dirname, 'template', 'partials')
  const partials = fs.readdirSync(partialsPath)
  partials.forEach((partial) => {
      Handlebars.registerPartial(Path.basename(partial, '.html'), fs.readFileSync(Path.join(partialsPath, partial), 'utf8'))
  })

  const view = Handlebars.compile(template);
  const report = view(results)
  cb(report)
}

function writeReport (report, path, cb) {
  fs.writeFile(path, report, cb)
}

module.exports.generateReport = generateReport
module.exports.writeReport = writeReport

if (require.main === module) {
  start()
}
