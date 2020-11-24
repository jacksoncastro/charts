import {
    Limite, VirtualService
} from './';

export interface Test {

    name: string;

    limite?: Limite;

    virtualServices: VirtualService[];
}