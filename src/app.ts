import Chart from './chart';
import { Parameter } from './interfaces';

const parameters: Parameter[] = [
    // {
    //     category: '100',
    //     folder: '2020-10-22-00-28-40'
    // },

    // {
    //     category: '20',
    //     folder: '2020-10-19-17-57-32'
    // },
    // {
    //     category: '40',
    //     folder: '2020-10-20-12-38-16'
    // },
    // {
    //     category: '60',
    //     folder: '2020-10-20-16-16-05'
    // },
    // {
    //     category: '80',
    //     folder: '2020-10-20-19-48-26'
    // },
    // {
    //     category: '100',
    //     folder: '2020-10-21-12-14-36'
    // },
    // {
    //     category: '120',
    //     folder: '2020-10-21-16-16-18'
    // },
    // {
    //     category: '140',
    //     folder: '2020-10-21-20-07-21'
    // },

    // {
    //     category: '50',
    //     folder: '2020-10-22-01-51-17'
    // },
    // {
    //     category: '100',
    //     folder: '2020-10-22-05-21-34'
    // },
    // {
    //     category: '150',
    //     folder: '2020-10-22-09-01-05'
    // },
    // {
    //     category: '200',
    //     folder: '2020-10-22-13-12-15'
    // },

    // com limites no kubernetes
    // {
    //     category: '100 (currencyservice)',
    //     folder: '2020-10-22-20-56-52'
    // },
    // {
    //     category: '100 (cartservice)',
    //     folder: '2020-10-22-22-27-43'
    // },
    // {
    //     category: '100 (recommendationservice)',
    //     folder: '2020-10-22-23-47-25'
    // },
    // {
    //     category: '100 (adservice)',
    //     folder: '2020-10-23-01-07-05'
    // },
    // {
    //     category: '100 (shippingservice)',
    //     folder: '2020-10-23-02-24-45'
    // },
    // {
    //     category: '100 (emailservice)',
    //     folder: '2020-10-23-03-41-47'
    // },
    // {
    //     category: '100 (paymentservice)',
    //     folder: '2020-10-23-04-59-16'
    // },
    // {
    //     category: '100 (checkoutservice)',
    //     folder: '2020-10-23-06-16-00'
    // },
    // {
    //     category: '100 (productcatalogservice)',
    //     folder: '2020-10-23-10-36-10'
    // },

    // sem limites no kubernetes
    {
        category: '100 (currencyservice)',
        folder: '2020-10-24-12-41-24'
    },
    {
        category: '100 (cartservice)',
        folder: '2020-10-23-13-11-44'
    },
    {
        category: '100 (recommendationservice)',
        folder: '2020-10-23-14-29-03'
    },
    {
        category: '100 (adservice)',
        folder: '2020-10-23-15-47-42'
    },
    {
        category: '100 (shippingservice)',
        folder: '2020-10-23-17-05-09'
    },
    {
        category: '100 (emailservice)',
        folder: '2020-10-23-18-42-46'
    },
    {
        category: '100 (paymentservice)',
        folder: '2020-10-23-20-16-53'
    },
    {
        category: '100 (checkoutservice)',
        folder: '2020-10-23-21-34-52'
    },
    {
        category: '100 (productcatalogservice)',
        folder: '2020-10-23-22-51-52'
    },
];

const chart = new Chart(parameters);
chart.init();
