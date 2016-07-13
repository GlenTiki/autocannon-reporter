# Autocannon-reporter

A simple html reporter for autocannon.

## Usage

### Command Line

On *nix systems, you can use pipes:

```
$ autocannon -j http://localhost:3000 | autocannon-reporter
Running 10s test @ http://localhost:3000
10 connections

Stat         Avg     Stdev Max
Latency (ms) 0.13    0.55  14
Req/Sec      15276   0     15279
Bytes/Sec    1.67 MB 0 B   1.7 MB

15k requests in 1s, 1.7 MB read
Report written to:  /some/*nix/path/report.html
```

On windows, you can supply a file to read
```
$ autocannon-reporter -i ./report.json
Report written to:  C:/some/windows/path/report.html
```

### Programmatically

This tool can also be used programmatically

```js
  var autocannon = require('autocannon')
  var reporter = require('autocannon-reporter')
  var path = require('path')
  var reportOutputPath = path.join(process.cwd, 'report.html')

  autocannon({
    url: 'http://localhost:3000'
  }, (err, result) => {
    if (err) throw err

    reporter.buildReport(result) // the html structure
    reporter.writeReport(result, reportOutputPath, (err, res) => {
      if (err) console.err('Error writting report: ', err)
      else console.log('Report written to: ', reportOutputPath)
    }) //write the report
  })
```

## API

### Command line
```
Usage: autocannon-reporter [opts]

Outputs a report at ./report.html

Available options:

  -i/--input FILE
        The path to the json results. Required when not piping into this tool.
  -v/--version
        Print the version number.
  -h/--help
        Print this menu.
```

### Programatically

#### buildReport(result)

* `result`: The result of an autocannon run. `Object`. _Required_

Returns a string of html representing the results


#### writeReport(report, path[, cb])

* `report`: The report returned from `buildReport`. _Required_
* `path`: The full path to the output file/report. _Required_
* `cb`: A function that is called on finishing writing to the file. Passed an `err` param if it failed.

## Todo

- [ ] TESTS
- [ ] Pretty styling
- [ ] Generate pretty html for throughput and latency (use chartist?)
- [ ] Generate charts for throughput and latency
- [ ] Generate a bar chart for the reponse types (1xx, 2xx, 3xx, 4xx, 5xx)
- [ ] Pie chart, showing the amount of error, and how many of them were timeouts
- [ ] Possibly add the ability to enter multiple results and generate multiple reports on the same page, with comparisons between them?

## License

[MIT](./LICENSE). Copyright (c) 2016 Glen Keane and other contributors.
