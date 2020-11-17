import BaseChart from './base-chart';
import Functions from '../functions';

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

        const series = this.buildSeries(groups);

        return this.buildChart(series);
    }

    protected getOptions(series: {[key: string]: number[]}): {} {
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