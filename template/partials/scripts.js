'use strict'

module.exports = function (results, hx) {
  // put any clientside interactivity scripts between script tags
  // if minified libs needed, read them sync and put the buffer.toString
  // in there
  return hx`
  <script>

  </script>
  `
}
