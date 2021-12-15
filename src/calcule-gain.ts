// tslint:disable:no-console

import S3Bucket from './s3-singleton';
import percentile from 'percentile';
import arraySort from 'array-sort';
import { Parser } from 'json2csv';

export default class CalculeGain {

    public calcule() {
        S3Bucket.listObjects('FLIGHT-CACHING-10-USERS-100-ITERATIONS-10-ROUNDS/').then(list => {
            const promises = list
                .filter(item => item.endsWith('.csv'))
                .filter(item => item.match(/request_duration_average/g))
                .filter(item => item.match(/NT/g))
                .map(item => {
                    return S3Bucket.getObjectS3(item)
                        .then(this.csvToArray);
                });

            const metrics = Promise.all(promises).then(items => {
                const data = Array();
                items.forEach(metric => {
                    metric.forEach(item => {
                        let key = item['"source_canonical_service"'] + ' -> ' + item['"destination_service"'];
                        key = key.replace(/"/g, '');
                        const value = Number(item['"value"'].replace(/"/g, ''));
                        if (data[key] === undefined) {
                            data[key] = [];
                        }
                        data[key].push(value);
                    })
                })
                return data;
            });

            metrics.then(data => {
                const fff = [];
                Object.entries(data).sort((one, two) => (one > two ? -1 : 1)).forEach(([key, value]) => {
                    const min = percentile([ 0 ], value);
                    const med = percentile([ 50 ], value);
                    const max = percentile([ 100 ], value);

                    const split = key.split(' -> ');
                    const source = split[0];
                    const target = split[1];

                    fff.push({
                        source,
                        target,
                        med,
                        min,
                        max
                    });
                })
                this.printCSV(fff);
            })
        });
    }

    public calculeAgregate() {
        S3Bucket.listObjects('FLIGHT-CACHING-100-USERS-1000-ITERATIONS-10-ROUNDS-V6/').then(list => {
            const promises = list
                .filter(item => item.endsWith('.csv'))
                .filter(item => item.match(/request_duration_average_aggregate/g))
                .filter(item => item.match(/\/AT\//g))
                .map(item => {
                    return S3Bucket.getObjectS3(item)
                        .then(this.csvToArray);
                });

            const metrics = Promise.all(promises).then(items => {
                const data = Array();
                items.forEach(metric => {
                    metric.forEach(item => {
                        let key = item['"destination_service"'];
                        key = key.replace(/"/g, '');
                        const value = Number(item['"value"'].replace(/"/g, ''));
                        if (data[key] === undefined) {
                            data[key] = [];
                        }
                        data[key].push(value);
                    })
                })
                return data;
            });

            metrics.then(data => {
                const fff = [];
                Object.entries(data).sort((one, two) => (one > two ? -1 : 1)).forEach(([target, value]) => {
                    const min = percentile([ 0 ], value);
                    const med = percentile([ 50 ], value);
                    const max = percentile([ 100 ], value);

                    fff.push({
                        target,
                        med,
                        min,
                        max
                    });
                })
                this.printCSV(fff);
            })
        });
    }

    private printCSV(data: {}) {
        const json2csvParser = new Parser({ delimiter: ',' });
        const csv = json2csvParser.parse(data);
        console.log(csv)
    }


    private csvToArray(text: string, delimiter = ',') {

        const headers = text.slice(0, text.indexOf('\n')).split(delimiter);

        const rows = text.slice(text.indexOf('\n') + 1).split('\n');

        const arr = rows.map((row: string) => {
            const values = row.split(delimiter);
            return headers.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
        });

        arr.pop();
        return arr;
    }

    public count() {
        S3Bucket.listObjects('FLIGHT-CACHING-10/').then(list => {
            const promises = list
                .filter(item => item.endsWith('.csv'))
                .filter(item => item.match(/bytes_received/g))
                .filter(item => item.match(/NT/g))
                .map(item => {
                    return S3Bucket.getObjectS3(item)
                        .then(this.csvToArray);
                });

            const metrics = Promise.all(promises).then(items => {
                const data = Array();
                items.forEach(count => {
                    count.forEach(item => {
                        // let key = item['"source_app"'] + ' -> ' + item['"destination_service"'];
                        let key = item['"source_canonical_service"'] + ' -> ' + item['"destination_service_name"'];
                        key = key.replace(/"/g, '');
                        const value = Number(item['"value"'].replace(/"/g, ''));
                        if (data[key] === undefined) {
                            data[key] = [];
                        }
                        data[key].push(value);
                    })
                })
                return data;
            });

            metrics.then(data => {
                const fff = Array();
                Object.entries(data).forEach(([key, value]) => {
                    const split = key.split(' -> ');
                    const source = split[0];
                    const target = split[1];
                    fff.push({
                        source,
                        target,
                        min: percentile([ 0 ], value),
                        med: percentile([ 50 ], value),
                        max: percentile([ 100 ], value)
                    })
                })
                this.printCSV(fff)
            })
        });
    }
}