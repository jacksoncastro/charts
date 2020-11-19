import Chart from './chart';
import Median from './median';
import CalculeSpeedup from './calcule-speedup';
import { Parameter } from './interfaces';

const parameters: Parameter[] = [
    // {
    //     category: '100',
    //     folder: '2020-10-22-00-28-40'
    // },

    // iteration: vus * 5
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
    //     category: '160',
    //     folder: '2020-10-24-17-36-53'
    // },
    // {
    //     category: '180',
    //     folder: '2020-10-24-20-01-26'
    // },
    // {
    //     category: '200',
    //     folder: '2020-10-25-11-28-09'
    // },

    // iteration: vus * 5
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
    // {
    //     category: '100 (currencyservice)',
    //     folder: '2020-10-24-12-41-24'
    // },
    // {
    //     category: '100 (currencyservice-new)',
    //     folder: '2020-10-25-20-55-25'
    // },
    // {
    //     category: '100 (cartservice)',
    //     folder: '2020-10-23-13-11-44'
    // },
    // {
    //     category: '100 (recommendationservice)',
    //     folder: '2020-10-23-14-29-03'
    // },
    // {
    //     category: '100 (adservice)',
    //     folder: '2020-10-23-15-47-42'
    // },
    // {
    //     category: '100 (shippingservice)',
    //     folder: '2020-10-23-17-05-09'
    // },
    // {
    //     category: '100 (emailservice)',
    //     folder: '2020-10-23-18-42-46'
    // },
    // {
    //     category: '100 (paymentservice)',
    //     folder: '2020-10-23-20-16-53'
    // },
    // {
    //     category: '100 (checkoutservice)',
    //     folder: '2020-10-23-21-34-52'
    // },
    // {
    //     category: '100 (productcatalogservice)',
    //     folder: '2020-10-23-22-51-52'
    // }

    // 1 iteração por usuário, productcatalogservice como alvo
    // extra_latency: 0.1s
    // performance_gain: 0.05s
    // {
    //     category: '25',
    //     folder: '2020-10-26-00-31-31'
    // },
    // {
    //     category: '50',
    //     folder: '2020-10-26-03-32-32'
    // },
    // {
    //     category: '75',
    //     folder: '2020-10-26-06-13-14'
    // },
    // {
    //     category: '100',
    //     folder: '2020-10-26-09-09-57'
    // },
    // {
    //     category: '125',
    //     folder: '2020-10-26-12-02-53'
    // },
    // {
    //     category: '150',
    //     folder: '2020-10-26-13-56-02'
    // },
    // {
    //     category: '175',
    //     folder: '2020-10-26-15-48-16'
    // },
    // {
    //     category: '200',
    //     folder: '2020-10-26-17-43-07'
    // }

    // extra_latency: 0.1s
    // performance_gain: 0.075s, 0.05s e 0.025s
    // target: frontend-external
    // {
    //     category: '50-0.075s',
    //     folder: '2020-10-26-23-24-56'
    // },
    // {
    //     category: '50-0.05s',
    //     folder: '2020-10-27-01-07-24'
    // },
    // {
    //     category: '50-0.025s',
    //     folder: '2020-10-27-02-47-57'
    // },
    // {
    //     category: '100-0.075s',
    //     folder: '2020-10-27-04-28-37'
    // },
    // {
    //     category: '100-0.05s',
    //     folder: '2020-10-27-06-14-38'
    // },
    // {
    //     category: '100-0.025s',
    //     folder: '2020-10-27-07-58-17'
    // },
    // {
    //     category: '150-0.075s',
    //     folder: '2020-10-27-09-39-49'
    // },
    // {
    //     category: '150-0.05s',
    //     folder: '2020-10-27-11-27-39'
    // },
    // {
    //     category: '150-0.025s',
    //     folder: '2020-10-27-13-12-40'
    // }
    // {
    //     category: 'productcatalog-25',
    //     folder: 'productcatalog-25'
    // },
    // {
    //     category: 'productcatalog-50',
    //     folder: 'productcatalog-50'
    // },
    // {
    //     category: 'productcatalog-75',
    //     folder: 'productcatalog-75'
    // }
    // {
    //     category: 'frontend-25',
    //     folder: 'frontend-25'
    // },
    // {
    //     category: 'frontend-50',
    //     folder: 'frontend-50'
    // },
    // {
    //     category: 'frontend-75',
    //     folder: 'frontend-75'
    // }
    // {
    //     category: 'recommendationservice-25',
    //     folder: 'recommendationservice-25'
    // },
    // {
    //     category: 'recommendationservice-50',
    //     folder: 'recommendationservice-50'
    // },
    // {
    //     category: 'recommendationservice-75',
    //     folder: 'recommendationservice-75'
    // }
    // {
    //     category: 'checkoutservice-25',
    //     folder: 'checkoutservice-25'
    // },
    // {
    //     category: 'checkoutservice-50',
    //     folder: 'checkoutservice-50'
    // },
    // {
    //     category: 'checkoutservice-75',
    //     folder: 'checkoutservice-75'
    // }

    // {
    //     category: 'frontend-DELAY-25-USERS-50-ITER-50',
    //     folder: 'frontend-DELAY-25-USERS-50-ITER-50'
    // },
    // {
    //     category: 'frontend-DELAY-50-USERS-50-ITER-50',
    //     folder: 'frontend-DELAY-50-USERS-50-ITER-50'
    // },
    // {
    //     category: 'frontend-DELAY-75-USERS-50-ITER-50',
    //     folder: 'frontend-DELAY-75-USERS-50-ITER-50'
    // },
    // {
    //     category: 'frontend-DELAY-25-USERS-100-ITER-100',
    //     folder: 'frontend-DELAY-25-USERS-100-ITER-100'
    // },
    // {
    //     category: 'frontend-DELAY-50-USERS-100-ITER-100',
    //     folder: 'frontend-DELAY-50-USERS-100-ITER-100'
    // },
    // {
    //     category: 'frontend-DELAY-75-USERS-100-ITER-100',
    //     folder: 'frontend-DELAY-75-USERS-100-ITER-100'
    // },
    // {
    //     category: 'frontend-DELAY-25-USERS-150-ITER-150',
    //     folder: 'frontend-DELAY-25-USERS-150-ITER-150'
    // },
    // {
    //     category: 'frontend-DELAY-50-USERS-150-ITER-150',
    //     folder: 'frontend-DELAY-50-USERS-150-ITER-150'
    // },
    // {
    //     category: 'frontend-DELAY-75-USERS-150-ITER-150',
    //     folder: 'frontend-DELAY-75-USERS-150-ITER-150'
    // },
    // {
    //     category: 'frontend-DELAY-25-USERS-200-ITER-200',
    //     folder: 'frontend-DELAY-25-USERS-200-ITER-200'
    // },
    // {
    //     category: 'frontend-DELAY-50-USERS-200-ITER-200',
    //     folder: 'frontend-DELAY-50-USERS-200-ITER-200'
    // },
    // {
    //     category: 'frontend-DELAY-75-USERS-200-ITER-200',
    //     folder: 'frontend-DELAY-75-USERS-200-ITER-200'
    // }

    // {
    //     category: 'recommendationservice-DELAY-25-USERS-50-ITER-50',
    //     folder: 'recommendationservice-DELAY-25-USERS-50-ITER-50'
    // },
    // {
    //     category: 'recommendationservice-DELAY-50-USERS-50-ITER-50',
    //     folder: 'recommendationservice-DELAY-50-USERS-50-ITER-50'
    // },
    // {
    //     category: 'recommendationservice-DELAY-75-USERS-50-ITER-50',
    //     folder: 'recommendationservice-DELAY-75-USERS-50-ITER-50'
    // },
    // {
    //     category: 'recommendationservice-DELAY-25-USERS-100-ITER-100',
    //     folder: 'recommendationservice-DELAY-25-USERS-100-ITER-100'
    // },
    // {
    //     category: 'recommendationservice-DELAY-50-USERS-100-ITER-100',
    //     folder: 'recommendationservice-DELAY-50-USERS-100-ITER-100'
    // },
    // {
    //     category: 'recommendationservice-DELAY-75-USERS-100-ITER-100',
    //     folder: 'recommendationservice-DELAY-75-USERS-100-ITER-100'
    // },
    // {
    //     category: 'recommendationservice-DELAY-25-USERS-150-ITER-150',
    //     folder: 'recommendationservice-DELAY-25-USERS-150-ITER-150'
    // },
    // {
    //     category: 'recommendationservice-DELAY-50-USERS-150-ITER-150',
    //     folder: 'recommendationservice-DELAY-50-USERS-150-ITER-150'
    // },
    // {
    //     category: 'recommendationservice-DELAY-75-USERS-150-ITER-150',
    //     folder: 'recommendationservice-DELAY-75-USERS-150-ITER-150'
    // },
    // {
    //     category: 'recommendationservice-DELAY-25-USERS-200-ITER-200',
    //     folder: 'recommendationservice-DELAY-25-USERS-200-ITER-200'
    // },
    // {
    //     category: 'recommendationservice-DELAY-50-USERS-200-ITER-200',
    //     folder: 'recommendationservice-DELAY-50-USERS-200-ITER-200'
    // },
    // {
    //     category: 'recommendationservice-DELAY-75-USERS-200-ITER-200',
    //     folder: 'recommendationservice-DELAY-75-USERS-200-ITER-200'
    // }

    // {
    //     category: 'checkoutservice-DELAY-25-USERS-50-ITER-50',
    //     folder: 'checkoutservice-DELAY-25-USERS-50-ITER-50'
    // },
    // {
    //     category: 'checkoutservice-DELAY-50-USERS-50-ITER-50',
    //     folder: 'checkoutservice-DELAY-50-USERS-50-ITER-50'
    // },
    // {
    //     category: 'checkoutservice-DELAY-75-USERS-50-ITER-50',
    //     folder: 'checkoutservice-DELAY-75-USERS-50-ITER-50'
    // },
    // {
    //     category: 'checkoutservice-DELAY-25-USERS-100-ITER-100',
    //     folder: 'checkoutservice-DELAY-25-USERS-100-ITER-100'
    // },
    // {
    //     category: 'checkoutservice-DELAY-50-USERS-100-ITER-100',
    //     folder: 'checkoutservice-DELAY-50-USERS-100-ITER-100'
    // },
    // {
    //     category: 'checkoutservice-DELAY-75-USERS-100-ITER-100',
    //     folder: 'checkoutservice-DELAY-75-USERS-100-ITER-100'
    // },
    // {
    //     category: 'checkoutservice-DELAY-25-USERS-150-ITER-150',
    //     folder: 'checkoutservice-DELAY-25-USERS-150-ITER-150'
    // },
    // {
    //     category: 'checkoutservice-DELAY-50-USERS-150-ITER-150',
    //     folder: 'checkoutservice-DELAY-50-USERS-150-ITER-150'
    // },
    // {
    //     category: 'checkoutservice-DELAY-75-USERS-150-ITER-150',
    //     folder: 'checkoutservice-DELAY-75-USERS-150-ITER-150'
    // },
    // {
    //     category: 'checkoutservice-DELAY-25-USERS-200-ITER-200',
    //     folder: 'checkoutservice-DELAY-25-USERS-200-ITER-200'
    // },
    // {
    //     category: 'checkoutservice-DELAY-50-USERS-200-ITER-200',
    //     folder: 'checkoutservice-DELAY-50-USERS-200-ITER-200'
    // },
    // {
    //     category: 'checkoutservice-DELAY-75-USERS-200-ITER-200',
    //     folder: 'checkoutservice-DELAY-75-USERS-200-ITER-200'
    // }

    {
        category: 'productcatalogservice-DELAY-25-USERS-50-ITER-50',
        folder: 'productcatalogservice-DELAY-25-USERS-50-ITER-50'
    },
    {
        category: 'productcatalogservice-DELAY-50-USERS-50-ITER-50',
        folder: 'productcatalogservice-DELAY-50-USERS-50-ITER-50'
    },
    {
        category: 'productcatalogservice-DELAY-75-USERS-50-ITER-50',
        folder: 'productcatalogservice-DELAY-75-USERS-50-ITER-50'
    },
    // {
    //     category: 'productcatalogservice-DELAY-25-USERS-100-ITER-100',
    //     folder: 'productcatalogservice-DELAY-25-USERS-100-ITER-100'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-50-USERS-100-ITER-100',
    //     folder: 'productcatalogservice-DELAY-50-USERS-100-ITER-100'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-75-USERS-100-ITER-100',
    //     folder: 'productcatalogservice-DELAY-75-USERS-100-ITER-100'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-25-USERS-150-ITER-150',
    //     folder: 'productcatalogservice-DELAY-25-USERS-150-ITER-150'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-50-USERS-150-ITER-150',
    //     folder: 'productcatalogservice-DELAY-50-USERS-150-ITER-150'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-75-USERS-150-ITER-150',
    //     folder: 'productcatalogservice-DELAY-75-USERS-150-ITER-150'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-25-USERS-200-ITER-200',
    //     folder: 'productcatalogservice-DELAY-25-USERS-200-ITER-200'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-50-USERS-200-ITER-200',
    //     folder: 'productcatalogservice-DELAY-50-USERS-200-ITER-200'
    // },
    // {
    //     category: 'productcatalogservice-DELAY-75-USERS-200-ITER-200',
    //     folder: 'productcatalogservice-DELAY-75-USERS-200-ITER-200'
    // }
];

const chart = new Chart(parameters);
chart.init();

// const median = new Median('no-delay-100-100', 'NO_DELAY');
// median.calcule();

const services = [
    {
        name: 'emailservice', median: 10
    },
    {
        name: 'paymentservice', median: 6
    },
    {
        name: 'adservice', median: 73
    },
    {
        name: 'cartservice', median: 14
    },
    {
        name: 'checkoutservice', median: 312
    },
    {
        name: 'currencyservice', median: 14
    },
    {
        name: 'productcatalogservice', median: 7
    },
    {
        name: 'recommendationservice', median: 50
    },
    {
        name: 'shippingservice', median: 3
    },
    {
        name: 'frontend', median: 383
    }
];

const delays = [
    25, 50, 75
];
// 50, 100, 150 e 200
// const x = 200;
// const calculeSpeedup = new CalculeSpeedup('paymentservice', services, delays, x, x, 10);
// calculeSpeedup.calcule();
