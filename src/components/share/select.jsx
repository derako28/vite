import React, {forwardRef} from "react";



const selectClass = 'cursor-pointer w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
export const SelectMy = forwardRef(({options = [], label = '', ...props}, ref) => {
    return (
        <div style={{minWidth: 120}}>
            <label className="block mb-2 text-sm font-medium text-gray-400">{label}</label>
            <select id="countries" className={selectClass} {...props} ref={ref}>
                <option value={''} key={'empty'}>-</option>
                {options?.map((option) => (<option value={option.value} key={option.value}>{option.label}</option>))}
            </select>
        </div>

    )
})