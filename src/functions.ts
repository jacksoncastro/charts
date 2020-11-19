import { BoxPLot } from './';
import fs from 'fs';
import { parse } from 'json2csv';
import percentile from 'percentile';

export default class Functions {

    private constructor() {}

    public static calculeRS(nt: number, ats: number): number {
        if (nt && ats) {
            return ats / nt;
        }
    }

    public static calculeVS(nt: number, dt: number, dts: number): number {
        if (nt && dt && dts) {
            return (nt - (dt - dts)) / nt;
        }
    }

    /**
     * Calcule error
     *
     * @param {*} rs A
     * @param {*} vs F
     */
    public static calculeError(rs: number, vs: number): number {
        return (Math.log(vs / rs) * 100);
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

    public static saveFile(base64: string, path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, base64, 'base64', (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            })
        });
    }

    public static saveFileCSV(data: {}, path: string): void {
        const csv = parse(data);
        fs.writeFileSync(path, csv , 'utf-8');
    }

    public static getBoxPlot(data: number[]): BoxPLot {

        const percentiles = percentile([ 25, 50, 75 ], data);
        const q1 = percentiles[0];
        const median = percentiles[1];
        const q3 = percentiles[2];

        const iqr = q3 - q1;
        const min = q1 - (iqr * 1.5);
        const max = q3 + (iqr * 1.5);

        const outliers = data.filter(value => value < min || value > max);

        return {
            min,
            max,
            q1,
            median,
            q3,
            outliers
        };
    }

    public static sortByArray<T>(array: T[], order: string[], key: string): T[] {
        return array.sort((a, b) => {
            const A = a[key];
            const B = b[key];
            return order.indexOf(A) > order.indexOf(B) ? 1 : -1;
        });
    }
}