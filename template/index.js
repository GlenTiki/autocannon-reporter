'use strict'
const h = require('hyperscript')
const hyperx = require('hyperx')
const fs = require('fs')
const path = require('path')
const scripts = require('./partials/scripts')
const css = require('./partials/css')
const report = require('./partials/report')
const flexboxgrid = fs.readFileSync(path.join(__dirname, './deps/flexboxgrid.min.css'))

module.exports = function (results) {
  const hx = hyperx(h)
  const tree = hx`
  <!doctype html>
  <html>
    <head>
      <title>Autocannon report</title>
      <style>
        ${flexboxgrid.toString()}
      </style>
      ${scripts(results, hx)}
      ${css(results, hx)}
      <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    </head>
    <body>
      ${report(results, hx)}
    </body>
  </html>
  `

  return tree.outerHTML
}
