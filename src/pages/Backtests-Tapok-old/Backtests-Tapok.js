import {Page} from "../../components/share/Page/page.jsx";
import {Filter} from "../../components/filter.jsx";
import {Table} from "../../components/table.jsx";
import {useState} from "react";

import dataStats from "../../Data/data-new.json";
import dataBacktest from "./data.json";

import {AgCharts} from "ag-charts-react";
import {
    getChartConfigForBacktest,
    getDirection,
    getWinRate,
    mergeStatsAndBack
} from "./utils";
import {
    DAY_TYPES, DAY_TYPES_LABEL,
    DAYS_OPTIONS,
    DIRECTION_OPTIONS,
    FILTER_TYPES,
    IB_BROKEN, IB_BROKEN_LABELS,
    OPENING_TYPES,
    OPENS_LABEL,
    OPENS_OPTIONS, RESULT_OPTIONS
} from "../Stats/constants";
import {
    dataWithIbInfo,
    getBarChartConfig,
    getBarChartHorizontalConfig,
    getChartConfig,
    getDataIBChart,
    getDataIBSizeChart,
    getDayOfWeek,
    getOptions
} from "../Stats/utils";
import moment from "moment/moment";

const columns = [
    { id: 'date', title: 'Date',  },

    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS) },
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)  },
    { id: 'type_day', title: 'Type Day', type: FILTER_TYPES.SELECT, options: getOptions(DAY_TYPES)  },
    { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    // { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION)  },
    { id: 'ib_size', title: 'IB Size'},
    { id: 'ib_ext', title: 'IB_Exp', filter: false },
    { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false },

    { id: '1R', title: '1R', filter: false },
    { id: '1.5R', title: '1.5R', filter: false },
    { id: '2R', title: '2R', filter: false },
    { id: '2.5R', title: '2.5R', filter: false },
    { id: '3R', title: '3R', filter: false },
    { id: '3.5R', title: '3.5R', filter: false },
    { id: '4R', title: '4R', filter: false },
    { id: '4.5R', title: '4.5R', filter: false },
    { id: '5R', title: '5R', filter: false },
    { id: 'RR (max)', title: 'RR (max)', filter: false },
]

const filterOptions = [
    { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },

    { id: 'ib_size', title: 'IB Size' },
    { id: 'ib_size_from', title: 'IB Size From'},
    { id: 'ib_size_to', title: 'IB Size To'},

    // { id: 'ib_size_range', title: 'IB Size Range (-+5)' },

    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS)},
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
    { id: 'type_day', title: 'Type Day', filter: false },
    { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION_OPTIONS) },
    { id: 'result', title: 'Result', type: FILTER_TYPES.SELECT, options: getOptions(RESULT_OPTIONS) },
    { id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS }
]


const initialData = mergeStatsAndBack(dataStats, dataBacktest);

// const initialData = mergeStatsAndBack(dataStats, data).filter((item) => {
//     return item.day !== "Четверг" && item.ib_size <= 70
// });


export const BacktestsTapok = () => {
    const [tableData, setTableData] = useState(initialData || [])
    const [modalData, setModalData] = useState()

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



    return <Page>
        <div>
            <Filter options={filterOptions} onChange={dataFilter}/>

            <div className={"text-gray-300 flex flex-col align-middle items-start my-5 px-4 gap-3"}>
                <div>Count: {tableData.length}</div>
                {/*<div> Exclude: "Четверг" IB > 70, IB = 35</div>*/}
            </div>
        </div>

        <div className={'flex justify-center gap-16 mt-10 mb-10 px-20'}>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (1R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '1R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (1.5R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '1.5R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (2R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '2R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (2.5R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '2.5R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (3R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '3R', 300, 300)} />
            </div>



            {/*<div className={'flex flex-col items-center'}>*/}
            {/*    <div className={'text-gray-300 mb-5'}>Direction</div>*/}
            {/*    <AgCharts options={getChartConfigForBacktest(tableData, getDirection, 300, 300)} />*/}
            {/*</div>*/}

            {/*<div className={'flex flex-col items-center'}>*/}
            {/*    <div className={'text-gray-300 mb-5'}>Open in Session</div>*/}
            {/*    <AgCharts options={getChartConfigForBacktest(tableData, getOpenSession, 400, 400)} />*/}
            {/*</div>*/}

            {/*<div className={'flex flex-col items-center'}>*/}
            {/*    <div className={'text-gray-300 mb-5'}>Close in Session</div>*/}
            {/*    <AgCharts options={getChartConfigForBacktest(tableData, getCloseSession, 400, 400)} />*/}
            {/*</div>*/}
        </div>

        <div className={'flex justify-center gap-16 mt-10 mb-5 px-20'}>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (3.5R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '3.5R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (4R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '4R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (4.5R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '4.5R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (5R)</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  '5R', 300, 300)} />
            </div>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate (RR (max))</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate,  'RR (max)', 300, 300)} />
            </div>
        </div>

        <div className={'flex justify-center gap-16 mb-20'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Open relation</div>
                <AgCharts options={getChartConfig(tableData, 'open', OPENS_LABEL,  400, 400)} />
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Opening Type</div>
                <AgCharts options={getChartConfig(tableData, 'opening_type', OPENING_TYPES,  400, 400) } />
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Day Type</div>
                <AgCharts options={getChartConfig(tableData, 'type_day', DAY_TYPES_LABEL,  400, 400)} />
            </div>
        </div>

        {/*<div className={'flex justify-center gap-16 mt-10 mb-20 px-20'}>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300'}>IB Broken by London</div>*/}
        {/*        <AgCharts options={getBarChartConfig(getDataIBChart(dataWithIbInfo(tableData), RR_LABELS),  700, 300)} />*/}
        {/*    </div>*/}
        {/*</div>*/}

        {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>IB Extension (London)</div>*/}
        {/*        <AgCharts options={getChartConfigForExt(tableData, 'ib_ext', OPENS_LABEL,  600, 600)} />*/}
        {/*    </div>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300 mb-10'}>IB Extension (NY Continuation London)</div>*/}
        {/*        <AgCharts options={getChartConfigForExt(tableData, 'ib_ext_ny', OPENING_TYPES,  600, 600) } />*/}
        {/*    </div>*/}
        {/*</div>*/}

        <div className={'flex justify-center gap-16 mt-20 mb-10'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size </div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_size'), 1700, 300)} />
            </div>
        </div>

        <div className={'flex justify-center gap-5 mt-20 mb-10'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size Win Positions</div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'win')), 'ib_size'), 900, 300)} />
            </div>

            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300'}>IB Size Lose Positions</div>
                <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData.filter((item) => (item.result === 'lose')), 'ib_size'), 900, 300)} />

            </div>
        </div>

        {/*<div className={'flex justify-center gap-16 mb-10'}>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300'}>IB Extension</div>*/}
        {/*        <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_ext'), 1700, 300)} />*/}
        {/*    </div>*/}
        {/*</div>*/}

        {/*<div className={'flex justify-center gap-16'}>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300'}>IB Extension NY</div>*/}
        {/*        <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_ext_ny'), 1700, 300)} />*/}
        {/*    </div>*/}
        {/*</div>*/}


        <Table columns={columns} data={tableData} filterData={tableData} onClickRow={(item) => {
            setModalData(item)
        }}/>
    </Page>
}