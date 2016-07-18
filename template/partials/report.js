'use strict'
const prettyBytes = require('pretty-bytes')
const moment = require('moment')
function datestuff (date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
}

function growDiv() {
  var growDiv = document.getElementById('grow');
  if (growDiv.clientHeight) {
    growDiv.style.height = 0;
  } else {
    var wrapper = document.querySelector('.measuringWrapper');
    growDiv.style.height = wrapper.clientHeight + "px";
  }

  document.getElementById("more-button").value = document.getElementById("more-button").value == 'Read more' ? 'Read less' : 'Read more';
}


module.exports = function (results, hx) {
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
      <div class='object latency'>
        <div class='heading' onclick="growDiv(this)">
        <h2 class='symbol'>-</hs>
          <h2>Latency</h2>
        </div>
        <div id='grow' class='content'>
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
      <div class='object throughput'>
        <div class='heading' onclick="growDiv(this)">
          <h2 class='symbol'>-</hs>
          <h2>Throughput</h2>
        </div>
        <div id='grow' class='content'>
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
    </div>
  </div>
  `
}
