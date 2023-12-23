import { useState } from "react"

import Size from "../../interfaces/Size"

export default function Admin_size_checkboxes(props: {sizes: Array<Size>, on_change: Function}){

    const [sizes, set_sizes] = useState<Array<Size>>(props.sizes)

    var handle_checkbox_change = (size: Size, index: number) => {
        if(size.is_checked === true){
            size.is_checked = false
        }else if(size.is_checked === false){
            size.is_checked = true
        }

        var new_data = [...sizes]
        new_data[index] = size

        set_sizes(new_data)
        props.on_change(new_data)
    }

    var handle_amount_change = (index: number, value: number) => {

        var new_data = [...sizes]
        new_data[index].current_amount = value

        set_sizes(new_data)
        props.on_change(new_data)
    }

    return(
        <>
           {props.sizes.map((size: Size, index: number) => {
            
           if(size.is_checked !== true){
                return(
                    <div key={size.size}>
                        <label htmlFor={size.size}>{size.size}</label>
                        <input checked={size.is_checked} type="checkbox" id={size.size} onChange={() => handle_checkbox_change(size, index)} />
                    </div>
                )
           }else if((size.current_amount > 0 && size.is_checked === true) || size.is_checked === true){
                return(
                    <div key={size.size}>
                        <label htmlFor={size.size}>{size.size}</label>
                        <input type="checkbox" id={size.size} checked={size.is_checked} onChange={() => handle_checkbox_change(size, index)} />
                        <input type="number" min={1} id={size.size} value={size.current_amount} onChange={(event) => handle_amount_change(index, Number(event.target.value))}/>
                    </div>
                )
           }
        })}

        </>
    )
}