import fs from 'fs';
import exporter from 'highcharts-export-server';

import { Groups, Parameter } from '..';


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

    protected abstract getOptions(series: {[key: string]: number[]}): {};

    protected buildSeries(plots: {}) {
        return Object.entries(plots)
            .sort(([first], [second]) => first.localeCompare(second))
            .map(([key, data]) => {
            return {
                name: key,
                // color: '#7cb5ec',
                data
            };
        });
    }

    protected async buildChart(series: {}): Promise<void> {

        const options = this.getOptions(series);

        const settings = {
            type: 'png',
            options
        };

        const path = `/tmp/${this.getName()}.png`;
        const base64 = await this.exportChart(settings);
        return this.saveFile(base64, path);

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

    private saveFile(base64: string, path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, base64, 'base64', (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            })
        });
    }
}
