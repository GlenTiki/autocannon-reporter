'use strict'
const prettyBytes = require('pretty-bytes')

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

function diff (finish, start) {
  var finishTime = new Date(finish)
  var startTime = new Date(start)
  var difference = finishTime.getTime() - startTime.getTime()
  difference = Math.floor(difference / 1000)
  return difference
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
        <li><b>Duration:</b> ${diff(results.finish, results.start) + ' sec(s)'}</li>
        <li><b>Errors:</b> ${results.errors}</li>
        <li><b>Latency average:</b> ${results.latency.average} ms</li>
      </ul>
    </div>
    <div class='object latency'>
      <div class='heading'>
        <h2>Latency</h2>
      </div>
      <div class='content'>
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
      <div class='object throughput'>
        <div class='heading'>
          <h2>Throughput</h2>
        </div>
        <div class='content'>
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
  `
}
