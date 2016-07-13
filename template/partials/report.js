const h = require('hyperscript')
const hyperx = require('hyperx')
const prettyBytes = require('pretty-bytes')

module.exports = function (results) {
  const hx = hyperx(h)

  return hx`
  <div class='report'>
    ${results.title ? hx`<h1>Results for ${results.title}</h1>` : hx`<h1>Autocannon results</h1>`}
    <div class='latency'>
      <h2>Latency</h2>
      <table style="width:100%">
        <tr>
          <th>Stat</th>
          <th>Value</th>
        </tr>
        ${
          Object.keys(results.latency).map((key) => {
            return hx`
            <tr>
              <td>${key}</td>
              <td>${results.latency[key]}</td>
            </tr>
            `
          })
        }
      </table>
    </div>
    <div class='throughput'>
      <h2>Throughput</h2>
      <table style="width:100%">
        <tr>
          <th>Stat</th>
          <th>Value</th>
        </tr>
        ${
          Object.keys(results.throughput).map((key) => {
            return hx`
            <tr>
              <td>${key}</td>
              <td>${prettyBytes(results.throughput[key])}</td>
            </tr>
            `
          })
        }
      </table>
      <div class='meta'>
        <h2>General info</h2>
        <ul>
          <li><b>Errors:</b> ${results.errors}</li>
          <li><b>Timeouts:</b> ${results.timeouts}</li>
          <li><b>Runtime:</b> ${results.duration}</li>
          <li><b>Start time:</b> ${new Date(results.start)}</li>
          <li><b>Finish time:</b> ${new Date(results.finish)}</li>
          <li><b>Connections:</b> ${results.connections}</li>
          <li><b>Pipelining:</b> ${results.pipelining}</li>
          <li><b>1xx responses:</b> ${results['1xx']}</li>
          <li><b>2xx responses:</b> ${results['2xx']}</li>
          <li><b>3xx responses:</b> ${results['3xx']}</li>
          <li><b>4xx responses:</b> ${results['4xx']}</li>
          <li><b>5xx responses:</b> ${results['5xx']}</li>
        </ul>
      </div>
    </div>
  </div>
  `
}
