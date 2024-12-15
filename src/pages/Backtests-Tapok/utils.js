import {chartConfig} from "../Stats/constants";
import {getDayOfWeek, getMonth} from "../Stats/utils";
import moment from "moment";
import colors from "tailwindcss/colors";

const propertyForResult = "result"
const rrForResult = 1;

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

export const getChartConfigForBacktest = (data = [], getData, width = 300, height = 300) => {
    return {
        ...chartConfig(getData, data),
        width: width,
        height: height,
    }
}

export const getWinRate = (data) => {
    const newData = data.reduce((acc, item) => {

        if(item[propertyForResult] === "win") {
            acc.win++
        } else {
            acc.lose++
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

export const getWinRateByDay = (data) => {
    const newData = data.reduce((acc, item) => {


        if(getDayOfWeek(item.date) == 1) {
            acc.Monday = acc.Monday + 1
        } else if(getDayOfWeek(item.date) ==2) {
            acc.Tuesday = acc.Tuesday + 1
        } else if(getDayOfWeek(item.date) == 3) {
            acc.Wednesday = acc.Wednesday + 1
        } else if(getDayOfWeek(item.date) == 4) {
            acc.Thursday = acc.Thursday + 1
        } else if(getDayOfWeek(item.date) == 5) {
            acc.Friday = acc.Friday + 1
        }

        return acc
    }, {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
    })


    return [
        {asset: 'Monday', amount: newData.Monday},
        {asset: 'Tuesday', amount: newData.Tuesday},
        {asset: 'Wednesday', amount: newData.Wednesday},
        {asset: 'Thursday', amount: newData.Thursday},
        {asset: 'Friday', amount: newData.Friday},
    ]
}

export const getWinRateByMonth = (data) => {
    const newData = data.reduce((acc, item) => {

        if(getMonth(item.date) === 1) {
            acc.January = acc.January + 1
        } else if(getMonth(item.date) === 2) {
            acc.February = acc.February + 1
        } else if(getMonth(item.date) === 3) {
            acc.March = acc.March + 1
        } else if(getMonth(item.date) === 4) {
            acc.April = acc.April + 1
        } else if(getMonth(item.date) === 5) {
            acc.May = acc.May + 1
        } else if(getMonth(item.date) === 6) {
            acc.June = acc.June + 1
        } else if(getMonth(item.date) === 7) {
            acc.July = acc.July + 1
        } else if(getMonth(item.date) === 8) {
            acc.August = acc.August + 1
        } else if(getMonth(item.date) === 9) {
            acc.September = acc.September + 1
        } else if(getMonth(item.date) === 10) {
            acc.October = acc.October + 1
        } else if(getMonth(item.date) === 11) {
            acc.November = acc.November + 1
        } else if(getMonth(item.date) === 12) {
            acc.December = acc.December + 1
        }

        return acc
    }, {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
    })

    return [
        {asset: 'January', amount: newData.January},
        {asset: 'February', amount: newData.February},
        {asset: 'March', amount: newData.March},
        {asset: 'April', amount: newData.April},
        {asset: 'May', amount: newData.May},
        {asset: 'June', amount: newData.June},
        {asset: 'July', amount: newData.July},
        {asset: 'August', amount: newData.August},
        {asset: 'September', amount: newData.September},
        {asset: 'October', amount: newData.October},
        {asset: 'November', amount: newData.November},
        {asset: 'December', amount: newData.December},
    ]
}


export const optionsForLineChart= (data, getData, width, height) => {

    return {
        width,
        height,
        data: data,

        stacked: true,

        title: {
            text: "",
            color: '#fff',

            label: {
                color: '#fff'
            }
        },

        background: {
            visible: false
        },

        label: {
            color: '#fff'
        },


        series: [
            {
                type: "line",
                xKey: "date",
                yKey: "profitBefore",
                yName: "Data Original",

                marker: {
                    size: 0,
                    strokeWidth: 1,
                    shape: 'circle',
                },
                tooltip: {
                    enabled: true,
                    renderer: {
                        color: 'red'
                    }
                }
            },
            {
                type: "line",
                xKey: "date",
                yKey: "profitAfter2",
                yName: "Data Optimized",

                marker: {
                    size: 0,
                    strokeWidth: 1,
                    shape: 'circle',
                },
                tooltip: {
                    enabled: true,
                    renderer: {
                        color: 'red'
                    }
                }
            },
        ],
        axes: [
            {
                position: "bottom",
                type: "time",
                title: {
                    text: "",
                    color: '#fff',
                },
                label: {
                    // format: "%b",
                    color: '#fff'
                },


            },
            {
                position: "left",
                type: "number",
                title: {
                    text: "Profit",
                    color: '#fff',
                },
                label:  {
                    color: '#fff'
                },
                gridLine: {
                    style: [{
                        stroke: '#444444'
                    }]
                }
            },

        ],
    };
};

export const getDataLine = (data) => {
    let profit = 0;

    const prepareData = data.reduce((acc, item) => {
        const result = item[propertyForResult]

        if(result === 'win') {
            profit = profit + rrForResult
        } else {
            profit--
        }

        acc[item.date] = profit

        return  acc

        // return [...acc, {date: new Date(moment(date, "DD-MM-YYYY").format()), profit: profit}]
    }, [])

    return Object.keys(prepareData).map((key) => {
        return {pureDate: key, date: new Date(moment(key, "DD-MM-YYYY").format()), profit: prepareData[key]}
    })
}

export const getDataLineObj = (data) => {
    let profit = 0;

    return data.reduce((acc, {date, result}) => {
        if(result === 'win') {
            profit++
        } else {
            profit--
        }

        acc[date] = profit

        return  acc

        // return [...acc, {date: new Date(moment(date, "DD-MM-YYYY").format()), profit: profit}]
    }, [])
}

export const connectTwoData = (dataBefore, dateAfter) => {
    const data1 = getDataLine(dataBefore)
    const data2 = getDataLineObj(dateAfter)
    let lastProfitAfter = 0

    return data1.reduce((acc, item) => {
        lastProfitAfter = data2[item.pureDate] !== undefined ? data2[item.pureDate] : lastProfitAfter

        return [...acc, {date: item.date, profitBefore: item.profit, profitAfter: lastProfitAfter}]
    }, [])
}

export const getDataLine3 = (dataBefore, dataAfter) => {
    let profit = 0;

    const prepareData = dataBefore.reduce((acc, {date, result}) => {

        if(result === 'win') {
            profit++
        } else {
            profit--
        }

        acc[date] = profit
        // acc[date] = {profitBefore: profit}

        return  acc

        // return [...acc, {date: new Date(moment(date, "DD-MM-YYYY").format()), profit: profit}]
    }, [])

    return Object.keys(prepareData).map((key) => {
        return {date: new Date(moment(key, "DD-MM-YYYY").format()), profit: prepareData[key]}
    })
}

export const getDataLine2 = (data) => {
    let profit = 0;

    const prepareData = data.reduce((acc, {date, result}) => {

        if(result === 'win') {
            profit++
        } else {
            profit--
        }

        return [...acc, {date: new Date(moment(date, "DD-MM-YYYY").format()), profit: profit}]
    }, [])

    return prepareData
}


export const getStatistic = (data = []) => {
    const getWinRateInfo = () => {
        return ((getWinRate(data)[0].amount / data.length) * 100).toFixed(0)
    }

    const getProfit = () => {

        return data?.reduce((acc, item) => {
            const result = item[propertyForResult]

            if(result === 'win') {
                acc = acc +rrForResult
            } else {
                acc--
            }

            return  acc
        }, 0)
    }

    const getMaxLose = () => {
        let maxLose = 0

        data?.reduce((acc, item) => {

            if(item[propertyForResult] === 'lose') {
                acc = acc + rrForResult
            } else {
                acc = 0
            }

            if(acc >= maxLose) {
                maxLose = acc
            }

            return acc
        }, 0)

        return maxLose
    }


    return {
        profit: getProfit(),
        maxLose: getMaxLose(),
        winRate: getWinRateInfo(),
        maxDrawdown: calculateMaxDrawdown(getDataLine(data))
    }
}


export const getUnique = (data) => {
    const seenDates = new Set();
    const filteredData = data.filter(item => {
        if (seenDates.has(item.date)) {
            return false; // Пропускаем, если дата уже есть
        }
        seenDates.add(item.date);
        return true; // Добавляем, если дата уникальная
    });

    return filteredData
}

// Функция для проверки луз стриков
export const limitLoseStreak = (data, maxLoseStreak = 3, maxLosePerDay = 10) =>{
    const weeks = {}; // Для хранения данных по неделям
    const filteredData = [];
    const loseCountPerDay = {}; // Для отслеживания проигрышей на каждый день

    // Группируем данные по неделям и проверяем луз стрики
    data.forEach(item => {
        const weekNumber = getWeekNumber(new Date(item.date)); // Получаем номер недели

        // Если неделя ещё не существует в объекте weeks, создаём для неё массив
        if (!weeks[weekNumber]) {
            weeks[weekNumber] = [];
        }

        weeks[weekNumber].push(item);

        // Проверяем луз стрики по подряд идущим проигрышам в текущей неделе
        const loseStreak = calculateLoseStreak(weeks[weekNumber]);

        // Проверяем ограничение на количество лузов в день
        const loseDate = item.date; // Дата проигрыша
        if (loseCountPerDay[loseDate] === undefined) {
            loseCountPerDay[loseDate] = 0;
        }
        if (item[propertyForResult] === "lose" && loseCountPerDay[loseDate] < maxLosePerDay) {
            loseCountPerDay[loseDate]++;
        } else if (item[propertyForResult] === "lose" && loseCountPerDay[loseDate] >= maxLosePerDay) {
            return; // Пропускаем запись, если количество лузов на день превышает лимит
        }

        // Добавляем запись, если луз стриков не больше заданного лимита
        if (loseStreak <= maxLoseStreak) {
            filteredData.push(item);
        }
    });

    return filteredData;
}

// Функция для получения номера недели
function getWeekNumber(date) {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const diff = date - startDate;
    const oneDay = 1000 * 60 * 60 * 24;
    const weekNumber = Math.ceil(diff / (7 * oneDay));
    return weekNumber;
}

// Функция для подсчёта подряд идущих лузов в неделе
function calculateLoseStreak(weekData) {
    let maxLoseStreak = 0;
    let currentLoseStreak = 0;

    weekData.forEach(item => {
        if (item[propertyForResult] === "lose") {
            currentLoseStreak++;
            maxLoseStreak = Math.max(maxLoseStreak, currentLoseStreak);
        } else {
            currentLoseStreak = 0;
        }
    });

    return maxLoseStreak;
}

export const sortByDate = (data) => {
    return data.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-')); // Преобразуем дату в формат YYYY-MM-DD
        const dateB = new Date(b.date.split('/').reverse().join('-')); // Преобразуем дату в формат YYYY-MM-DD
        return dateA - dateB; // Сравниваем даты
    });
}


export const removeOppositeDirections = (data) => {
    // Группируем данные по датам
    const groupedByDate = data.reduce((acc, item) => {
        const { date } = item;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});


    // Отфильтровываем данные, оставляя только первое направление для каждой даты
    const filteredData = Object.values(groupedByDate)
        .flatMap(positions => {
            let seenDirection = false; // Флаг, чтобы отслеживать, встретилось ли направление
            return positions.filter(item => {
                if (!seenDirection) {
                    seenDirection = true; // Отметим, что первое направление для этой даты принято
                    return true; // Оставляем первую позицию
                }
                // Если направление уже встречалось, то исключаем

                return item.direction === positions[0].direction;
            });
        });


    return filteredData;
};


export const calculateMaxDrawdown = (data) => {
    let peak = -Infinity; // Изначально пиковое значение максимально отрицательное
    let maxDrawdown = 0;  // Изначально максимальная просадка равна 0

    // Проходим по каждому элементу данных
    data.forEach(item => {
        const value = item.profit; // Текущее значение капитала

        // Обновляем пик, если текущий капитал больше, чем предыдущий пик
        if (value > peak) {
            peak = value;
        }

        // Вычисляем просадку от текущего пика
        const drawdown = peak - value;

        // Обновляем максимальную просадку
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    });

    // Возвращаем максимальную просадку в процентах

    return maxDrawdown;
};

export const removeDuplicateDirectionsPerDay = (data) => {
    // Группируем данные по датам
    const groupedByDate = data.reduce((acc, item) => {
        const { date } = item;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    // Отфильтровываем данные, оставляя только одно направление для каждой даты
    const filteredData = Object.values(groupedByDate)
        .flatMap(positions => {
            const seenDirections = new Set(); // Множество для отслеживания направлений
            return positions.filter(item => {
                // Если направление уже встречалось, пропускаем этот элемент
                if (seenDirections.has(item.direction)) {
                    return false;
                }
                // Добавляем направление в множество и оставляем позицию
                seenDirections.add(item.direction);
                return true;
            });
        });

    return filteredData;
};

export const removeFourthWeek = (data) => {
    // Функция для вычисления номера недели в месяце
    const getWeekOfMonth = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number); // Парсим дату
        const date = new Date(year, month - 1, day);
        const startOfMonth = new Date(year, month - 1, 1);
        const startDay = startOfMonth.getDay() || 7; // Воскресенье -> 7
        return Math.ceil((day + startDay - 1) / 7);
    };

    // Фильтруем записи, удаляя те, которые относятся к 4-й неделе
    return data.filter(item => {
        const week = getWeekOfMonth(item.date);
        return week !== 4; // Исключаем 4-ю неделю
    });
};

// "DD-MM-YYYY"