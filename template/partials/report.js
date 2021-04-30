'use strict'
const h = require('hyperscript')
const hyperx = require('hyperx')
const prettyBytes = require('pretty-bytes')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
function datestuff (date) {
  return moment(date).format('DD-MMM-YYYY, HH:mm:ss')
}


module.exports = function (results, compare) {
  const hx = hyperx(h)
  return reportBody(results, hx, compare)
}

function reportBody (results, hx, compare = []) {
  return hx`
  <div>
    <div class='header'>
      <img class="logo" src="data:image/png;base64,${fs.readFileSync(path.join(__dirname, '../assets/autocannon-logo.png')).toString('base64')}"/>
      ${results.title ? hx`<h1>Results for ${results.title}</h1>` : hx`<h1>Results</h1>`}
    </div>
    <div class='report'>
      <table>
        <tr>
          <th>Start time</th>
          <th>Finish time</th>
          <th>Duration</th>
          <th>Connections</th>
          <th>Pipelining</th>
          <th>Errors</th>
          <th>Timeouts</th>
          <th>Requests avg.</th>
          <th>Latency avr.</th>
          <th>Throughput avg.</th>
        </tr>
        <tr>
          <td>${datestuff(results.start)}</td>
          <td>${datestuff(results.finish)}</td>
          <td>${results.duration + ' sec(s)'}</td>
          <td>${results.connections}</td>
          <td>${results.pipelining}</td>
          <td>${results.errors}</td>
          <td>${results.timeouts}</td>
          <td>${results.requests.average} reqs/sec</td>
          <td>${results.latency.average} ms</td>
          <td>${prettyBytes(results.throughput.average)}/sec</td>
        </tr>
    ${[...compare].reverse().map(function (value) {
      return hx`
        <tr>
          <td>${datestuff(value.start)}</td>
          <td>${datestuff(value.finish)}</td>
          <td>${value.duration + ' sec(s)'}</td>
          <td>${value.connections}</td>
          <td>${value.pipelining}</td>
          <td>${value.errors}</td>
          <td>${value.timeouts}</td>
          <td>${value.requests.average} reqs/sec</td>
          <td>${value.latency.average} ms</td>
          <td>${prettyBytes(value.throughput.average)}/sec</td>
        </tr>
      `
    })}

      </table>
      ${results['2xx'] + results.non2xx > 0 ? panels(results, hx, compare) : warnPanel(results, hx)}
      ${compare && compare.length > 0 ? comparePanels(results, hx, compare) : ''}
    </div>
  </div>
  `
}

function panels (results, hx, compare) {
  return hx`
  <div class='standard-panels'>
  ${requestBarPanel(results, hx)}
  ${latencyBarPanel(results, hx)}
  ${throughputBarPanel(results, hx)}
  ${responsePiePanel(results, hx)}
  ${tablesPanel(results, compare, hx)}
  </div>
  `
}

function latencyBarPanel (results, hx) {
  return hx `
  <div class='object responseBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Latency Histogram</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-latency-bar"></div>
      </div>
    </div>
  </div>
  `
}

function requestBarPanel (results, hx) {
  return hx `
  <div class='object requestBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Request Histogram</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-request-bar"></div>
      </div>
    </div>
  </div>
  `
}

function throughputBarPanel (results, hx) {
  return hx `
  <div class='object throughputBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Throughpout Histogram</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-throughput-bar"></div>
      </div>
    </div>
  </div>
  `
}

function responsePiePanel (results, hx) {
  return hx `
  <div class='object reponsePie'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Response Types Piechart (Overall)</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-chart-responses ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function tablesPanel (results, compare, hx) {
  return hx`
  <div class='object'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
      <h2>Requests, Latency and Throughput</h2>
    </div>
    <div class='content'>
      <div class='measuringWrapper spaceout'>
        ${makeTable('Requests [reqs/sec]', results.requests, key => hx`<tr><td>${key}</td><td class='value'>${toInt(results.requests[key])}</td>${addCompareRequestValues(compare, key, hx)}</tr>`)}
        ${makeTable('Latency [ms]', results.latency, key => hx`<tr><td>${key}</td><td class='value'>${toInt(results.latency[key])}</td>${addCompareLatencyValues(compare, key, hx)}</tr>`)}
        ${makeTable('Throughput [bytes/sec]', results.throughput, key => hx`<tr><td>${key}</td><td class='value'>${prettyBytes(results.throughput[key])}</td>${addCompareThroughputValues(compare, key, hx)}</tr>`)}
      </div>
    </div>
  </div>
  `
  function makeTable (title, obj, map) {
    return hx`
    <div>
      <h3>${title}</h3>
      <table class='table' style="width:100%">
        <tr>
          <th>Stat</th>
          <th>Value</th>
        </tr>
        ${Object.keys(obj).map(map)}
      </table>
    </div>`
  }
}

function addCompareRequestValues (compare, key, hx) {
  return hx`
    ${[...compare].reverse().map(function (value) {
    return hx`
      <td class='value'>${toInt(value.requests[key])}</td>
    `
  })}
  `
}

function addCompareLatencyValues (compare, key, hx) {
  return hx`
    ${[...compare].reverse().map(function (value) {
    return hx`
      <td class='value'>${toInt(value.latency[key])}</td>
    `
  })}
  `
}

function addCompareThroughputValues (compare, key, hx) {
  return hx`
    ${[...compare].reverse().map(function (value) {
    return hx`
      <td class='value'>${prettyBytes(value.throughput[key])}</td>
    `
  })}
  `
}

function warnPanel (results, hx) {
  return hx`
  <div class='object'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Warning</h2>
    </div>
    <div class='content'>
      <div class='measuringWrapper'>
        <h3 color='red'>No graphs to display because of failed autocannon run (0 responses received)</h3>
      </div>
    </div>
  </div>
  `
}

function comparePanels (results, hx, compare) {
  return hx`
  <div class='compare-panels'>
  ${requestsPanel(results, hx)}
  ${latencyPanel(results, hx)}
  ${throughputPanel(results, hx)}
  ${errorsPanel(results, hx)}
  </div>
  `
}

function requestsPanel (results, hx) {
  return hx`
  <div class='object requestsBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Requests Comparison Chart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="chart-request-linechart ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function latencyPanel (results, hx) {
  return hx`
  <div class='object latencyBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Latency Comparison Chart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="chart-latency-linechart ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function throughputPanel (results, hx) {
  return hx`
  <div class='object throughputBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Throughput Comparison Chart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="chart-throughput-linechart ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function errorsPanel (results, hx) {
  return hx`
  <div class='object errorBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Error Comparison Chart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class='centeredText'><span class ='redText'>Red</span> = Errors, <span class='blueText'>Blue</span> = Timeouts</div>
        <div class="chart-error-barchart ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function toInt (num) {
  return Number.parseInt(num)
}