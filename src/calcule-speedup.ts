import YAML from 'yaml'

import Constants from './constants';

import {
    Delay,
    Service,
    Scenarie,
    Scenaries,
    Test
} from './'


// tslint:disable:no-console
export default class CalculeSpeedup {

    private steep = 25;

    private target: string;

    private services: Service[];

    private delays: number[];

    private users: number;

    private iterations: number;

    private rounds: number;

    private multipleBase: number;

    constructor(target: string, services: Service[], delays: number[], users: number, iterations: number, rounds: number) {
        this.target = target;
        this.services = services;
        this.delays = delays;
        this.users = users;
        this.iterations = iterations;
        this.rounds = rounds;
        this.multipleBase = Math.max(...delays) / this.steep;
    }

    public calcule() {

        const target = this.services.find(service => service.name === this.target);
        const others = this.services.filter(service => service.name !== this.target);

        const targetDelayNT = target.median * this.multipleBase;

        const scenaries: Scenarie[] = [];

        this.delays.sort().forEach(delay => {

            const performanceGain = target.median * (delay / this.steep);

            let delays: Delay[] = [
                {
                    key: Constants.NT,
                    service: target.name,
                    delay: targetDelayNT / 1000
                }
            ];

            const delaysTargets = this.speedupTarget(target, targetDelayNT, performanceGain);
            delays = delays.concat(delaysTargets);

            others.forEach(other => {
                const delaysOthers = this.speedupOther(other, performanceGain)
                delays = delays.concat(delaysOthers);
            });

            const tests = this.getTests(delays);

            scenaries.push({
                title: `${target.name}-DELAY-${delay}-USERS-${this.users}-ITER-${this.iterations}`,
                users: this.users,
                iterations: this.iterations,
                rounds: this.rounds,
                tests
            });
        });

        const s: Scenaries = {
            scenaries
        }
        console.log(YAML.stringify(s));
    }

    public speedupTarget(target: Service, targetDelayNT: number, performanceGain: number): Delay[] {

        const ats = targetDelayNT - performanceGain;
        const dt = targetDelayNT + performanceGain;
        const dts = targetDelayNT;

        return [
            {
                key: Constants.ATS,
                service: target.name,
                delay: ats / 1000
            },
            {
                key: Constants.DT,
                service: target.name,
                delay: dt / 1000
            },
            {
                key: Constants.DTS,
                service: target.name,
                delay: dts / 1000
            }
        ];
    }

    public speedupOther(other: Service, performanceGain: number): Delay[] {

        const nt = other.median * this.multipleBase;
        const ats = nt;
        const dt = nt + performanceGain;
        const dts = nt + performanceGain;

        return [
            {
                key: Constants.NT,
                service: other.name,
                delay: nt / 1000
            },
            {
                key: Constants.ATS,
                service: other.name,
                delay: ats / 1000
            },
            {
                key: Constants.DT,
                service: other.name,
                delay: dt / 1000
            },
            {
                key: Constants.DTS,
                service: other.name,
                delay: dts / 1000
            }
        ];
    }

    private getTests(delays: Delay[]): Test[] {

        const virtualServicesGroup = delays.reduce((previous, current) => {

            const virtualService = {
                target: current.service,
                delay: current.delay
            };

            previous[current.key] = [...previous[current.key] || [], virtualService];
            return previous;
        }, {});

        const tests = [];
        Object.entries(virtualServicesGroup).forEach(([name, virtualServices]) => {

            if (virtualServices instanceof Array) {
                const test = {
                    name,
                    virtualServices
                };
                tests.push(test);
            }
        });
        return tests;
    }
}