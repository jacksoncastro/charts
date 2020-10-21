import BaseChart from './base-chart';
import Functions from '../functions';

import {
    Metrics,
    Iteration,
    Constants,
    Speedup
} from '..';

export class VirtualSpeedupRate extends BaseChart {

    protected getName(): string {
        return 'virtual-speedup-rate';
    }

    public generate(): void {
    }

    protected getOptions(series: {[key: string]: number[]}): {} {
        return {
        };
    }
}