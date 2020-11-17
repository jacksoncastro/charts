import S3Bucket from './s3-singleton';
import Functions from './functions';

export default class Median {

    private folder: string;
    private test: string;

    constructor(folder: string, test: string) {
        this.folder = folder;
        this.test = test;
    }

    public calcule() {
        const promise = S3Bucket.listObjects(`${this.folder}/${this.test}`);
        promise.then(items => {
            return items.filter(item => /avg-*\d*.csv/.test(item));
        }).then(items => {
            return Promise.all(
                items.map(item => S3Bucket.getObjectS3(item))
            );
        }).then(csvs => {
            return csvs.reduce((previous, csv) => {
                csv.split('\n').slice(1).forEach(line => {
                    const data = line.split(',');
                    const key = `${data[0]} -> ${data[1]}`.replace(/"/g, '');
                    const value = parseFloat(data[2]);
                    previous[key] = [...previous[key] || [], value];
                });
                return previous;
            }, {});
        })
        .then(data => {
            const medians = Object.entries(data)
                .map(([key, values]) => {
                    if (values instanceof Array) {
                        return {
                            'origin/target': key,
                            median: Functions.getMedian(values)
                        };
                    }
                });
            Functions.saveFileCSV(medians, '/tmp/medians.csv');
        });
    }
}