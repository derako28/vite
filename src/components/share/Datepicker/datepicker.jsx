import Datepicker from "react-tailwindcss-datepicker";
import React, {forwardRef} from "react";

export const DatepickerMY = forwardRef(({ label,  ...props}, ref) => {
    return (
        <div style={{width: 280}}>
            <label className="block mb-2 text-sm font-medium text-gray-400">{label}</label>
            <Datepicker
                containerClassName="relative"
                inputClassName="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                // asSingle={true}
                useRange={false}
                displayFormat={'DD-MM-YYYY'}
                {...props}
            />
        </div>
    )
})