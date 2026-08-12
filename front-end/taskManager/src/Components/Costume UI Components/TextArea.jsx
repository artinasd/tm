import {forwardRef} from "react";

function Input(props,  ref) {

    return (
        <div className={`flex flex-col items-start ${props.extraStyle}`}>
            <label className='text3 font-medium mb-1 text-sm'>{props.label}</label>
            <textarea onChange={props.onChange} placeholder={props.placeholder} ref={ref} defaultValue={props.value} className='transition focus:outline-none focus:border-blue-700 placeholder:text2 placeholder:text-sm placeholder:font-light border border-gray-500 rounded-md p-1.5 w-full' type={props.type} placeholder={props.placeholder} />
        </div>
    )
}

export default forwardRef(Input);