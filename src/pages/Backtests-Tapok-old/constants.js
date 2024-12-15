export const FILTER_TYPES = {
    TEXT: 'TEXT',
    SELECT: 'SELECT',
    MULTI_SELECT: 'MULTI_SELECT',
    DATEPICKER_RANGE: 'DATEPICKER_RANGE',
    NUMBER: 'NUMBER',
}
export const FILD_TYPES = {
    CHECKBOX: 'CHECKBOX',
}

export const DAY_TYPES = {
    TREND: 'TREND',
    NORMAL: 'NORMAL',
    NORMAL_OF_VARIATION: 'NORMAL_OF_VARIATION',
    NEUTRAL: 'NEUTRAL',
}

export const DAY_TYPES_LABEL = {
    TREND: 'TREND',
    NORMAL: 'NORMAL',
    NORMAL_OF_VARIATION: 'NORMAL OF VARIATION',
    NEUTRAL: 'NEUTRAL',
}

export const OPENING_TYPES = {
    OA: 'OA',
    OD: 'OD',
    OTD: 'OTD',
    ORR: 'ORR',
}

export const IB_BROKEN = {
    HIGH_BROKEN: 'HIGH_BROKEN',
    LOW_BROKEN: 'LOW_BROKEN'
}

export const OPENS = {
    IN_VA: "IN_VA",
    ABOVE_VA: "ABOVE_VA",
    LOWER_VA: "LOWER_VA",
    ABOVE_RANGE: "ABOVE_RANGE",
    LOWER_RANGE: "LOWER_RANGE",
}

export const OPENS_LABEL = {
    IN_VA: "In VA",
    ABOVE_VA: "O > VA",
    LOWER_VA: "O < VA",
    ABOVE_RANGE: "O > Range",
    LOWER_RANGE: "O < Range",
}

export const OPENS_OPTIONS = {
    IN_VA: OPENS_LABEL.IN_VA,
    ABOVE_VA: OPENS_LABEL.ABOVE_VA,
    LOWER_VA: OPENS_LABEL.LOWER_VA,
    ABOVE_RANGE: OPENS_LABEL.ABOVE_RANGE,
    LOWER_RANGE: OPENS_LABEL.LOWER_RANGE,
}

export const DIRECTION = {
    LONG: 'LONG',
    SHORT: 'SHORT',
    NEUTRAL: 'NEUTRAL',
}

export const DAYS_LABEL = {
    'MONDAY': 'MONDAY',
    'TUESDAY': 'TUESDAY',
    'WEDNESDAY': 'WEDNESDAY',
    'THURSDAY': 'THURSDAY',
    'FRIDAY': 'FRIDAY',
}


export const DAYS_OPTIONS = [
    {value: 1, label: DAYS_LABEL.MONDAY},
    {value: 2, label: DAYS_LABEL.TUESDAY},
    {value: 3, label: DAYS_LABEL.WEDNESDAY},
    {value: 4, label: DAYS_LABEL.THURSDAY},
    {value: 5, label: DAYS_LABEL.FRIDAY},
]

export const RR_LABELS = {
    '1r': '1R',
    '2r': '2R',
    '3r': '3R',
}


export const chartConfig = (getData, data, width = 300, height = 300) => {
    const newData =  getData(data)
    return  {
        data: newData,
        width: width,
        height: height,
        theme: 'ag-default-dark',
        background: {
            visible: false
        },

        series: [
            {
                type: "donut",
                calloutLabelKey: "asset",
                angleKey: "amount",
                innerRadiusRatio: 0.8,

                fills: ["rgba(55, 65, 81, 1)", "rgba(55, 65, 81, .9)", "rgba(55, 65, 81, .8)", "rgba(55, 65, 81, .7)", "rgba(55, 65, 81, .6)"],

                calloutLabel: {
                    formatter: ({datum}) => {
                        return `${datum.asset}`
                    },
                    avoidCollisions: false
                }
            },
        ],
        legend: {
            enabled: true,
            item: {
                label: {
                    spacing: 20,
                    formatter: ({itemId, value}) => {
                        return `${value} (${(newData[itemId].amount / data.length * 100).toFixed(0)}%)`
                    }
                }
            }
        }
    }
}