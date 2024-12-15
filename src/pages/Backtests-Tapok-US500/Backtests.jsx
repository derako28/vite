import {Page} from "../../components/share/Page/page.jsx";
import {Filter} from "../../components/filter.jsx";
import {Table} from "../../components/table.jsx";
import {useState} from "react";

import data from "./data-backtests-2.json";
import dataStats from "../Stats/data-ib-broke-us.json";

import {AgCharts} from "ag-charts-react";
import {
    getChartConfigForBacktest,
    getCloseSession,
    getDirection,
    getOpenSession,
    getWinRate,
    mergeStatsAndBack
} from "./utils";
import {
    DAY_TYPES_LABEL,
    DAYS_OPTIONS,
    FILD_TYPES,
    FILTER_TYPES,
    OPENING_TYPES, OPENS_LABEL,
    OPENS_OPTIONS
} from "../Stats/constants";
import {
    getChartConfig,
    getDayOfWeek,
    getOptions
} from "../Stats/utils";
import moment from "moment/moment";

const columns = [
    { id: 'date', title: 'Date',  },

    // { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS) },
    // { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)  },
    // { id: 'type_day', title: 'Type Day', type: FILTER_TYPES.SELECT, options: getOptions(DAY_TYPES)  },
    // { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    // { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION)  },
    // { id: 'ib_size', title: 'IB Size'},
    // { id: 'ib_ext', title: 'IB_Exp', filter: false },
    // { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false },

    { id: 'BIAS', title: 'BIAS' },
    { id: 'Direction', title: 'Direction' },
    { id: 'open_session', title: 'Open Session' },
    { id: 'close_session', title: 'Close Session' },

    // { id: 'IB', title: 'IB Size' },
    // { id: 'SL, tick', title: 'SL, tick' },

    { id: '1R', title: '1R', type: FILD_TYPES.CHECKBOX },
    { id: '2R', title: '2R', type: FILD_TYPES.CHECKBOX},
    { id: '3R', title: '3R', type: FILD_TYPES.CHECKBOX },
    // { id: 'Following context', title: 'Following context' },
]

const filterOptions = [
    { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },

    // { id: 'BIAS', title: 'BIAS' },

    { id: 'Direction', title: 'Direction' },

    // { id: 'Session', title: 'Session' },
    // { id: 'Following context', title: 'Following context' },

    { id: 'ib_size', title: 'IB Size' },
    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS)},
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
    { id: 'type_day', title: 'Type Day', filter: false },
    { id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS }
]


const initialData = mergeStatsAndBack(dataStats, data);

export const Backtests = () => {
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
                    // return +item[key] >= +dataFilter[key] - 5 && +item[key] <= +dataFilter[key] + 5
                }

                return item[key]?.toString().toLowerCase()?.includes(dataFilter[key].toString().toLowerCase());
            });
        });

        setTableData(filteredData)
    }



    return <Page>
        <Filter options={filterOptions} onChange={dataFilter}/>

        <div className={'flex justify-center gap-16 mb-20'}>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Open relation</div>
                <AgCharts options={getChartConfig(tableData, 'open', OPENS_LABEL,  500, 400)} />
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Opening Type</div>
                <AgCharts options={getChartConfig(tableData, 'opening_type', OPENING_TYPES,  500, 400) } />
            </div>
            <div className={'flex flex-col justify-center items-center'}>
                <div className={'text-gray-300 mb-10'}>Day Type</div>
                <AgCharts options={getChartConfig(tableData, 'type_day', DAY_TYPES_LABEL,  500, 400)} />
            </div>
        </div>

        <div className={'flex justify-center gap-16 mt-10 mb-20 px-20'}>
            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Win Rate</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getWinRate, 400, 400)} />
            </div>

            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Direction</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getDirection, 400, 400)} />
            </div>

            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Open in Session</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getOpenSession, 400, 400)} />
            </div>

            <div className={'flex flex-col items-center'}>
                <div className={'text-gray-300 mb-5'}>Close in Session</div>
                <AgCharts options={getChartConfigForBacktest(tableData, getCloseSession, 400, 400)} />
            </div>
        </div>

        {/*<div className={'flex justify-center gap-16 mt-10 mb-20 px-20'}>*/}
        {/*    <div className={'flex flex-col justify-center items-center'}>*/}
        {/*        <div className={'text-gray-300'}>IB Broken by London</div>*/}
        {/*        <AgCharts options={getBarChartConfig(getDataIBChart(dataWithIbInfo(tableData), RR_LABELS),  700, 300)} />*/}
        {/*    </div>*/}
        {/*</div>*/}


        <Table columns={columns} data={tableData} filterData={tableData} onClickRow={(item) => {
            setModalData(item)
        }}/>
    </Page>
}