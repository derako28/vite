import {Checkbox} from "./share/Checkbox/checkbox.jsx";
import {FILD_TYPES} from "../pages/Stats/constants";
import {capitalizeFirstLetter} from "../pages/Stats/utils";

export const Table = ({columns, data = [], onClickRow, isFooter= true}) => {
    if(!data) return false

    return (
        <>
            <div className="relative overflow-x-auto pb-14">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-15">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map((column) => {
                            return (
                                <th scope="col" className="px-6 py-3" key={column.id}>
                                    {column.title}
                                </th>
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                        <>
                            {
                                data.map((item, index)=> {
                                    return (
                                        <tr className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-900" key={index}
                                            onClick={() => onClickRow(item)}
                                        >{
                                            columns.map((column) => {
                                                if (column.type == FILD_TYPES.CHECKBOX) {

                                                    return <td className=" px-6 py-4" key={column.id}>
                                                        <div>
                                                            <Checkbox className="flex justify-start" checked={item[column.id] === "Yes" || item[column.id] === true} readOnly/>
                                                        </div>
                                                    </td>
                                                }

                                                return  (<td className="px-6 py-4" key={column.id}>
                                                    {capitalizeFirstLetter(item[column.id]) || '-'}
                                                </td>)
                                            } )
                                        }</tr>
                                    )
                                })
                            }
                        </>
                    </tbody>
                </table>
                {isFooter &&
                    <div className={'fixed left-0 bottom-0 right-0'}>
                        <div className="w-full bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="px-6 py-4">Count: {data.length}</div>
                        </div>
                    </div>}

            </div>
        </>
    )
}