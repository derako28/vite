import {Page} from "../../components/share/Page/page.jsx";
import {Filter} from "../../components/filter.jsx";
import {Table} from "../../components/table.jsx";
import {useState} from "react";

import dataStats from "../../Data/stats-23-24.json";
import dataBacktest from "./data-sanya.json";

import {AgCharts} from "ag-charts-react";
import {
    assignRR,
    calculateMaxDrawdown,
    connectTwoData,
    getChartConfigForBacktest,
    getDataLine,
    getDirection,
    getStatistic,
    getUnique,
    getWinRate,
    getWinRateByDay,
    getWinRateByMonth,
    limitLoseStreak,
    mergeStatsAndBack,
    optionsForLineChart,
    removeDuplicateDirectionsPerDay,
    removeFourthWeek,
    removeOppositeDirections,
    sortByDate
} from "./utils";
import {
    DAY_TYPES, DAY_TYPES_LABEL,
    DAYS_OPTIONS,
    DIRECTION_OPTIONS,
    FILTER_TYPES,
    IB_BROKEN,
    OPENING_TYPES,
    OPENS_LABEL,
    OPENS_OPTIONS, RESULT_OPTIONS
} from "../Stats/constants";
import {
    getBarChartHorizontalConfig,
    getChartConfig,
    getDataIBSizeChart,
    getDayOfWeek, getMonth,
    getOptions,
    getProfit,
    segmentData
} from "../Stats/utils";
import moment from "moment/moment";
import {Statistic} from "./statistic.jsx";

const columns = [
    { id: 'date', title: 'Date',  },
    { id: 'direction', title: 'Direction' },
    { id: 'day', title: 'Day' },
    { id: 'result', title: 'Result' },
    { id: 'rr', title: 'RR' },

    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS) },
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)  },
    { id: 'type_day', title: 'Type Day', type: FILTER_TYPES.SELECT, options: getOptions(DAY_TYPES)  },
    { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    // { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION)  },
    { id: 'ib_size', title: 'IB Size'},
    { id: 'ib_ext', title: 'IB_Exp', filter: false },
    { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false },
]

const filterOptions = [
    // { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },

    { id: 'ib_size', title: 'IB Size' },
    { id: 'ib_size_from', title: 'IB Size From'},
    { id: 'ib_size_to', title: 'IB Size To'},
    { id: 'ib_size_segmented', title: 'IB Size Segmented'},

    // { id: 'ib_size_range', title: 'IB Size Range (-+5)' },

    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS)},
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
    { id: 'type_day', title: 'Type Day', filter: false },
    // { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION_OPTIONS) },
    { id: 'result', title: 'Result', type: FILTER_TYPES.SELECT, options: getOptions(RESULT_OPTIONS) },
    { id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS }
]

const excludeFilterOptions = [
    // { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },

    { id: 'ib_size', title: 'IB Size' },
    { id: 'ib_size_less', title: 'IB Size Less'},
    { id: 'ib_size_more', title: 'IB Size More'},
    { id: 'ib_size_segmented', title: 'IB Size Segmented'},

    // { id: 'ib_size_range', title: 'IB Size Range (-+5)' },

    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS)},
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
    { id: 'type_day', title: 'Type Day', filter: false },
    // { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION_OPTIONS) },
    { id: 'result', title: 'Result', type: FILTER_TYPES.SELECT, options: getOptions(RESULT_OPTIONS) },
    { id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS }
]

const prepareDataStat = sortByDate(dataStats);
const prepareDataBack = sortByDate(assignRR(dataBacktest));



const initialData = segmentData(mergeStatsAndBack(prepareDataStat, prepareDataBack))
    // .filter((item) => (item.rr === 2))

    // .filter(({date}) => (moment(date, "DD-MM-YYYY").year() > 2023 ))


// const optimizedData = segmentData(mergeStatsAndBack(prepareDataStat, prepareDataBack))
    // .filter((item) => (item.rr === 2))

// .filter(({date}) => (moment(date, "DD-MM-YYYY").year() > 2023 ))
    // .filter((item) => (+getDayOfWeek(item.date) !== 4))
    // .filter((item) => (item.ib_size <= 65))
    // .filter((item) => !(item.ib_size === 50 && item.open === "In VA"))
    // .filter((item) => (item.opening_type !== "ORR"))
    // .filter((item) => (getMonth(item.date) !== 9))
    // .filter((item) => (getMonth(item.date) !== 10))
    // .filter((item) => (getMonth(item.date) !== 12))


export const BacktestsSanya = () => {
    const [tableData, setTableData] = useState(initialData || [])
    // const [modalData, setModalData] = useState()

    const dataFilter = (dataFilter) => {
        const startDate = moment(dataFilter.date?.startDate)
        const endDate = moment(dataFilter.date?.endDate)

        const filteredData = initialData.filter(item => {
            return Object.keys(dataFilter).every(key => {
                if (dataFilter[key] === "" || dataFilter[key] === undefined) return true;

                if(key === 'day') {
                    return getDayOfWeek(item.date) === dataFilter.day
                }

                if(key === 'date') {
                    const currentDate = moment(item.date)

                    return moment(currentDate).isBetween(startDate, endDate)
                }

                if(key === 'ib_size') {
                    return +item[key] === +dataFilter[key]
                }

                if(key === "ib_size_from") {
                    return +dataFilter.ib_size_from <= +item.ib_size
                }

                if(key === "ib_size_to") {
                    return  +dataFilter.ib_size_to >= +item.ib_size
                }

                return item[key]?.toString()?.toLowerCase()?.includes(dataFilter[key].toString()?.toLowerCase());
            });
        });

        setTableData(filteredData)
    }

    const dataExcludeFilter = (dataFilter) => {
        const startDate = moment(dataFilter.date?.startDate)
        const endDate = moment(dataFilter.date?.endDate)

        const filteredData = initialData.filter(item => {
            return Object.keys(dataFilter).every(key => {
                if (dataFilter[key] === "" || dataFilter[key] === undefined) return true;

                if(key === 'day') {
                    return getDayOfWeek(item.date) !== dataFilter.day
                }

                if(key === 'date') {
                    const currentDate = moment(item.date)

                    return moment(currentDate).isBetween(startDate, endDate)
                }

                if(key === 'ib_size') {
                    return !dataFilter[key].split(', ').includes(item[key].toString())
                }

                if(key === "ib_size_less") {
                    return +dataFilter.ib_size_less <= +item.ib_size
                }

                if(key === "ib_size_more") {
                    return  +dataFilter.ib_size_more >= +item.ib_size
                }

                if(key === 'ib_size_segmented') {
                    return !dataFilter[key].split(', ').includes(item[key].toString())
                    // return +item[key] !== +dataFilter[key]
                }

                return !item[key]?.toString()?.toLowerCase()?.includes(dataFilter[key].toString()?.toLowerCase());
            });
        });

        setTableData(filteredData)
    }




    return <Page>
        <div>
            {/*<Filter options={filterOptions} onChange={dataFilter}/>*/}
            <Filter options={excludeFilterOptions} onChange={dataExcludeFilter}/>

            <div className={"text-gray-300 flex align-middle items-start my-5 px-4 gap-3"}>
                <div>Count: {tableData.length}</div>
                {/*<div>Win Rate: {getWinRate(tableData)}</div>*/}

                {/*<div>Profit: {getProfit(tableData)}</div>*/}

                {/*<div> Exclude: "Четверг" IB > 70, IB = 35</div>*/}
            </div>
        </div>

        <div className={'flex justify-center gap-16 mt-10 mb-5 px-20'}>
            <div className={'flex flex-col items-center'}>
                {/*<div className={'text-gray-300 mb-5'}>Profit</div>*/}
                <AgCharts options={optionsForLineChart(connectTwoData(initialData, tableData), getDataLine, 1500, 500)} />

                <div className={'text-white flex flex-col gap-2'}>
                    <Statistic data={initialData} />
                    {/*<Statistic data={removeDuplicateDirectionsPerDay(tableData)} />*/}

                    {/*<Statistic data={tableData.filter((item) => (item.rr === 2))} />*/}



                    {/*<Statistic data={removeOppositeDirections(initialData)} />*/}

                    {/*<div className={"mt-4 mb-4"}>Optimized Data</div>*/}
                    {/*<Statistic data={tableData} />*/}



                    {/*<Statistic data={removeFourthWeek(tableData)} />*/}

                    {/*<Statistic data={removeDuplicateDirectionsPerDay(optimizedData)} />*/}

                    {/*<Statistic data={removeOppositeDirections(optimizedData)} />*/}
                    {/*<Statistic data={removeOppositeDirections(removeDuplicateDirectionsPerDay(optimizedData))} />*/}


                    {/*<Statistic data={initialData} />*/}
                    {/*<Statistic data={getUnique(initialData)} />*/}

                    <div className={"mb-4"}></div>
                    {/*<Statistic data={limitLoseStreak(initialData)} />*/}

                    {/*<Statistic data={limitLoseStreak(optimizedData, 3)} />*/}
                    {/*<Statistic data={limitLoseStreak(removeOppositeDirections(removeDuplicateDirectionsPerDay(optimizedData)), 3)} />*/}
                </div>
            </div>
        </div>

        {/*<div className={'flex justify-center gap-16 mt-10 mb-5 px-20'}>*/}
        {/*    <div className={'flex flex-col items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-5'}>Profit By Optimizated Data</div>*/}
        {/*        <AgCharts options={optionsForLineChart(tableData, getDataLine, 1500, 500)} />*/}
        {/*    </div>*/}
        {/*</div>*/}

        <div className={'flex justify-center gap-16 mt-10 mb-5 px-20'}>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate, 500, 500)} />
            </div>

            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Direction</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getDirection, 500, 500)} />
            </div>
        </div>

        <div className={'flex justify-center gap-16 mt-10 mb-20 px-20'}>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Positions by Day</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRateByDay, 500, 500)} />
            </div>

            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Positions by Day Win</div>
                <AgCharts options={getChartConfigForBacktest(tableData.filter((item) => (item.result === 'win')), getWinRateByDay, 500, 500)} />
            </div>

            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Positions by Day Lose</div>
                <AgCharts options={getChartConfigForBacktest(tableData.filter((item) => (item.result === 'lose')), getWinRateByDay, 500, 500)} />
            </div>
        </div>

        {/*<div className={'flex justify-center gap-16 mt-10 mb-20 px-20'}>*/}
        {/*    <div className={'flex flex-col items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-5'}>Positions by Month</div>*/}
        {/*        <AgCharts options={getChartConfigForBacktest(tableData, getWinRateByMonth, 500, 500)} />*/}
        {/*    </div>*/}

        {/*    <div className={'flex flex-col items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-5'}>Positions by Month Win</div>*/}
        {/*        <AgCharts options={getChartConfigForBacktest(tableData.filter((item) => (item.result === 'win')), getWinRateByMonth, 500, 500)} />*/}
        {/*    </div>*/}

        {/*    <div className={'flex flex-col items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-5'}>Positions by Month Lose</div>*/}
        {/*        <AgCharts options={getChartConfigForBacktest(tableData.filter((item) => (item.result === 'lose')), getWinRateByMonth, 500, 500)} />*/}
        {/*    </div>*/}
        {/*</div>*/}


        <div className={'flex justify-center gap-16 mb-20'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Open relation</div>
                <AgCharts options={getChartConfig(tableData, 'open', OPENS_LABEL,  500, 500)} />
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Open relation Win</div>
                <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'win')), 'open', OPENS_LABEL,  500, 500) } />
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Open relation Lose</div>
                <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'lose')), 'open', OPENS_LABEL, 500, 500)} />
            </div>
        </div>

        {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>Opening Type</div>*/}
        {/*        <AgCharts options={getChartConfig(tableData, 'opening_type', OPENING_TYPES,  500, 500)} />*/}
        {/*    </div>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>Opening Type Win</div>*/}
        {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'win')), 'opening_type', OPENING_TYPES,  500, 500) } />*/}
        {/*    </div>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>Opening Type Lose</div>*/}
        {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'lose')), 'opening_type', OPENING_TYPES,  500, 500)} />*/}
        {/*    </div>*/}
        {/*</div>*/}

        {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>Day Type</div>*/}
        {/*        <AgCharts options={getChartConfig(tableData, 'type_day', DAY_TYPES_LABEL,  500, 500)} />*/}
        {/*    </div>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>Day Type Win</div>*/}
        {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'win')), 'type_day', DAY_TYPES_LABEL,  500, 500) } />*/}
        {/*    </div>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>Day Type Lose</div>*/}
        {/*        <AgCharts options={getChartConfig(tableData.filter((item) => (item.result === 'lose')), 'type_day', DAY_TYPES_LABEL,  500, 500)} />*/}
        {/*    </div>*/}
        {/*</div>*/}

        <div className={'flex justify-center gap-16 mt-20 mb-10'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size </div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_size'), 1700, 300)} />
            </div>
        </div>

        <div className={'flex justify-center gap-16 mt-20 mb-10'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size Segmented</div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_size_segmented'), 1700, 300)} />
            </div>
        </div>

        <div className={'flex justify-center gap-5 mt-20 mb-20'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size Win Positions</div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'win')), 'ib_size'), 850, 300)} />
            </div>

            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size Lose Positions</div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'lose')), 'ib_size'), 850, 300)} />
            </div>
        </div>

        <div className={'flex justify-center gap-5 mt-20 mb-20'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size Win Positions</div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'win')), 'ib_size_segmented'), 850, 300)} />
            </div>

            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size Lose Positions</div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'lose')), 'ib_size_segmented'), 850, 300)} />
            </div>
        </div>


        {/*<Table columns={columns} data={removeOppositeDirections(optimizedData)} filterData={tableData} onClickRow={() => {}}/>*/}
        <Table columns={columns} data={tableData} filterData={tableData} onClickRow={() => {}}/>
    </Page>
}