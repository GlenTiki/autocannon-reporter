'use strict'

module.exports = function (results, hx) {
  // put any css needed between style tags
  return hx`
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background: #c8edff;
    }
    .report {
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: stretch;
      align-content: space-around

    }
    .object {
      background: #66cafc;
      margin: 0 0 3% 0;
      padding: 0% 10% 1% 5%;
    }
    .table {
      display: flex;
      flex-direction: column;
      background: #2C3E50;
      color: #ddd;

    }

  </style>
  `
}
/* body {
  font-family: 'Roboto', sans-serif;
}
.heading{
  margin: 20%
}
-webkit-flex-flow: row wrap;*/
