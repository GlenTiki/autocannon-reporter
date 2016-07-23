'use strict'
const h = require('hyperscript')
const hyperx = require('hyperx')
const prettyBytes = require('pretty-bytes')
const moment = require('moment')
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
    <div class='title'>
      ${results.title ? hx`<h1>Results for ${results.title}</h1>` : hx`<h1>Autocannon results</h1>`}
    </div>
    <div class='report'>
      <div class ='object content no-border'>
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

function comparePanels (results, hx, compare) {
  return hx`
  <div class='panels'>
  ${requestsPanel(results, hx)}
  ${bandwidthPanel(results, hx)}
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
        <div class="chart-request-barchart ct-perfect-fourth"></div>
      </div>
    </div>
  </div>
  `
}

function bandwidthPanel (results, hx) {
  return hx`
  <div class='object bandwidthBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Bandwidth Comparison Chart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="chart-bandwidth-barchart ct-perfect-fourth"></div>
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
        <div class="chart-latency-barchart ct-perfect-fourth"></div>
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



function panels (results, hx, compare) {
  return hx`
  <div class='panels'>
  ${responseBarPanel(results, hx)}
  ${responsePiePanel(results, hx)}
  ${results.errors === 0 && results.timeouts === 0 ? '' : errorPiePanel(results, hx)}
  ${latencyTablePanel(results, hx)}
  ${throughputTablePanel(results, hx)}
  </div>
  `
}

function latencyTablePanel (results, hx) {
  return hx`
  <div class='object latency'>
    <div class='heading' onclick="growDiv(this)">
    <h2 class='symbol'>-</h2>
      <h2>Latency</h2>
    </div>
    <div class='content'>
      <div class='measuringWrapper'>
        <table class='table' style="width:100%">
          <tr>
            <th>Stat</th>
            <th>Value</th>
          </tr>
          ${
            Object.keys(results.latency).map((key) => {
              return hx`<tr>
                <td>${key}</td>
                <td>${results.latency[key]}</td>
              </tr>`
            })
          }
        </table>
      </div>
    </div>
  </div>
  `
}

function throughputTablePanel (results, hx) {
  return hx`
  <div class='object throughput'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
      <h2>Throughput</h2>
    </div>
    <div class='content'>
      <div class='measuringWrapper'>
        <table class='table' style="width:100%">
          <tr>
            <th>Stat</th>
            <th>Value</th>
          </tr>
          ${
            Object.keys(results.throughput).map((key) => {
              return hx`<tr>
                <td>${key}</td>
                <td>${prettyBytes(results.throughput[key])}</td>
              </tr>`
            })
          }
        </table>
      </div>
    </div>
  </div>
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

function responsePiePanel (results, hx) {
  return hx `
  <div class='object reponsePie'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Response Types Piechart</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-chart ct-perfect-fourth"></div>
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

function responseBarPanel (results, hx) {
  return hx `
  <div class='object reponseBar'>
    <div class='heading' onclick="growDiv(this)">
      <h2 class='symbol'>-</h2>
        <h2>Response Types Histogram</h2>
    </div>
    <div class='content graph'>
      <div class='measuringWrapper'>
        <div class="ct-bar"></div>
      </div>
    </div>
  </div>
  `
}
