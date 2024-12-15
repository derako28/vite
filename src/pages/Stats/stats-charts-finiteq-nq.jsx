import dataFiniteq from '../../Data/algo-nq.json'


import {useState} from "react";
import {
    dataWithIbInfo,
    getBarChartHorizontalConfig,
    getChartConfig,
    getDataChart,
    getDataIBChart,
    getDataIBSizeChart, getDataIExtensionChart,
    getDayOfWeek,
    getOptions,
    prepareDataFiniteq,
    segmentData
} from "./utils";
import {
    CLOSE_LABEL_BY_CURRENT_DAY,
    DAY_TYPES_LABEL,
    DAYS_OPTIONS,
    FILTER_TYPES,
    IB_BROKEN_LABELS, IB_BROKEN_OPTIONS,
    OPENING_TYPES,
    OPENS_LABEL, OPENS_OPTIONS, TEST_OPTIONS,
} from "./constants";
import {Filter} from "../../components/filter.jsx";
import {Page} from "../../components/share/Page/page.jsx";

import { AgCharts } from 'ag-charts-react';

import moment from 'moment';

// const dateFormat = "YYYY-MM-DD"
// const dateFormat = "DD-MM-YYYY"

const filterOptions = [
    // { id: 'TPO_Date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },
    { id: 'open_relation', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS)},
    // { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
    // { id: 'type_day', title: 'Type Day', filter: false },
    { id: 'ib_size', title: 'IB Size'},
    { id: 'ib_size_from', title: 'IB Size From'},
    { id: 'ib_size_to', title: 'IB Size To'},
    { id: 'ib_size_segmented', title: 'IB Size Segmented'},
    { id: 'ib_ext', title: 'IB_Exp',   filter: false },

    { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN_OPTIONS)},


    // { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false  },
    { id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
]

const columns =  [
    { id: 'TPO_Date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },
    { id: 'open', title: 'Open', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS) },
    { id: 'type_day', title: 'Day Type' },
    { id: 'opening_type', title: 'Opening Type' },
    // { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)  },
    // { id: 'type_day', title: 'Type Day', type: FILTER_TYPES.SELECT   },
    { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT  },
    // { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT  },
    { id: 'ib_size', title: 'IB Size'},
    { id: 'ib_ext', title: 'IB_Exp' },
    { id: 'TPO_Open', title: 'TPO Open' },
    { id: 'TPO_High', title: 'TPO High' },
    { id: 'TPO_Low', title: 'TPO Low' },
    { id: 'VAH', title: 'VAH' },
    { id: 'VAL', title: 'VAL' },
    // { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false },
];


// const initialData = dataFiniteq
const initialData = segmentData(prepareDataFiniteq(dataFiniteq), 1)

    // .filter((item) => (getYear(item.TPO_Date) > 2018))

// const initialData = segmentData(prepareDataFiniteq(dataFiniteq.reverse()), 1).reverse()
// const initialData = segmentData(prepareDataFiniteq(dataFiniteq), 0.5)
    // .filter((item) => (item.ib_size <= 40 && item.ib_size >= 20) )


export const StatsChartsAGFiniteqNQ = () => {
    const [tableData, setTableData] = useState(initialData)

    const dataFilter = (dataFilter) => {
        const startDate = moment(dataFilter.date?.startDate)
        const endDate = moment(dataFilter.date?.endDate)

        const filteredData = initialData.filter(item => {
            return Object.keys(dataFilter).every(key => {
                if (dataFilter[key] === "" || dataFilter[key] === undefined) return true;

                if(key === 'day') {
                    return getDayOfWeek(item.TPO_Date) === dataFilter.day
                }

                if(key === 'date') {
                    const currentDate = moment(item.TPO_Date)

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

                return item[key]?.toString().toLowerCase()?.includes(dataFilter[key].toString().toLowerCase());
            });
        });

        setTableData(filteredData)
    }

    return <Page>
        <Filter options={filterOptions} onChange={dataFilter}/>

        <div className={"text-gray-300 flex flex-col align-middle items-start my-5 px-4 gap-3"}>
            <div>Count: {tableData.length}</div>
            {/*<div> Exclude: "Четверг" IB > 70, IB = 35</div>*/}
        </div>


        <div className={'mt-8 pb-20'}>
            <div className={'flex justify-center gap-16 mb-20'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300 mb-10'}>Open Relation</div>
                    <AgCharts options={getChartConfig(tableData, 'open_relation', OPENS_LABEL,  600, 600)} />
                </div>

                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300 mb-10'}>Close Relation Prev</div>
                    <AgCharts options={getChartConfig(tableData, 'close_relation_prev', OPENS_LABEL,  600, 600)} />
                </div>

                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300 mb-10'}>Close Relation</div>
                    <AgCharts options={getChartConfig(tableData, 'close_relation', OPENS_LABEL,  600, 600)} />
                </div>
            </div>




            {/*<div className={'flex justify-center gap-16 mb-10'}>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>Open Relation</div>*/}
            {/*        <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'open_relation', OPENS_LABEL), tableData.length, 700, 500)} />*/}
            {/*    </div>*/}

            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300 mb-10'}>Close Relation Prev</div>*/}
            {/*        <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'close_relation_prev', OPENS_LABEL),  tableData.length, 600, 600)} />*/}
            {/*    </div>*/}

            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>Close Relation</div>*/}
            {/*        <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'close_relation', CLOSE_LABEL_BY_CURRENT_DAY), tableData.length, 700, 500)} />*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300 mb-10'}>Day Type</div>*/}
            {/*        <AgCharts options={getChartConfig(tableData, 'type_day', DAY_TYPES_LABEL,  700, 600)} />*/}
            {/*    </div>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300 mb-10'}>Opening Type</div>*/}
            {/*        <AgCharts options={getChartConfig(tableData, 'opening_type', OPENING_TYPES,  480, 600) } />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className={'flex justify-center gap-16 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>Test VA</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'isTestVA', TEST_OPTIONS), tableData.length, 500, 500)} />
                </div>

                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>Test POC</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'isTestPOC', TEST_OPTIONS), tableData.length, 500, 500)} />
                </div>

                {/*<div className={'flex flex-col justify-center items-center'}>*/}
                {/*    <div className={'text-gray-300'}>Test IB</div>*/}
                {/*    <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'isTestIB', TEST_OPTIONS), tableData.length, 500, 500)} />*/}
                {/*</div>*/}
            </div>

            {/*<div className={'flex justify-center gap-16 mb-10'}>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>Day Type</div>*/}
            {/*        <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'type_day', DAY_TYPES_LABEL), tableData.length, 700, 500)} />*/}
            {/*    </div>*/}

            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>Opening Type</div>*/}
            {/*        <AgCharts options={getBarChartHorizontalConfig(getDataChart(tableData, 'opening_type', OPENING_TYPES), tableData.length, 700, 500)} />*/}
            {/*    </div>*/}
            {/*</div>*/}



            {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300 mb-10'}>IB Extension</div>*/}
            {/*        <AgCharts options={getChartConfigForExt(tableData, 'ib_ext', OPENS_LABEL, tableData.length,  900, 600)} />*/}
            {/*    </div>*/}

            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300 mb-10'}>IB Broken</div>*/}
            {/*        <AgCharts options={getChartConfigUniversal(tableData, getDataChartIBBroken, 'ib_broken', IB_BROKEN_LABELS,  900, 600)} />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className={'flex justify-center gap-16 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Ext</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIExtensionChart(tableData, OPENS_LABEL), tableData.length, 700, 500)} />
                </div>

                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Broken</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIBChart(dataWithIbInfo(tableData), IB_BROKEN_LABELS), tableData.length, 700, 500)} />
                </div>
            </div>

            {/*<div className={'flex justify-center gap-16 mb-10'}>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>IB Ext</div>*/}
            {/*        <AgCharts options={getBarChartHorizontalConfig(getDataIExtensionChart(tableData, OPENS_LABEL), 700, 500)} />*/}
            {/*    </div>*/}

            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>IB Broken</div>*/}
            {/*        <AgCharts options={getBarChartHorizontalConfig(getDataIBChart(dataWithIbInfo(tableData), IB_BROKEN_LABELS), 700, 500)} />*/}
            {/*    </div>*/}
            {/*</div>*/}


            <div className={'flex justify-center gap-16 mt-20 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Size Segmented</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_size_segmented'), null,1900, 300)} />
                </div>
            </div>


            <div className={'flex justify-center gap-16 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Extension Segmented</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_ext_segmented'), null,1900, 300)} />
                </div>
            </div>

            {/*<Table  columns={columns} data={tableData} filterData={tableData} />*/}
        </div>
    </Page>
}