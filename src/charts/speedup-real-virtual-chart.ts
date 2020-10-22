import BaseChart from './base-chart';
import Functions from '../functions';
import Constants from '../constants';

import {
    Metrics,
    Iteration,
    Speedup
} from '..';

export class SpeedupRealVirtual extends BaseChart {

    protected getName(): string {
        return 'speedup-real-virtual';
    }

    public generate(): void {

        const data = Object.entries(this.groups).reduce((previous, [key, metrics]) => {

            const iterations = this.getIterations(metrics);

            const speedups = this.getSpeedups(iterations);

            const plotSpeedups = this.getPlotSpeedups(speedups);

            previous[key] = [...previous[key] || [], plotSpeedups];

            return previous;
        }, {});

        const plots = Object.values(data).reduce((previous, value) => {
                Object.values(value).forEach(items => {
                    Object.entries(items).forEach(([key, values]) => {
                        previous[key] = [...previous[key] || [] , values];
                    });
                });
            return previous;
        }, {});

        const series = this.buildSeries(plots);

        this.buildChart(series);
    }

    protected getOptions(series: {[key: string]: number[]}): {} {
        return {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: 'Speedup (Real vs Virtual)'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.categories,
                gridLineWidth: 1,
                title: {
                    // text: 'No. Users'
                    text: 'Rate'
                }
            },
            yAxis: {
                title: {
                    text: 'Performance Gain'
                },
                min: 0,
                max: 1
            },
            series
        };
    }

    private getIterations(metrics: Metrics[]): Iteration[][] {
        return metrics.reduce((previous, current) => {
            const round = current.round - 1;
            const data = {
                key: current.key,
                iteration: current.iteration
            };
            previous[round] = [...previous[round] || [], data];
            return previous;
        }, []);
    }

    private getSpeedups(iterations: Iteration[][]): Speedup[] {

        return iterations.map(metric => {

            const nt = this.getIterationByKey(metric, Constants.NT);
            const ats = this.getIterationByKey(metric, Constants.ATS);
            const dt = this.getIterationByKey(metric, Constants.DT);
            const dts = this.getIterationByKey(metric, Constants.DTS);
            const atsLimited = this.getIterationByKey(metric, Constants.ATS_LIMITED);
            const dtsLimited = this.getIterationByKey(metric, Constants.DTS_LIMITED);

            const rs = Functions.calculeRS(nt, ats);
            const vs = Functions.calculeVS(nt, dt, dts);

            const rsLimeted = Functions.calculeRS(nt, atsLimited);
            const vsLimeted = Functions.calculeVS(nt, dt, dtsLimited);

            const data = {
                rs,
                vs
            };

            if (vsLimeted && rsLimeted) {
                Object.assign(
                    data, {
                        'vs (limited)': vsLimeted,
                        'rs (limited)': rsLimeted
                    }
                );
            }

            return data;
        });
    }

    private getPlotSpeedups(speedups: Speedup[]) {
        const group = Functions.group(speedups);
        return Object.entries(group)
            .reduce((previous, [key, value]) => {
                previous[key] = Functions.getPlot(value);
                return previous;
            }, {});
    }

    private getIterationByKey<T extends Iteration>(data: T[], key: string): number {

        const find = data.find(row => row.key === key);

        if (find) {
            return find.iteration;
        }
    }
}