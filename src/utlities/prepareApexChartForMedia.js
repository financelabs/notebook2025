import { cloneDeep, merge } from 'lodash-es';


function prepareApexChartForMedia(type, options, categories, series) {
    let defaultOptions = {
        chart: { type: 'line' },
        series: [{
            name: 'sales',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }],
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
    }

    // let updatedchart = merge(
    //     cloneDeep(defaultOptions),
    //     options,
    //     { series: series },
    //     { xaxis: { categories: categories } }
    // )

    let updatedchart = merge(
        cloneDeep(options),
        { series: cloneDeep(series)},
        { xaxis: { categories: cloneDeep(categories)}}
    )

    console.log(updatedchart);

    return updatedchart
}

export default prepareApexChartForMedia