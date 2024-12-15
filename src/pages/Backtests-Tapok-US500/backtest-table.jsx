import {Table} from "../../components/table.jsx";
import defaultData from './data-backtests.json'

const columns = [
    { id: 'date', title: 'Date' },
    { id: 'BIAS', title: 'BIAS' },
    { id: 'Direction', title: 'Direction' },
    { id: 'Session', title: 'Session' },
    { id: 'IB', title: 'IB Size' },
    { id: 'SL, tick', title: 'SL, tick' },
    // { id: '1R', title: '1R', type: 'Checkbox' },
    { id: '1R', title: '1R' },
    { id: '2R', title: '2R' },
    { id: '3R', title: '3R' },
    { id: 'Following context', title: 'Following context' },
]

export const BacktestTable = ({data = defaultData || []}) => {
    return <>
        <Table columns={columns} data={data} />
    </>
}