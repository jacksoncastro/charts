import { Groups } from './';

export default class CSVExporter {

    private groups: Groups;

    constructor(groups: Groups) {
        this.groups = groups;
    }

    // Serviço, RS, RSLimited, VS, VSLimited, Erro, ErroLimited
    public generate(): Promise<void> {
        Object.entries(this.groups).forEach(([key, values]) => {
            const x = values.reduce((previous, current) => {
                const data = {
                    key: current.key,
                    iteration: current.iteration,
                    rps: current.rps
                };
                previous[current.round - 1] = [...previous[current.round - 1] || [], data];
                return previous;
            }, {});
            console.log(x);
        });
        return new Promise(resolve => resolve);
    }
}
