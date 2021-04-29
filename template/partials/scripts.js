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
  var compareValues = []
  var compareResults = []
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  labels.forEach(function (label) {
    compare.forEach(function(value) {compareValues.push(value[label])})
    compareResults[label] = compareValues.reduce(reducer)
    if (results[label] !== 0 || compareResults[label] != 0) {
      nonZeros.push(label)
      compareValues = []
      seriesValues.push(compareResults[label] + results[label])
    }
  })
  var total = seriesValues.reduce(reducer)
  var options = {
    fullWidth: true,
    height: 450,
    labelInterpolationFnc: function (value) {
      return value + ' (' + Math.round((results[value] + compareResults[value]) / total * 100) + '%)'
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
     results.latency.p90, results.latency.p99, results.latency.p99_9]

  if (compare) {
    var compareValues = []
    compare.forEach(function (value) {
      compareValues.push([value.latency.min, value.latency.average,
         value.latency.p50, value.latency.p75,
         value.latency.p90, value.latency.p99, value.latency.p99_9])
    })
    compareValues.push(lineValues)

    chartist.Bar('.ct-bar', {
      labels: ['min', 'average', '50%', '75%', '90%', '99%', '99.9%'],
      series: compareValues.reverse()
    }, lineOptions)
  } else {
    chartist.Bar('.ct-bar', {
      labels: ['min', 'average', '50%', '75%', '90%', '99%', '99.9%'],
      series: [lineValues]
    }, lineOptions)
      // if compare array isn't used, return early
      return
  }

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
  compare.forEach(function (value) {
    compareRequestValues.push(value.requests.average)
    compareRequestLabels.push(value.finish)
  })
  compareRequestValues.push(results.requests.average)
  compareRequestLabels.push(results.finish)
  chartist.Line('.chart-request-linechart', {
    labels: compareRequestLabels.reverse(),
    series: [compareRequestValues.reverse()]
  }, requestOptions)

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
  compare.forEach(function (value) {
    compareLatencyValues.push(value.latency.average)
    compareLatencyLabels.push(value.finish)
  })
  compareLatencyValues.push(results.latency.average)
  compareLatencyLabels.push(results.finish)
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
  compare.forEach(function (value) {
    compareErrorValues.push(value.errors - value.timeouts)
    compareTimeoutValues.push(value.timeouts)
    compareErrorLabels.push(value.finish)
  })
  compareErrorValues.push(results.errors - results.timeouts)
  compareTimeoutValues.push(results.timeouts)
  compareErrorLabels.push(results.finish)
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
