const fs = require('fs');
const AWS = require('aws-sdk');
const percentile = require('percentile');
const exporter = require('highcharts-export-server');

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const BUCKET_NAME = 'hipstershop-k6';

function getS3() {
    return new AWS.S3({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY
    });
}

function getObjectS3(key) {
    var parameters = {
        Bucket: BUCKET_NAME,
        Key: key
    };

    return new Promise((resolve, reject) => {
        getS3().getObject(parameters, function(error, data) {
            if (error) {
                Promise.reject(new Error(error));
            }

            if (data && data.Body) {
                resolve(data.Body.toString('utf-8'));
            } else {
                reject();
            }
        });
    });
}

function getTests(prefix) {

    const parameters = {
        Bucket: BUCKET_NAME,
        Prefix: prefix
    };

    return new Promise((resolve, reject) => {
        getS3().listObjectsV2(parameters, async function(error, data) {
            if (error) {
                reject(new Error(error));
            } else {
                try {
                    const keys = data.Contents
                    .filter(item => /summary-*\d*.json/.test(item.Key))
                    .map(item => item.Key);
    
                    const tests = await Promise.all(
                        keys.map(async key => {
                            const content = await getObjectS3(key);
                            const parse = JSON.parse(content);

                            const matches = key.match(/\/(\w+)\/summary-(\d+)/);

                            return {
                                iteration: parseInt(matches[2]),
                                key: matches[1],
                                med: parse.metrics.iteration_duration.med
                            };
                        })
                    );

                    resolve(tests);
                } catch(e) {
                    reject(new Error(e));
                }
            }
        });
    });
}

function calculeRS(nt, at) {
    return (nt - at) / nt;
}

function calculeVS(nt, dt, dtsi) {
    return (dt - dtsi) / nt;
}

function getRowByKey(data, key) {
    return data.find(row => row.key === key);
}

function calculeSpeedup(test, metric) {

    const rowNT = getRowByKey(test, 'NT');
    const rowAT = getRowByKey(test, 'AT');
    const rowDT = getRowByKey(test, 'DT');
    const rowDTSi = getRowByKey(test, 'DTSi');

    const nt = rowNT[metric];
    const at = rowAT[metric];
    const dt = rowDT[metric];
    const dtsi = rowDTSi[metric];

    const rs = calculeRS(nt, at);
    const vs = calculeVS(nt, dt, dtsi);

    return {
        rs: rs,
        vs: vs
    };
}

function getPlot(data) {

    const sort = data.sort();
    const min = sort[0];
    const max = sort[sort.length-1];
    const quartis = percentile([25, 50, 75], data);

    return [ min, ...quartis, max ];
}

function buildSeries(plots) {
    return Object.entries(plots)
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([key, data]) => {
        return {
            name: key,
            // color: '#7cb5ec',
            data: data,
            tooltip: {
                headerFormat: '<em>Users No. {point.key}</em><br/>'
            }
        };
    });
}

function getPlotGroup(data, metric) {

    const mapper = data.map(row => row[metric]);
    const rs = mapper.map(row => row.rs);
    const vs = mapper.map(row => row.vs);

    const rsPlot = getPlot(rs);
    const vsPlot = getPlot(vs);

    return [
        {
            name: 'RS',
            data: rsPlot
        },
        {
            name: 'VS',
            data: vsPlot
        }
    ];
}

function calcule(tests) {

    const data = Object.keys(tests).map(key => {
        const med = calculeSpeedup(tests[key], 'med');
        return { med };
    });

    return getPlotGroup(data, 'med');

}

async function begin() {
    // '2020-10-07-21-02-38'; // 1 usuários
    // '2020-10-08-14-25-26'; // 10 usuários
    // '2020-10-08-17-00-40'; // 20 usuários
    // '2020-10-08-20-56-31'; // 40 usuários
    
    const parameters = {
        categories: [ '1', '10', '20', '40' ],
        folders: [ '2020-10-07-21-02-38', '2020-10-08-14-25-26', '2020-10-08-17-00-40', '2020-10-08-20-56-31' ]
    };

    const tests = await Promise.all(

        parameters.folders.map(async folder => {

            const iterations = await getTests(folder);

            return iterations.reduce((previous, current) => {
                const result = [];
                const item = { key: current.key, med: current.med };
                result[current.iteration] = [...previous[current.iteration] || [], item];
    
                return Object.assign({}, previous, result);
            }, {});
        })
    );

    
    const plots = tests
        .map(calcule)
        .map(item => {
            return item.reduce((previous, current) => {
                const result = [];
                result[current.name] = [...previous[current.name] || [], current.data];
                return Object.assign({}, result, previous);
            }, {});
        })
        .reduce((previous, current) => {
            const result = [];
            result['VS'] = [... previous['VS'] || [], current['VS'][0]];
            result['RS'] = [... previous['RS'] || [], current['RS'][0]];
            return Object.assign({}, previous, result);
        }, {});

    const series = buildSeries(plots);
    boxPlot(series, parameters.categories);
}

function boxPlot(series, categories) {
    var exportSettings = {
        type: 'png',
        options: {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: 'Speedup (Real vs Virtual)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories,
                // gridLineWidth: 1,
                title: {
                    text: 'No. Users'
                }
            },
            yAxis: {
                title: {
                    text: 'Performance Gain'
                },
                min: 0,
                max: 1
            },
            series: series
        }
    };

    // Set up a pool of PhantomJS workers
    exporter.initPool();

    // Perform an export
    exporter.export(exportSettings, function (error, res) {
        fs.writeFile("/tmp/out.png", res.data, 'base64', function(err) {
            // Kill the pool when we're done with it, and exit the application
            exporter.killPool();
            process.exit(1);
        })
    });
}

begin();
