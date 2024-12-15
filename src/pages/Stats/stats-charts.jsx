import data from './data-new.json'
import {useEffect, useState} from "react";
import {getConfigChart, getDayOfWeek, getOptions} from "./utils";
import {
    DAY_TYPES_LABEL,
    DAYS_OPTIONS,
    FILTER_TYPES,
    IB_BROKEN,
    OPENING_TYPES,
    OPENS, OPENS_LABEL,
} from "./constants";
import {Filter} from "../../components/filter.jsx";
import Chart from "react-apexcharts";
import {Page} from "../../components/share/Page/page.jsx";

import { AgCharts } from 'ag-charts-react';


const columns =  [
    // {
    //     id: 'property',
    //     title: '#',
    //     minWidth: 150,
    // },
    { id: 'date', title: 'Date', minWidth: 110, type: FILTER_TYPES.DATEPICKER },
    { id: 'open', title: 'Open', minWidth: 170,  filter: false},
    { id: 'opening_type', title: 'Opening Type', minWidth: 530,  filter: false},
    { id: 'type_day', title: 'Type Day', minWidth: 160,  filter: false },
    { id: 'ib_broken', title: 'IB Broken', minWidth: 110, type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    { id: 'direction', title: 'Direction', minWidth: 110, filter: false,   },
    { id: 'ib_size', title: 'IB Size', minWidth: 110},
    { id: 'ib_ext', title: 'IB_Exp', minWidth: 110 ,  filter: false },
    { id: 'ib_ext_ny', title: 'IB Exp NY', minWidth: 110,  filter: false  },
    // { id: 'IB_Broken', title: 'IB Broken', minWidth: 110 },
    // { id: 'Broken_High', title: 'Broken High', minWidth: 110 },
    // { id: 'Broken_Low', title: 'Broken Low', minWidth: 110 },

];

const filterOptions = [...columns, {id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS}]

export const StatsCharts = () => {
    const [tableData, setTableData] = useState(data)
    const [dataCharts, setDataCharts] = useState({})

    const dataFilter = (dataFilter) => {
        const newData = data.filter(item => {

            return Object.keys(dataFilter).every(key => {
                if (dataFilter[key] === "" || dataFilter[key] === undefined) return true;

                if(key === 'day') {
                    return getDayOfWeek(item.date) === dataFilter.day
                }

                return item[key]?.toString().toLowerCase()?.includes(dataFilter[key].toString().toLowerCase());
            });
        });

        setTableData(newData)
    }

    const getConfig = () => {
        const data = {
            open: {},
            opening_type: {},
            type_day: {}
        }

        Object.keys(OPENS).map((key) => {
            data.open[OPENS_LABEL[key]] = tableData.filter((item) => item.open === OPENS_LABEL[key]).length
        })

        Object.keys(OPENING_TYPES).map((key) => {
            data.opening_type[OPENING_TYPES[key]] = tableData.filter((item) => item.opening_type === OPENING_TYPES[key]).length
        })

        Object.keys(DAY_TYPES_LABEL).map((key) => {
            data.type_day[DAY_TYPES_LABEL[key]] = tableData.filter((item) => item.type_day.toLowerCase() === DAY_TYPES_LABEL[key].toLowerCase()).length
        })

        setDataCharts(data)
    }


    useEffect(() => {
        getConfig()
    }, [tableData]);



    return <Page>
        <Filter options={filterOptions} onChange={dataFilter}/>

        <div>
            <div className={'flex justify-center gap-16'}>
                <div className={'flex flex-col justify-center items-center'}>
                    <span className={'text-gray-200 mb-4'}>Open</span>
                    <Chart {...getConfigChart(dataCharts.open)} />
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <span className={'text-gray-200 mb-4'}>Opening Type</span>
                    <Chart {...getConfigChart(dataCharts.opening_type)} />
                </div>
                <div className={'flex flex-col justify-center items-center'}>
                    <span className={'text-gray-200 mb-4'}>Type Day</span>
                    <Chart {...getConfigChart(dataCharts.type_day)} />
                </div>
            </div>


        </div>

    </Page>
}