import S3Bucket from './s3-singleton';
import Functions from './functions';

import {
    Parameter,
    Metrics,
    KeyValue,
    Groups,
    SpeedupRealVirtual
} from './';

const SUMMARY_JSON_PATTERN = /summary-*\d*.json/;
const SUMMARY_PATTERN = /\/(\w+\+?)\/summary-(\d+)/;

class Chart {

    private parameters: Parameter[];

    constructor(parameters: Parameter[]) {
        this.parameters = parameters;
    }

    public async init() {

        const files = await this.getFiles();

        const categories = files.map(async property => {

            const keys = property.files.filter(item => SUMMARY_JSON_PATTERN.test(item));

            const summaries = await this.getSummaries(keys);

            return {
                category: property.category,
                summaries
            };
        }, []);

        const promises = await Promise.all(categories);

        const groups = promises.reduce((previous, current) => {

            const metrics = this.getMetrics(current.summaries);

            // const iterations = this.getIterations(metrics);

            // const speedups = this.getSpeedups(iterations);

            // const plotSpeedups = this.getPlotSpeedups(speedups);

            // const rpss = this.getRPSs(metrics);

            // const data = {
            //     speedups: plotSpeedups,
            //     rpss
            // };

            previous[current.category] = metrics;
            return previous;
        }, {});

        this.charts(groups);
    }

    private charts(groups: Groups) {
        const categories = this.parameters.map(parameter => parameter.category);
        const speedupRealVirtual = new SpeedupRealVirtual(groups, this.parameters, categories);
        speedupRealVirtual.generate();
    }

    private getRPSs(metrics: Metrics[]): {[key: string]: number[]} {
        const group: {[key: string]: number[]} = metrics.reduce((previous, current) => {
            previous[current.key] = [...previous[current.key] || [], current.rps];
            return previous;
        }, {});

        return Object.entries(group)
            .reduce((previous, [key, value]) => {
                previous[key] = Functions.getPlot(value);
                return previous;
            }, {});
    }

    private async getFiles(): Promise<{category: string, files: string[]}[]> {
        return Promise.all(
            this.parameters.map(parameter => {
                return new Promise<{category: string, files: string[]}>(resolve => {
                    S3Bucket.listObjects(parameter.folder).then(files => {
                        resolve({
                            category: parameter.category,
                            files
                        });
                    });
                });
            })
        );
    }

    private getSummaries(keys: string[]): Promise<KeyValue<string>[]> {
        return Promise.all(
            keys.map(key => {
                return new Promise<KeyValue<string>>(resolve => {
                    S3Bucket.getObjectS3(key).then(value => {
                        const keyValue = {
                            key,
                            value
                        };
                        resolve(keyValue);
                    });
                });
            })
        );
    }

    private getMetrics(summaries: KeyValue<string>[]): Metrics[] {

        return summaries.map(summary => {

            const matches = summary.key.match(SUMMARY_PATTERN);
            const parse = JSON.parse(summary.value);

            return {
                key: matches[1],
                round: parseInt(matches[2], 10),
                iteration: parse.metrics.session_duration.med,
                rps: parse.metrics.http_reqs.rate
            };
        });
    }

    // private getMetricsGroup(summaries: KeyValue<string>[]): MetricsGroup[] {

    //     return summaries.map(summary => {

    //         const matches = summary.key.match(SUMMARY_PATTERN);
    //         const parse = JSON.parse(summary.value);

    //         return {
    //             key: matches[1],
    //             iteration: parse.metrics.session_duration.med,
    //             rps: parse.metrics.http_reqs.rate
    //         };
    //     })
    //     .reduce((previous, current) => {
    //         const key = current.key;
    //         delete current.key;
    //         previous[key] = [...previous[key] || [], current];
    //         return previous;
    //     }, []);
    // }

    // private getPlots(metricsGroup: MetricsGroup[]): Plot[] {
    //     const entries = Object.entries(metricsGroup);
    //     entries.reduce((previous, [key, metrics]) => {
    //         console.log(metrics)
    //         return previous;
    //     }, []);

    //     return entries
    //             .reduce((previous, [key, metrics]) => {
    //                 if (metrics instanceof Array) {

    //                     const iterations = this.extractItem(metrics, 'iteration');
    //                     const rps = this.extractItem(metrics, 'rps');

    //                     previous[key] = {
    //                         iteration: this.getPlot(iterations),
    //                         rps: this.getPlot(rps)
    //                     };

    //                     return previous;
    //                 }
    //                 throw new Error('No array found');
    //             }, []);
    // }

    // private extractItem(data: any[], item: string) {
    //     return data.reduce((previous, current) => {
    //         previous.push(current[item]);
    //         return previous;
    //     }, []);
    // }
}

export default Chart;
