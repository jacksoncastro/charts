import S3Bucket from './s3-singleton';

import {
    Parameter,
    Metrics,
    KeyValue,
    Groups,
    SpeedupRealVirtual,
    VirtualSpeedupRate,
    VirtualSpeedupError
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

            previous[current.category] = metrics;
            return previous;
        }, {});

        this.charts(groups);
    }

    private charts(groups: Groups) {
        const categories = this.parameters.map(parameter => parameter.category);
        const speedupRealVirtual = new SpeedupRealVirtual(groups, this.parameters, categories);
        const virtualSpeedupRate = new VirtualSpeedupRate(groups, this.parameters, categories);
        const virtualSpeedupError = new VirtualSpeedupError(groups, this.parameters, categories);

        // speedupRealVirtual.generate();
        // virtualSpeedupRate.generate();
        virtualSpeedupError.generate();
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
}

export default Chart;
