import arraySort from 'array-sort';
import Functions from '../functions';
import exporter from 'highcharts-export-server';

import { Groups, Parameter } from '..';
import Constants from '../constants';


export default abstract class BaseChart {

    protected groups: Groups;
    protected parameters: Parameter[];
    protected categories: string[];

    constructor(groups: Groups, parameters: Parameter[], categories: string[]) {
        this.groups = groups;
        this.parameters = parameters;
        this.categories = categories;
    }

    public abstract generate(): Promise<void>;

    protected abstract getName(): string;

    protected abstract getOptions(series: {}[]): {};

    protected buildSeries(plots: {}, order: string[]) {
        const series = Object.entries(plots).map(([name, data]) => {
            if (name === Constants.OUTLIERS) {
                return {
                    name,
                    showInLegend: false,
                    type: 'scatter',
                    marker: {
                        fillColor: 'transparent',
                        lineWidth: 1,
                        lineColor: 'red',
                        radius: 2
                    },
                    data
                };
            }

            if (name === Constants.AGGREGATE) {
                return {
                    name,
                    color: '#492970',
                    type: 'spline',
                    data
                };
            }

            return {
                name,
                data
            };
        });
        return Functions.sortByArray(series, order, 'name');
    }

    protected async buildChart(series: {}[]): Promise<void> {

        const options = this.getOptions(series);

        const settings = {
            type: 'png',
            // sourceHeight: 1,
            scale: 5,
            options
        };

        const path = `/tmp/${this.getName()}.png`;
        const base64 = await this.exportChart(settings);
        return Functions.saveFile(base64, path);

    }

    private exportChart(settings: {}) {

        exporter.initPool();

        return new Promise<string>((resolve, reject) => {
            exporter.export(settings, (error: any, res: any) => {
                exporter.killPool();
                if (error) {
                    reject(error);
                }
                resolve(res.data);
            });
        });
    }

    protected buildCSV(series: {}) {
        const data = Object.entries(series).reduce((previous, [key, values]) => {
            if (values instanceof Array) {
                const items = values.map((value, index) => {
                    return {
                        category: this.categories[index],
                        type: key,
                        value: (value instanceof Array) ? Functions.getMedian(value): value
                    };
                });

                return [...previous, ...items];
            }
        }, []);

        const sorted = arraySort(data, ['category', 'type']);

        Functions.saveFileCSV(sorted, `/tmp/${this.getName()}.csv`)
    }
}
