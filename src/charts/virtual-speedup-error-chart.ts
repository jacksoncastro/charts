import BaseChart from './base-chart';
import Functions from '../functions';
import Constants from '../constants';

export class VirtualSpeedupError extends BaseChart {

    protected getName(): string {
        return 'virtual-speedup-error';
    }

    public generate(): Promise<void> {
        const groups = Object.values(this.groups).reduce((previous, values) => {
            const errors = values.reduce((p, current) => {
                p[current.key] = [...p[current.key] || [], current.iteration];
                return p;
            }, {});

            if (errors[Constants.NT]
                && errors[Constants.ATS]
                && errors[Constants.DT]
                && errors[Constants.DTS]) {

                const items = errors[Constants.NT].reduce((p, current, index: number) => {

                    const rs = Functions.calculeRS(current, errors[Constants.ATS][index]);
                    const vs = Functions.calculeVS(current, errors[Constants.DT][index], errors[Constants.DTS][index]);

                    const error = Functions.calculeError(rs, vs);

                    p.error = [...p.error || [], error];

                    return p;
                }, {});

                Object.entries(items).forEach(([key, value]) => {
                    if (value instanceof Array) {
                        previous[key] = [...previous[key] || [], Functions.getMedian(value)];
                    }
                })
            }

            return previous;
        }, {});

        const series = this.buildSeries(groups);

        return this.buildChart(series);
    }

    protected getOptions(series: {[key: string]: number[]}): {} {
        return {
            title: {
                text: 'Virtual Speedup Error'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                title: {
                    text: 'No. Users'
                },
                categories: this.categories
            },
            yAxis: {
                title: {
                    text: 'Percentil'
                },
                tickInterval: 2,
                min: -20,
                max: 20
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            series
        };
    }
}