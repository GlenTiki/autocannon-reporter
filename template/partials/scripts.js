'use strict'

module.exports = function (results) {
  return `
    var results = ${JSON.stringify(results)}
    ${growDiv.toString()}
    ${main.toString()}
    main(Chartist, results)

  `
}

function main (chartist, results) {
  var labels = ['1xx', '2xx', '3xx', '4xx', '5xx', 'non2xx', 'timeouts']
  var nonZeros = []
  var seriesValues = []
  var options = {
    fullWidth: true,
    height: 450
  }
  var responsiveOptions = [
    ['screen and (min-width: 640px)', {
      chartPadding: 30,
      labelOffset: 110,
      labelDirection: 'explode',
      labelInterpolationFnc: function (value) {
        return value
      }
    }],
    ['screen and (min-width: 1024px)', {
      labelOffset: 90,
      chartPadding: 20
    }]
  ]
  labels.forEach(function (label) {
    if (results[label] !== 0) {
      nonZeros.push(label)
    }
  })
  nonZeros.forEach(function (value) {
    seriesValues.push(results[value])
  })
  chartist.Pie('.ct-chart', {
    labels: nonZeros,
    series: seriesValues
  }, options, responsiveOptions)
  var lineOptions = {
    fullWidth: true,
    height: 450,
    axisY: {
      labelInterpolationFnc: function (value) {
        return (value) + 'ms'
      }
    }
  }
  var lineValues = [results.latency.min, results.latency.average,
    results.latency.p50, results.latency.p75,
     results.latency.p90, results.latency.p99, results.latency.p999, results.latency.p9999, results.latency.p99999]
  chartist.Bar('.ct-bar', {
    labels: ['min', 'average', 'p50', 'p75', 'p90', 'p99', 'p999', 'p9999', 'p99999'],
    series: [lineValues]
  }, lineOptions)
}

function growDiv (e) {
  var header = e
  var objectContainer = header.parentElement
  var symbol = objectContainer.getElementsByClassName('symbol')[0]
  var content = objectContainer.getElementsByClassName('content')[0]
  if (content.clientHeight !== 20) {
    content.style.height = 0
    symbol.innerText = '+'
  } else {
    var wrapper = content.getElementsByClassName('measuringWrapper')[0]
    content.style.height = wrapper.clientHeight + 'px'
    symbol.innerText = '-'
  }
}
