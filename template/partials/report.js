'use strict'
const h = require('hyperscript')
const hyperx = require('hyperx')
const prettyBytes = require('pretty-bytes')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
function datestuff (date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}


module.exports = function (results, compare) {
  const hx = hyperx(h)
  return reportBody(results, hx, compare)
}

function reportBody (results, hx, compare) {
  return hx`
  <div>
    <div class='header'>
      <img class="logo" src="data:image/png;base64,${fs.readFileSync(path.join(__dirname, '../assets/autocannon-logo.png')).toString('base64')}"/>
      ${results.title ? hx`<h1>Results for ${results.title}</h1>` : hx`<h1>Results</h1>`}
    </div>
    <div class='report'>
      <div class ='object content no-border spaceout'>
        <ul class ='grid'>
          <li><b>Start Time:</b> ${datestuff(results.start)} </li>
          <li><b>Connections:</b> ${results.connections}</li>
          <li><b>Timeouts:</b> ${results.timeouts}</li>
          <li><b>Throughput average:</b> ${prettyBytes(results.throughput.average)}/sec</li>
        </ul>
        <ul class ='grid'>
          <li><b>Finish Time:</b> ${datestuff(results.finish)}</li>
          <li><b>Pipelining:</b> ${results.pipelining}</li>
          <li><b>Requests Average:</b> ${results.requests.average} reqs/sec</li>
        </ul>
        <ul class='grid'>
          <li><b>Duration:</b> ${results.duration + ' sec(s)'}</li>
          <li><b>Errors:</b> ${results.errors}</li>
          <li><b>Latency average:</b> ${results.latency.average} ms</li>
        </ul>
      </div>
      ${results['2xx'] + results.non2xx > 0 ? panels(results, hx, compare) : warnPanel(results, hx)}
      ${compare && compare.length > 0 ? comparePanels(results, hx, compare) : ''}
    </div>
  </div>
  `
}

function panels (results, hx, compare) {
  return hx`
  <div class='standard-panels'>
  ${responseBarPanel(results, hx)}
  ${responsePiePanel(results, hx)}
  ${results.errors === 0 && results.timeouts === 0 ? '' : errorPiePanel(results, hx)}
  ${tablesPanel(results, hx)}
  </div>
  `
}

function responseBarPanel (results, hx) {
  return hx `
  <div class='object responseBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Response Times Histogram</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-bar"></div>
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
        <h2>Response Types Piechart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-chart-responses ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function errorPiePanel (results, hx) {
  return hx `
  <div class='object errorPie'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Error Piechart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-error-pie ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function tablesPanel (results, hx) {
  return hx`
  <div class='object'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
      <h2>Requests, Latency and Throughput</h2>
    </div>
    <div class='content'>
      <div class='measuringWrapper spaceout'>
        ${makeTable('Requests', results.latency, key => hx`<tr><td>${key}</td><td>${results.latency[key]}</td></tr>`)}
        ${makeTable('Latency', results.requests, key => hx`<tr><td>${key}</td><td>${results.requests[key]}</td></tr>`)}
        ${makeTable('Throughput', results.throughput, key => hx`<tr><td>${key}</td><td>${prettyBytes(results.throughput[key])}</td></tr>`)}
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
