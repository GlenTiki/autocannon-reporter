'use strict'

module.exports = function (results, hx) {
  // put any clientside interactivity scripts between script tags
  // if minified libs needed, read them sync and put the buffer.toString
  // in there
  return hx`
  <script>
  function growDiv(e) {
    var header = e
    var objectContainer = header.parentElement
    var symbol = objectContainer.getElementsByClassName("symbol")[0]
    console.log(symbol)
    var content = objectContainer.getElementsByClassName("content")[0]
    if (content.clientHeight !== 20) {
      content.style.height = 0;
      symbol.innerText = '+'
    } else {
      var wrapper = content.getElementsByClassName("measuringWrapper")[0]
      content.style.height = wrapper.clientHeight + "px";
      symbol.innerText = '-'
    }

  }
  </script>
  `
}
// document.getElementById("more-button").value = document.getElementById("more-button").value == 'Read more' ? 'Read less' : 'Read more';
// var growDiv = document.getElementById('grow');
