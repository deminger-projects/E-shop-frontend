import {OrderProduct} from "../interfaces/user/User_orders"
import Reasons from "../interfaces/Refund_reasons"
import Refund from "../interfaces/Refund_table"

import num_to_arr from "../functions/sub_functions/num_to_arr";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

export default function Refund_row(props: {product_data: OrderProduct, pozition: number, on_change: Function, table_data: Array<Refund> , reasons: Array<Reasons>}){   

    var handle_amount = (pozition: number, value: string) =>{

        var old_data = props.table_data
        old_data[pozition].amount = value

        props.on_change(old_data)
    }

    var handle_reason = (pozition: number, value: string) => {

        var old_data = props.table_data
        old_data[pozition].reason = value

        props.on_change(old_data)

    }

    var handle_status = (pozition: number) => {

        var old_data = props.table_data

        if(old_data[pozition].status === true){
            old_data[pozition].status = false
        }else{
            old_data[pozition].status = true
        }

        props.on_change(old_data)

    }
    
    return(
        <>
            <tr>
                <td>{props.product_data.name}</td>
                <td>{props.product_data.size}</td>
                <td>{props.product_data.prize}</td>

                <td>
                    <select onChange={(event) => handle_amount(props.pozition, event.target.value)} id="quntity">

                            <option value={"no_data"}>select amount</option>
                            
                            {num_to_arr(props.product_data.amount).map((num: number) =>                                
                                <option key={num.toString()} value={num}>{num}</option>
                            )}
                    </select>
                </td>

                <td>
                    <select onChange={(event) => handle_reason(props.pozition, event.target.value)}>
                            
                            <option value={"no_data"}>select reason</option>
                            
                            {props.reasons.map((reason: Reasons, index: number) =>  
                                <option key={index.toString()} value={reason.refund_reasons[0].id}>{reason.refund_reasons[0].reason}</option>  
                            )}
                    </select>
                </td>

                <td><input type="checkbox" onChange={() => handle_status(props.pozition)} className="refund_items"></input></td>

            </tr>
        </>
    )
}