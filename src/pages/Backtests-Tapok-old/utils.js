import {chartConfig} from "../Stats/constants";
import moment from "moment/moment";

export const mergeStatsAndBack = (stats, backs) => {
    return backs.map((back) => {
        const currentStat = stats.find((stat) => {
            const statDate = moment(stat.date, "DD-MM-YYYY")
            const backDate = moment(back.date, "DD-MM-YYYY")

            return statDate.diff(backDate) === 0
        })

        return {...currentStat, ...back}
    })
}

export const getChartConfigForBacktest = (data = [], getData, property, width = 300, height = 300) => {
    return {
        ...chartConfig(getData, data, property),
        width: width,
        height: height,
    }
}

export const getWinRate = (data, property) => {
    const newData = data.reduce((acc, item) => {

        if(item[property] > 0) {
            acc.win = acc.win + 1
        } else {
            acc.lose = acc.lose + 1
        }

        return acc
    }, {win: 0, lose: 0})


    return [
        {asset: 'Win', amount: newData.win},
        {asset: 'Lose', amount: newData.lose},
    ]
}

export const getDirection = (data) => {
    const newData = data.reduce((acc, item) => {
        if(item.direction === "long") {
            acc.long = acc.long + 1
        } else {
            acc.short = acc.short + 1
        }

        return acc
    }, {long: 0, short: 0})


    return [
        {asset: 'Long', amount: newData.long},
        {asset: 'Short', amount: newData.short},
    ]
}

export const getOpenSession = (data) => {
    const newData = data.reduce((acc, item) => {
        if(item.open_session === "London") {
            acc.london = acc.london + 1
        } else if(item.open_session === "Lunch"){
            acc.lunch = acc.lunch + 1
        } else {
            acc.ny = acc.ny + 1
        }

        return acc
    }, {london: 0, lunch: 0, ny: 0})


    return [
        {asset: 'London', amount: newData.london},
        {asset: 'Lunch', amount: newData.lunch},
        {asset: 'NY', amount: newData.ny},
    ]
}

export const getCloseSession = (data) => {
    const newData = data.reduce((acc, item) => {
        if(item.close_session === "London") {
            acc.london = acc.london + 1
        } else if(item.close_session === "Lunch"){
            acc.lunch = acc.lunch + 1
        } else {
            acc.ny = acc.ny + 1
        }

        return acc
    }, {london: 0, lunch: 0, ny: 0})


    return [
        {asset: 'London', amount: newData.london},
        {asset: 'Lunch', amount: newData.lunch},
        {asset: 'NY', amount: newData.ny},
    ]
}


export const getBarChartConfig = (data = [], width = 300, height = 300) => {
    return {
        background: {
            visible: false
        },
        width: width,
        height: height,
        data: data,
        series: [
            {
                type: "bar",
                direction: "horizontal",
                xKey: "asset",
                yKey: "amount",
                label: {
                    color: '#fff',
                    formatter: ({value}) => {
                        return `${value.toFixed(0)} (${(value / data.length * 100).toFixed(0)}%)`
                    },
                },

                itemStyler: ({ datum, yKey }) => ({
                    fill: "rgba(55, 65, 81, 1)",
                }),
            },
        ],
        axes: [
            {
                type: "category",
                position: "left",
                label: {
                    color: '#fff'
                }
            },
            {
                type: "number",
                position: "bottom",
                label: {
                    color: '#fff',
                },
            },
        ],
    };
}

export const getDataIBChart = (data = [], labels) => {
    return  Object.keys(labels).map((key) => {

        return {asset: labels[key], amount: data.filter((item) => {
                return item[key]
            }).length
        }})
    // .filter((item) => item.amount >= 5)
}

export const dataWithIbInfo = (data, property = "ib_broken") => {

    return data.map((item) => {
        const isHighBroken = item[property].includes('High Broken')
        const isLowBroken = item[property]?.includes('Low Broken')

        return {
            ...item,
            '1r': isHighBroken || isLowBroken,
            ib_high_broken: isHighBroken,
            ib_low_broken: isLowBroken,
            ib_both_broken: isLowBroken && isHighBroken,
            ib_one_side_broken: (isLowBroken && !isHighBroken) || (!isLowBroken && isHighBroken),
        }
    })
}

export const getAverage = (array, property) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i][property];
    }
    return sum / array.length;
}