import data from '../../Data/es-09-24.json'

import {Table} from "../../components/table.jsx";
import BacktestData from '../Backtests/data-backtests-2.json'

import {useEffect, useState} from "react";
import {getDayOfWeek, prepareDataABC, setMatchOpeningType} from "./utils";
import {Page} from "../../components/share/Page/page.jsx";
import {Modal} from "../../components/share/Modal/modal.jsx";
import {BacktestTable} from "../Backtests/backtest-table.jsx";

import moment from "moment/moment";
import {FILD_TYPES} from "./constants";


const columns =  [
    { id: 'TPO_Date', title: 'Date' },

    // { id: 'open_relation', title: 'Open Relation' },
    // { id: 'close_relation_prev', title: 'close_relation_prev' },
    // { id: 'close_relation', title: 'close_relation' },
    { id: 'manualOpeningType', title: 'Manual Opening Type' },
    { id: 'opening_type', title: 'Opening Type'  },
    { id: 'matchOpeningType', title: 'Matched Opening Type', type: FILD_TYPES.CHECKBOX },
    { id: 'ibRange', title: 'IB Range'  },
    // { id: 'type_day', title: 'Type Day'  },

    // { id: 'TPO_High', title: 'TPO_High' },
    // { id: 'TPO_Low', title: 'TPO_Low' },
    // { id: 'POC', title: 'POC' },
    { id: 'TPO_Open', title: 'TPO_Open' },
    // { id: 'TPO_Close', title: 'TPO_Close' },
    { id: 'VAH', title: 'VAH' },
    { id: 'VAL', title: 'VAL' },
    { id: 'A_High', title: 'A_High' },
    { id: 'A_Low', title: 'A_Low' },
    { id: 'B_High', title: 'B_High' },
    { id: 'B_Low', title: 'B_Low' },
    { id: 'C_High', title: 'C_High' },
    { id: 'C_Low', title: 'C_Low' },

];

// const filterOptions = [...columns, {id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS}]

const initialData = prepareDataABC(data)
const dataWithMatchedOpeningType = setMatchOpeningType(initialData)


export const StatsTableNew = () => {
    const [tableData, setTableData] = useState(dataWithMatchedOpeningType)
    const [modalData, setModalData] = useState()
    const [matchedOpeningType, setMatchedOpeningType] = useState(0)

    const dataMatch = () => {
        let matchedCount = 0

        tableData.map((item) => {

            if(item.matchOpeningType) {
                matchedCount++;
            }
        })

        setMatchedOpeningType((matchedCount / tableData.length * 100).toFixed(0))
    }

    const dataFilter = (dataFilter) => {
        const startDate = moment(dataFilter.date?.startDate)
        const endDate = moment(dataFilter.date?.endDate)

        const newData = data.filter(item => {

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
                    // return +item[key] === +dataFilter[key]
                    return +item[key] >= +dataFilter[key] - 5 && +item[key] <= +dataFilter[key] + 5
                }

                return item[key]?.toString().toLowerCase()?.includes(dataFilter[key].toString().toLowerCase());
            });
        });

        setTableData(newData)
    }

    useEffect(() => {
        dataMatch()
    }, [dataMatch]);

    return <Page>

        <div className={'text-white font-bold mb-10 px-4'}>
            Matched Opening Type: {matchedOpeningType}%
        </div>

        <Modal  onClose={() => setModalData(null)} onShow={!!modalData}>
            {modalData?.screen && <img src={modalData.screen}/> }

            <div className={'mt-5 text-gray-200'}>
                <BacktestTable data={BacktestData.filter((item) => {
                    return item?.date === modalData?.date
                })} />
            </div>
        </Modal>

        {/*<Filter options={filterOptions} onChange={dataFilter}/>*/}
        <Table columns={columns} data={tableData} filterData={tableData} onClickRow={(item) => {

            // setModalData(item)
        }}/>

    </Page>
}