'use strict'
const fs = require('fs')
const path = require('path')
const scripts = require('./partials/scripts')
const report = require('./partials/report')
const css = fs.readFileSync(path.join(__dirname, './partials/main.css'))
const flexboxgrid = fs.readFileSync(path.join(__dirname, './deps/flexboxgrid.min.css'))
const chartistStyle = fs.readFileSync(path.join(__dirname, './deps/chartist.min.css'))
const chartistScript = fs.readFileSync(path.join(__dirname, './deps/chartist.min.js'))

module.exports = function (results, compare) {
  if (compare && compare.length > 0) {
    compare.forEach(function (val) {
      if (val.start === results.start && val.finish === results.finish) {
        var index = compare.indexOf(val)
        if (index > -1) {
          compare.splice(index, 1)
        }
      }
    })
  }
  const bodyTree = report(results, compare)

  const fullBody = `
  <!doctype html>
  <html>
    <head>
      <title>Autocannon report</title>
      <style>
        ${flexboxgrid.toString()}
        ${chartistStyle.toString()}
        ${css.toString()}
      </style>
      <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    </head>
    <body>
      ${bodyTree.outerHTML}
      <script>
        ${chartistScript.toString()}
      </script>
      <script>
        ${scripts(results, compare)}
      </script>
    </body>
  </html>
  `

  return fullBody
}
