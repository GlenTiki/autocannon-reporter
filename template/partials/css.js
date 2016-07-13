'use strict'

module.exports = function (results, hx) {
  // put any css needed between style tags
  return hx`
  <style>
    body {
      font-family: 'Roboto', sans-serif;
    }
  </style>
  `
}
