import BaseChart from './base-chart';
import Functions from '../functions';
import Constants from '../constants';

export class VirtualSpeedupError extends BaseChart {

    protected getName(): string {
        return 'virtual-speedup-error';
    }

    public generate(): void {
        const groups = Object.values(this.groups).reduce((previous, values) => {
            const errors = values.reduce((p, current) => {
                p[current.key] = [...p[current.key] || [], current.iteration];
                return p;
            }, {});

            if (errors[Constants.NT]
                && errors[Constants.ATS]
                && errors[Constants.DT]
                && errors[Constants.DTS]) {

                const x = errors[Constants.NT].reduce((p, current, index: number) => {

                    const rs = Functions.calculeRS(current, errors[Constants.ATS][index]);
                    const vs = Functions.calculeVS(current, errors[Constants.DT][index], errors[Constants.DTS][index]);

                    const rsLimited = Functions.calculeRS(current, errors[Constants.ATS_LIMITED][index]);
                    const vsLimited = Functions.calculeVS(current, errors[Constants.DT][index], errors[Constants.DTS_LIMITED][index]);

                    const error = Functions.calculeError(rs, vs);
                    const errorLog = Functions.calculeErrorLog(rs, vs);

                    const errorLimited = Functions.calculeError(rsLimited, vsLimited);
                    const errorLogLimited = Functions.calculeErrorLog(rsLimited, vsLimited);

                    p.error = [...p.error || [], error];
                    p.errorLog = [...p.errorLog || [], errorLog];

                    p.errorLimited = [...p.errorLimited || [], errorLimited];
                    p.errorLogLimited = [...p.errorLogLimited || [], errorLogLimited];

                    return p;
                }, {});

                Object.entries(x).forEach(([key, value]) => {
                    if (value instanceof Array) {
                        previous[key] = [...previous[key] || [], Functions.getMedian(value)];
                    }
                })
            }

            return previous;
        }, {});

        const series = this.buildSeries(groups);

        this.buildChart(series);
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
                min: -100,
                max: 100
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