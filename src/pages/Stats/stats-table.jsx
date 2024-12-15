import {Table} from "../../components/table.jsx";

import data from './data-ib-broke-us.json'
import BacktestData from '../Backtests/data-backtests-2.json'

import {useState} from "react";
import {getDayOfWeek, getOptions} from "./utils";
import {DAY_TYPES, DAYS_OPTIONS, DIRECTION, FILTER_TYPES, IB_BROKEN, OPENING_TYPES, OPENS_OPTIONS} from "./constants";
import {Filter} from "../../components/filter.jsx";
import {Page} from "../../components/share/Page/page.jsx";
import {Modal} from "../../components/share/Modal/modal.jsx";
import {BacktestTable} from "../Backtests/backtest-table.jsx";

import moment from "moment/moment";
import {getAverage} from "../Backtests-Sanya/utils";


const columns =  [
    { id: 'date', title: 'Date', type: FILTER_TYPES.DATEPICKER_RANGE },
    { id: 'open', title: 'Open Relation', type: FILTER_TYPES.SELECT, options: getOptions(OPENS_OPTIONS) },
    { id: 'opening_type', title: 'Opening Type', type: FILTER_TYPES.SELECT, options: getOptions(OPENING_TYPES)  },
    { id: 'type_day', title: 'Type Day', type: FILTER_TYPES.SELECT, options: getOptions(DAY_TYPES)  },
    { id: 'ib_broken', title: 'IB Broken', type: FILTER_TYPES.SELECT, options: getOptions(IB_BROKEN)  },
    { id: 'direction', title: 'Direction', type: FILTER_TYPES.SELECT, options: getOptions(DIRECTION)  },
    { id: 'ib_size', title: 'IB Size'},
    { id: 'ib_ext', title: 'IB_Exp', filter: false },
    { id: 'ib_ext_ny', title: 'IB Exp NY', filter: false },

];

const filterOptions = [...columns, {id: 'day', title: 'Day', type: FILTER_TYPES.SELECT, options: DAYS_OPTIONS}]

export const StatsTable = () => {
    const [tableData, setTableData] = useState(data)
    const [modalData, setModalData] = useState()



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

    return <Page>
        <Modal  onClose={() => setModalData(null)} onShow={!!modalData}>
            {modalData?.screen && <img src={modalData.screen}/> }

            <div className={'mt-5 text-gray-200'}>
                <BacktestTable data={BacktestData.filter((item) => {
                    return item?.date === modalData?.date
                })} />
            </div>
        </Modal>

        <Filter options={filterOptions} onChange={dataFilter}/>
        <Table columns={columns} data={tableData} filterData={tableData} onClickRow={(item) => {

            setModalData(item)
        }}/>

    </Page>
}