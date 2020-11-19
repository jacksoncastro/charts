import BaseChart from './base-chart';
import Functions from '../functions';
import Constants from '../constants';

export class VirtualSpeedupRate extends BaseChart {

    protected getName(): string {
        return 'virtual-speedup-rate';
    }

    public generate(): Promise<void> {
        const groups = Object.values(this.groups).reduce((previous, value) => {
            const rpss = value.reduce((p, current) => {
                p[current.key] = [...p[current.key] || [], current.rps];
                return p;
            }, {});

            Object.entries(rpss).forEach(([key, values]) => {
                if (values instanceof Array) {
                    previous[key] = [...previous[key] || [], Functions.getPlot(values)];
                }
            });

            return previous;
        }, {});

        const series = this.buildSeries(groups, [ Constants.NT, Constants.ATS, Constants.DT, Constants.DTS ]);

        return this.buildChart(series);
    }

    protected getOptions(series: {}[]): {} {
        return {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: 'Virtual Speedup Session'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.categories,
                gridLineWidth: 1,
                title: {
                    text: 'No. Users'
                    // text: 'RPS (expected)'
                },
                labels: {
                    style: {
                        fontSize: '6px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Session (actual)'
                },
                // min: 0,
                // max: 60
            },
            series
        };
    }
}