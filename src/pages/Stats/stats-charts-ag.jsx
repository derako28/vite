import data from '../../Data/data-new.json'


import {useState} from "react";
import {
    dataWithIbInfo,
    getBarChartConfig, getBarChartHorizontalConfig,
    getChartConfig, getChartConfigForExt,
    getDataIBChart, getDataIBSizeChart,
    getDayOfWeek,
    getOptions, segmentData
} from "./utils";
import {
    DAY_TYPES_LABEL,
    DAYS_OPTIONS,
    FILTER_TYPES,
    IB_BROKEN_LABELS, IB_BROKEN_OPTIONS,
    OPENING_TYPES,
    OPENS_LABEL, OPENS_OPTIONS,
} from "./constants";
import {Filter} from "../../components/filter.jsx";
import {Page} from "../../components/share/Page/page.jsx";

import { AgCharts } from 'ag-charts-react';

import moment from 'moment';
import {Table} from "../../components/table.jsx";

const filterOptions = [
    // { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },
    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS)},
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)},
    { id: 'type_day', title: 'Type Day', filter: false },
    { id: 'direction', title: 'Direction', filter: false  },
    { id: 'ib_size', title: 'IB Size'},
    { id: 'ib_size_from', title: 'IB Size From'},
    { id: 'ib_size_to', title: 'IB Size To'},
    { id: 'ib_size_segmented', title: 'IB Size Segmented'},
    { id: 'ib_ext', title: 'IB_Exp',   filter: false },
    { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false  },
    { id: 'ib_broken', title: 'IB Broken', filter: false,  type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN_OPTIONS)  },
    { id: 'ib_broken_2h', title: 'IB Broken 2h', filter: false,  type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN_OPTIONS)  },
    { id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS },
]

const columns =  [
    { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },
    { id: 'open', title: 'Open', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS) },
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)  },
    { id: 'type_day', title: 'Type Day', type: FILTER_TYPES.SELECT   },
    { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT  },
    { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT  },
    { id: 'ib_size', title: 'IB Size'},
    { id: 'ib_ext', title: 'IB_Exp', filter: false },
    { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false },
];


const initialData = segmentData(data)

export const StatsChartsAg = () => {
    const [tableData, setTableData] = useState(initialData)

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
                    <div className={'text-gray-300 mb-10'}>Open relation</div>
                    <AgCharts options={getChartConfig(tableData, 'open', OPENS_LABEL,  600, 600)} />
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300 mb-10'}>Opening Type</div>
                    <AgCharts options={getChartConfig(tableData, 'opening_type', OPENING_TYPES,  600, 600) } />
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300 mb-10'}>Day Type</div>
                    <AgCharts options={getChartConfig(tableData, 'type_day', DAY_TYPES_LABEL,  600, 600)} />
                </div>
            </div>

            <div className={'flex justify-center gap-16 mb-20'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300 mb-10'}>IB Extension (London)</div>
                    <AgCharts options={getChartConfigForExt(tableData, 'ib_ext', OPENS_LABEL, tableData.length,  600, 600)} />
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300 mb-10'}>IB Extension (NY Continuation London)</div>
                    <AgCharts options={getChartConfigForExt(tableData, 'ib_ext_ny', OPENING_TYPES, tableData.length,  600, 600) } />
                </div>

                {/*<div className={'flex flex-col justify-center items-center'}>*/}
                {/*    <div className={'text-gray-300 mb-10'}>NY Continuation</div>*/}
                {/*    <AgCharts options={getChartConfigForExtContinuation(tableData, 600, 600) } />*/}
                {/*</div>*/}
            </div>

            {/*<div className={'flex justify-center gap-16 mb-20'}>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300 mb-10'}>IB Extension (London)</div>*/}
            {/*        <AgCharts options={getChartConfigForExtProbabilityReturn(tableData, 'ib_ext', tableData.length,  600, 600)} />*/}
            {/*    </div>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300 mb-10'}>IB Extension (London + NY)</div>*/}
            {/*        <AgCharts options={getChartConfigForExtProbabilityReturn(tableData, 'ib_ext_ny',  tableData.length, 600, 600) } />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className={'flex justify-center gap-16 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Broken by London</div>
                    <AgCharts options={getBarChartConfig(getDataIBChart(dataWithIbInfo(tableData), IB_BROKEN_LABELS), tableData.length, 700, 300)} />
                </div>

                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Broken by All Day</div>
                    <AgCharts options={getBarChartConfig(getDataIBChart(dataWithIbInfo(tableData, 'ib_broken_ny'), IB_BROKEN_LABELS),   tableData.length,700, 300)} />
                </div>
            </div>



            <div className={'flex justify-center gap-16'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>2h IB Broken </div>
                    <AgCharts options={getBarChartConfig(getDataIBChart(dataWithIbInfo(tableData, 'ib_broken_2h'), IB_BROKEN_LABELS), tableData.length,  700, 300)} />
                </div>
            </div>

            {/*<div className={'flex justify-center gap-16 mt-20'}>*/}
            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>IB Extension (London)</div>*/}
            {/*        <AgCharts options={getBarChartConfig(getDataIExtensionChart(tableData),  700, 300)} />*/}
            {/*    </div>*/}

            {/*    <div className={'flex flex-col justify-center items-center'}>*/}
            {/*        <div className={'text-gray-300'}>IB Extension (NY Continuation London)</div>*/}
            {/*        <AgCharts options={getBarChartConfig(getDataIExtensionChart(tableData, 'ib_ext_ny'),  700, 300)} />*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className={'flex justify-center gap-16 mt-20 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Size </div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_size'), tableData.length,  1700, 300)} />
                </div>
            </div>

            <div className={'flex justify-center gap-16 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Extension</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_ext'), tableData.length, 1700, 300)} />
                </div>
            </div>


            <div className={'flex justify-center gap-16 mt-20 mb-10'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Size Segmented</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_size_segmented'), tableData.length, 1700, 300)} />
                </div>
            </div>

            <div className={'flex justify-center gap-16 mb-20'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <div className={'text-gray-300'}>IB Extension NY</div>
                    <AgCharts options={getBarChartHorizontalConfig(getDataIBSizeChart(tableData, 'ib_ext_ny'), tableData.length, 1700, 300)} />
                </div>
            </div>


            {/*<Table  columns={columns} data={tableData} filterData={tableData} />*/}
        </div>
    </Page>
}