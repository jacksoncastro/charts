import { Test } from './';

export interface Scenarie {

    title: string;

    users: number;

    iterations: number;

    rounds: number;

    tests: Test[];
}