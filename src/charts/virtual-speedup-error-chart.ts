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
                        const boxPlot = Functions.getBoxPlot(value);
                        const data = Functions.toPlot(boxPlot);
                        previous[key] = [...previous[key] || [], data];
                        const index = previous[key].length - 1;
                        boxPlot.outliers.forEach(outlier => {
                            previous[Constants.OUTLIERS] = [...previous[Constants.OUTLIERS] || [], [ index, outlier ]];
                        });
                    }
                })

                const total = Object.values(items.error).reduce<number>((sum: number, value: number) => {
                    return sum + Math.pow(value / 100, 2);
                }, 0) * 100;

                previous[Constants.AGGREGATE] = [...previous[Constants.AGGREGATE] || [], total];
            }
            return previous;
        }, {});

        const series = this.buildSeries(groups, ['error', Constants.OUTLIERS, Constants.AGGREGATE ]);
        // console.log('series', series)

        return this.buildChart(series);
    }

    protected getOptions(series: {}[]): {} {
        return {
            chart: {
                type: 'boxplot'
            },
            title: {
                text: 'Virtual Speedup Error'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: this.categories,
                gridLineWidth: 1,
                title: {
                    text: 'Rate'
                },
                labels: {
                    style: {
                        fontSize: '6px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Percentil'
                },
                // tickInterval: 2
                // min: -20,
                // max: 20
            },
            series
        };
    }
}