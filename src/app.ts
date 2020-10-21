import Chart from './chart';
import { Parameter } from './interfaces';

const parameters: Parameter[] = [
    {
        category: '20',
        folder: '2020-10-19-17-57-32'
    },
    {
        category: '40',
        folder: '2020-10-20-12-38-16'
    },
    {
        category: '60',
        folder: '2020-10-20-16-16-05'
    },
];

const chart = new Chart(parameters);
chart.init();
