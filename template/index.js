const h = require('hyperscript')
const hyperx = require('hyperx')
const scripts = require('./partials/scripts')
const css = require('./partials/css')
const report = require('./partials/report')

module.exports = function (results) {
  const hx = hyperx(h)

  return hx`
  <!doctype html>
  <html>
    <head>
      <title>Autocannon report</title>
      ${scripts(results)}
      ${css(results)}
    </head>
    <body>
      ${report(results)}
    </body>
  </html>
  `.outerHTML
}
