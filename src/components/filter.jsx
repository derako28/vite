import {Controller, useForm} from "react-hook-form";
import {DatepickerMY} from "./share/Datepicker/datepicker.jsx";
import {FILTER_TYPES} from "../pages/Stats/constants";
import {SelectMy} from "./share/select.jsx";
import {Button} from "./share/Button/button.jsx"
import {Input} from "./share/Input/input.jsx";
import {InputRange} from "./share/Range/range.jsx";
import {MultiSelectMy} from "./share/MultiSelect/multi-select.jsx";

const defaultValue = {
    ib_size: null,
    date: {
        startDate: "01-01-2024",
        endDate: "31-01-2024",
    }
}
export const Filter = ({options, onChange}) => {
    const { control,  register, getValues, reset, handleSubmit} = useForm(defaultValue);

    const onSubmit = () => {
        onChange(getValues())
    };

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className={'flex align-middle items-end my-5 px-4 gap-3'}>

                {options.map((column) => {
                    if(column.type === FILTER_TYPES.DATEPICKER_RANGE){
                        return  <Controller
                            key={column.id}
                            name={column.id}
                            control={control}
                            render={({ field }) => (
                                <DatepickerMY
                                    label={column.title}
                                    {...field}
                                />
                            )}
                        />
                    }

                    // if(column.type === FILTER_TYPES.RANGE && !column.filter){
                    //     return  <InputRange type={'range'} />
                    // }

                    if(column.type === FILTER_TYPES.SELECT && !column.filter){
                        return  <SelectMy options={column.options} label={column.title} key={column.id} {...register(column.id)}/>
                    }

                    // if(column.type === FILTER_TYPES.MULTI_SELECT && !column.filter){
                    //     return  <MultiSelectMy options={column.options} label={column.title} key={column.id} {...register(column.id)}/>
                    // }

                    if(column.type === FILTER_TYPES.MULTI_SELECT){
                        return  <Controller
                            key={column.id}
                            name={column.id}
                            control={control}
                            render={({ field }) => (
                                <MultiSelectMy
                                    label={column.title}
                                    options={column.options}
                                    {...field}
                                />
                            )}
                        />
                    }

                    return column.filter ?? <Input label={column.title} name={column.id} key={column.id} {...register(column.id)} />
                })}

                <Button onClick={() => {
                    reset()
                    onChange(getValues)
                }} className={'self-end'} label={'Reset'} />
                <Button onClick={onSubmit} className={'self-end'} label={'Apply'} />
            </div>
        </form>
    </>
}


// 01-01-2023 ~ 31-01-2023