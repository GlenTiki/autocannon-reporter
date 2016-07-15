'use strict'

module.exports = function (results, hx) {
  // put any css needed between style tags
  return hx`
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background: #c8edff;
    }
    .title{
      padding: 30px;
      border: 1px solid black;
    }
    .heading{
      border: 1px solid black;
    }
    .content{
      border: 1px solid #888;
    }
    .report {
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      align-content: space-around;

    }
    .object {
      background: #66cafc;
      margin: 0 0 15px 0;
      padding: 0% 0% 1% 0%;
      border: 1px solid black;
    }
    .table {
      display: flex;
      flex-direction: column;
      background: #2C3E50;
      color: #ddd;
      border: 1px solid black;
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
