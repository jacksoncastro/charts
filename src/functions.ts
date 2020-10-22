import percentile from 'percentile';

export default class Functions {

    private constructor() {}

    public static calculeRS(nt: number, ats: number): number {
        if (nt && ats) {
            return (nt - ats) / nt;
        }
    }

    public static calculeVS(nt: number, dt: number, dts: number): number {
        if (nt && dt && dts) {
            return (dt - dts) / nt;
        }
    }

    /**
     * Calcule error with log
     *
     * @param {*} rs A
     * @param {*} vs F
     */
    public static calculeErrorLog(rs: number, vs: number): number {
        return (Math.log10(vs / rs) * 100);
    }

    /**
     * Calcule error
     *
     * @param {*} rs A
     * @param {*} vs F
     */
    public static calculeError(rs: number, vs: number): number {
        return (Math.abs(vs - rs) / ( rs + vs )) * 100;
    }

    public static getPlot(data: number[]) {

        const sort = data.sort();
        const min = sort[0];
        const max = sort[sort.length - 1];

        const quartis = percentile([ 25, 50, 75 ], data);

        if (quartis instanceof Array) {
            return [ min, ...quartis, max ];
        }
        throw new Error('No array found');
    }

    public static getMedian(data: number[]) {
        return percentile([ 50 ], data);
    }

    public static group(array: any[]): {[key: string]: []} {
        if (!array) {
            return;
        }
        const result = {};
        array.forEach(item => {
            Object.keys(item).forEach(key => {
                result[key] = [ ...result[key] || [], item[key] ];
            })
        })
        return result;
    }
}