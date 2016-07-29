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
  var labels = ['1xx', '2xx', '3xx', '4xx', '5xx', 'timeouts']
  var nonZeros = []
  var seriesValues = []
  labels.forEach(function (label) {
    if (results[label] !== 0) {
      nonZeros.push(label)
      seriesValues.push(results[label])
    }
  })
  var total = seriesValues.reduce(function (v, x) { return v + x }, 0)
  var options = {
    fullWidth: true,
    height: 450,
    labelInterpolationFnc: function (value) {
      return value + ' (' + Math.round(results[value] / total * 100) + '%)'
    }
  }
  chartist.Pie('.ct-chart-responses', {
    labels: nonZeros,
    series: seriesValues
  }, options)

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
  }, {
    fullWidth: true,
    height: 450
  })

  var lineOptions = {
    fullWidth: true,
    height: 450,
    axisY: {
      offset: 70,
      labelInterpolationFnc: function (value) {
        return (value) + 'ms'
      }
    }
  }

  var lineValues = [results.latency.min, results.latency.average,
    results.latency.p50, results.latency.p75,
     results.latency.p90, results.latency.p99, results.latency.p999, results.latency.p9999, results.latency.p99999]
  chartist.Bar('.ct-bar', {
    labels: ['min', 'average', '50%', '75%', '90%', '99%', '99.9%', '99.99%', '99.999%'],
    series: [lineValues]
  }, lineOptions)

  // if compare array isn't used, return early
  if (!compare) return

  var requestOptions = {
    fullWidth: true,
    height: 450,
    axisY: {
      offset: 100,
      labelInterpolationFnc: function (value) {
        return (value) + ' reqs/sec'
      }
    },
    low: 0
  }
  var compareRequestValues = []
  var compareRequestLabels = []
  compareRequestValues.push(results.requests.average)
  compareRequestLabels.push(results.finish)
  compare.forEach(function (value) {
    compareRequestValues.push(value.requests.average)
    compareRequestLabels.push(value.finish)
  })
  chartist.Line('.chart-request-linechart', {
    labels: compareRequestLabels.reverse(),
    series: [compareRequestValues.reverse()]
  }, requestOptions)

  var bandwidthOptions = {
    fullWidth: true,
    height: 450,
    axisY: {
      offset: 100,
      labelInterpolationFnc: function (value) {
        return prettyBytes(value) + '/sec'
      }
    },
    low: 0
  }
  var compareBandwidthValues = []
  var compareBandwidthLabels = []
  compareBandwidthValues.push(results.requests.average)
  compareBandwidthLabels.push(results.finish)
  compare.forEach(function (value) {
    compareBandwidthValues.push(value.requests.average)
    compareBandwidthLabels.push(value.finish)
  })
  chartist.Line('.chart-bandwidth-linechart', {
    labels: compareBandwidthLabels.reverse(),
    series: [compareBandwidthValues.reverse()]
  }, bandwidthOptions)

  var latencyOptions = {
    fullWidth: true,
    height: 450,
    axisY: {
      offset: 100,
      labelInterpolationFnc: function (value) {
        return (Number(value).toPrecision(2) + ' ms')
      }
    },
    low: 0
  }
  var compareLatencyValues = []
  var compareLatencyLabels = []
  compareLatencyValues.push(results.latency.average)
  compareLatencyLabels.push(results.finish)
  compare.forEach(function (value) {
    compareLatencyValues.push(value.latency.average)
    compareLatencyLabels.push(value.finish)
  })
  chartist.Line('.chart-latency-linechart', {
    labels: compareLatencyLabels.reverse(),
    series: [compareLatencyValues.reverse()]
  }, latencyOptions)

  var errorOptions = {
    stackBars: true,
    fullWidth: true,
    height: 450,
    chartPadding: {
      left: 30
    }
  }
  var compareErrorValues = []
  var compareErrorLabels = []
  var compareTimeoutValues = []
  compareErrorValues.push(results.errors - results.timeouts)
  compareTimeoutValues.push(results.timeouts)
  compareErrorLabels.push(results.finish)
  compare.forEach(function (value) {
    compareErrorValues.push(value.errors - value.timeouts)
    compareTimeoutValues.push(value.timeouts)
    compareErrorLabels.push(value.finish)
  })
  chartist.Bar('.chart-error-barchart', {
    labels: compareErrorLabels.reverse(),
    series: [compareTimeoutValues.reverse(), compareErrorValues.reverse()]
  }, errorOptions)
}

function growDiv (e) {
  var header = e
  var objectContainer = header.parentElement
  var symbol = objectContainer.getElementsByClassName('symbol')[0]
  var content = objectContainer.getElementsByClassName('content')[0]
  var wrapper = content.getElementsByClassName('measuringWrapper')[0]
  if (content.clientHeight > 20) {
    content.style.height = 0
    content.style.padding = '2px'
    symbol.innerText = '+'
  } else {
    content.style.height = wrapper.clientHeight + 'px'
    content.style.padding = '20px'
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

  return (neg ? '-' : '') + num + ' ' + unit
}
