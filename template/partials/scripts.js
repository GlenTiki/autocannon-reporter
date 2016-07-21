'use strict'
module.exports = function (results, compare) {
  return `
    var results = ${JSON.stringify(results)}
    var compare = ${JSON.stringify(compare)}
    ${prettyBytes.toString()}
    ${growDiv.toString()}
    ${main.toString()}
    main(Chartist, results, compare)

  `
}

function main (chartist, results, compare) {
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

  var errorLabels = []
  var errorValues = []
  if (results.errors !== 0) {
    errorLabels.push('Errors (non-timeouts)')
    errorValues.push(results.errors)
  }
  if (results.timeouts !== 0) {
    errorLabels.push('Timeouts')
    errorValues.push(results.timeouts)
  }

  chartist.Pie('.ct-error-pie', {
    labels: errorLabels,
    series: errorValues
  }, options, responsiveOptions)

  var lineValues = [results.latency.min, results.latency.average,
    results.latency.p50, results.latency.p75,
     results.latency.p90, results.latency.p99, results.latency.p999, results.latency.p9999, results.latency.p99999]
  chartist.Bar('.ct-bar', {
    labels: ['min', 'average', 'p50', 'p75', 'p90', 'p99', 'p999', 'p9999', 'p99999'],
    series: [lineValues]
  }, lineOptions)
  if (compare) {
    var requestOptions = {
      fullWidth: true,
      height: 450,
      axisY: {
        labelInterpolationFnc: function (value) {
          return (value) + 'reqs/sec'
        }
      },
      chartPadding: 45
    }
    var compareRequestValues = []
    var compareRequestLabels = []
    compareRequestValues.push(results.requests.average)
    compareRequestLabels.push(results.finish)
    compare.forEach(function (value) {
      compareRequestValues.push(value.requests.average)
      compareRequestLabels.push(value.finish)
    })
    chartist.Bar('.chart-request-barchart', {
      labels: compareRequestLabels,
      series: [compareRequestValues]
    }, requestOptions)

    var bandwidthOptions = {
      fullWidth: true,
      height: 450,
      axisY: {
        labelInterpolationFnc: function (value) {
          return prettyBytes(value) + '/sec'
        }
      },
      chartPadding: 30
    }
    var compareBandwidthValues = []
    var compareBandwidthLabels = []
    compareBandwidthValues.push(results.requests.average)
    compareBandwidthLabels.push(results.finish)
    compare.forEach(function (value) {
      compareBandwidthValues.push(value.requests.average)
      compareBandwidthLabels.push(value.finish)
    })
    chartist.Bar('.chart-bandwidth-barchart', {
      labels: compareBandwidthLabels,
      series: [compareBandwidthValues]
    }, bandwidthOptions)

    var latencyOptions = {
      fullWidth: true,
      height: 450,
      axisY: {
        labelInterpolationFnc: function (value) {
          return (Number(value).toPrecision(2) + 'ms')
        }
      },
      chartPadding: 30
    }
    var compareLatencyValues = []
    var compareLatencyLabels = []
    compareLatencyValues.push(results.latency.average)
    compareLatencyLabels.push(results.finish)
    compare.forEach(function (value) {
      compareLatencyValues.push(value.latency.average)
      compareLatencyLabels.push(value.finish)
    })
    chartist.Bar('.chart-latency-barchart', {
      labels: compareLatencyLabels,
      series: [compareLatencyValues]
    }, latencyOptions)

    var errorOptions = {
      fullWidth: true,
      height: 450,
      axisY: {
        labelInterpolationFnc: function (value) {
          return value
        }
      },
      chartPadding: 30
    }
    var compareErrorValues = []
    var compareErrorLabels = []
    var compareTimeoutValues = []
    compareErrorValues.push(results.errors)
    compareErrorLabels.push(results.finish)
    compare.forEach(function (value) {
      compareErrorValues.push(value.errors)
      compareTimeoutValues.push(value.timeouts)
      compareErrorLabels.push(value.finish)
    })
    chartist.Bar('.chart-error-barchart', {
      labels: compareErrorLabels,
      series: [compareErrorValues, compareTimeoutValues]
    }, errorOptions)
  }
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

function prettyBytes (num) {
  if (typeof num !== 'number' || Number.isNaN(Number(num))) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var exponent
  var unit
  var neg = num < 0
  var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]

  return (neg ? '-' : '') + num + '' + unit
}
