import {Link} from "react-router-dom";

export const Header = () => {
    return (
        <div className={'flex gap-8 text-gray-300 p-4 mb-8'}>
            {/*<Link to={'/stats-table'} >Table</Link>*/}
            {/*<Link to={'/stats-table-new'} >Table New</Link>*/}
            {/*<Link to={'/stats-charts'} >Charts 2023</Link>*/}
            {/*<Link to={'/stats-charts-2024'} >Charts 2024</Link>*/}
            <Link to={'/stats-charts-es'} >Charts ES</Link>
            <Link to={'/stats-charts-nq'} >Charts NQ</Link>
            {/*<Link to={'/backtests'} >Backtests</Link>*/}
            {/*<Link to={'/backtests-sanya'} >Backtests Sanya</Link>*/}
            {/*<Link to={'/backtests-tapok'} >Backtests Tapok</Link>*/}
            {/*<Link to={'/backtests-tapok-US500'} >Backtests Tapok US500</Link>*/}
        </div>
    )
}