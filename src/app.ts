import Chart from './chart';
import { Parameter } from './interfaces';

const parameters: Parameter[] = [
    // {
    //     category: '1',
    //     folder: '2020-10-17-16-09-25'
    // },
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
    {
        category: '80',
        folder: '2020-10-20-19-48-26'
    },
];

const chart = new Chart(parameters);
chart.init();
