'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const prettyBytes = require('pretty-bytes')
const autocannonReporter = require('..')
const sampleResult = require('./sampleResult.json')
const report = autocannonReporter.buildReport(sampleResult)
const expect = Code.expect
function minTwoDigits (n) {
  return (n < 10 ? '0' : '') + n
}

function datestuff (date) {
  date = new Date(date)
  /* date.getMonth() + ' ' + date.getDate() + ', ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
*/
  var temp1 = date.toDateString().substring(4)
  var temp2 = temp1.substring(0, temp1.length - 4)
  temp2 = temp2.trim()
  var temp3 = temp2 + ', ' + minTwoDigits(date.getHours()) + ':' + minTwoDigits(date.getMinutes()) + ':' + minTwoDigits(date.getSeconds())
  var ret = temp3
  return ret
}

lab.test('Report output should contain a start and finish time', (done) => {
  expect(report).to.contain(datestuff(new Date(sampleResult.start).toString()))
  expect(report).to.contain(datestuff(new Date(sampleResult.finish).toString()))
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
