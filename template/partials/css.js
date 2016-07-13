const h = require('hyperscript')
const hyperx = require('hyperx')

module.exports = function (results) {
  const hx = hyperx(h)

  // put any css needed between style tags
  return hx`
  <style>

  </style>
  `
}
