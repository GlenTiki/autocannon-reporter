'use strict'

module.exports = function (results, hx) {
  // put any css needed between style tags
  return hx`
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      background: white;
      margin: 0px;
    }
    .object {
      margin: 0 0 15px 0;
    }
    .title{
      background: #1C8DC6;
      padding: 10px 30px;
      margin: 0px 0px 15px 0px;
    }
    .heading{
      border: 1px solid black;
      padding: 10px;
      border-radius: 5px 5px 0px 0px;
    }
    .content {
      border: 1px solid black;
      padding: 10px;
      border-radius: 0px 0px 5px 5px;
    }
    .no-border {
      border: 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .report{
      margin: 0 30px;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      align-content: space-around;

    }
    .table {
      display: flex;
      flex-direction: column-reverse;
      padding: 10px;
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
