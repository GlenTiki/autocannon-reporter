'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const prettyBytes = require('pretty-bytes')
const autocannonReporter = require('..')
const sampleResult = require('./sampleResult.json')
const warningSample = require('./warningSample.json')
const moment = require('moment')
const report = autocannonReporter.buildReport(sampleResult)
const warningReport = autocannonReporter.buildReport(warningSample)
const expect = Code.expect

function datestuff (date) {
  return moment(date).format('DD-MMM-YYYY, HH:mm:ss')
}

lab.test('Report output should contain a start and finish time', (done) => {
  expect(report).to.contain(datestuff(new Date(sampleResult.start)))
  expect(report).to.contain(datestuff(new Date(sampleResult.finish)))
  done()
})

lab.test('Report output should contain warning', (done) => {
  expect(warningReport).to.contain('No graphs to display because of failed autocannon run (0 responses received)')
  done()
})

lab.test('Report output should contain the average throughput in text', (done) => {
  expect(report).to.contain(prettyBytes(sampleResult.throughput.average))
  done()
})

lab.test('Report output should contain the average latency in text', (done) => {
  expect(report).to.contain(String(sampleResult.latency.average))
  done()
})

lab.test('Report output should contain the number of connections in text', (done) => {
  expect(report).to.contain(String(sampleResult.connections))
  done()
})

lab.test('Report output should contain the number of pipelining in text', (done) => {
  expect(report).to.contain(String(sampleResult.pipelining))
  done()
})

lab.test('Report output should contain the duration', (done) => {
  expect(report).to.contain(String(sampleResult.duration))
  done()
})
