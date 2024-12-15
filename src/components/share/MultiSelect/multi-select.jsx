import React, {forwardRef} from "react";
import Select from "react-tailwindcss-select";


const selectClass2 = 'cursor-pointer w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
const selectClassExtra = selectClass2 + ' '
const classNames = {
    menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
    list: 'bg-black',
    listItem: 'bg-black',
}

export const MultiSelectMy = forwardRef(({options = [], label = '', ...props}, ref) => {
    return (
        <div style={{minWidth: 120}}>
            <label className="block mb-2 text-sm font-medium text-gray-400">{label}</label>
            <Select id="countries" options={options}  {...props} isMultiple ref={ref}
                    classNames={{
                        menuButton: ({ isDisabled }) => (
                            `flex text-sm text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none ${
                                isDisabled
                                    ? "bg-gray-200"
                                    : "bg-white hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                            }`
                        ),
                        menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                        listItem: ({ isSelected }) => (
                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                isSelected
                                    ? `text-white bg-blue-500`
                                    : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                            }`
                        )
                    }}
            />
        </div>
    )
})