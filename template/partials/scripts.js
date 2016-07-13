const h = require('hyperscript')
const hyperx = require('hyperx')

module.exports = function (results) {
  const hx = hyperx(h)

  // put any clientside interactivity scripts between script tags
  // if minified libs needed, read them sync and put the buffer.toString
  // in there
  return hx`
  <script>

  </script>
  `
}
