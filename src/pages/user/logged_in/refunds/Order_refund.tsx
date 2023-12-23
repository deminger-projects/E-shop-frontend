import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import login_data from "../../../../data/login_data.json"

import {OrderProduct} from "../../../../interfaces/user/User_orders"
import Refund from "../../../../interfaces/Refund_table"

import add_record from "../../../../apis/add_record";

import Refund_row from "../../../../components/Refund_table_row";

import set_up_refund_products from "../../../../functions/set_ups/set_up_refund_products";
import filter_refund_data from "../../../../functions/filters/filter_refund_data";

export default function Order_refund(){

    const navigate = useNavigate();
    const location = useLocation();

    const refund_data_set_up = set_up_refund_products(location.state.data)

    const [refund_data, set_refund_data] = useState<Refund[]>(refund_data_set_up);

    const [error_msg, set_error_msg] = useState<string>();

    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault(); 

        const filtred_refund_data = filter_refund_data(refund_data)

        if(filtred_refund_data.ids.length <= 0){set_error_msg("selelct value")}

        if(filtred_refund_data.ids.length > 0){
            var tables = {
                refunds: {order_id: location.state.data.refunds[0].id},
                refund_products : {refund_id: null, product_id: filtred_refund_data.ids, reason_id: filtred_refund_data.reasons, amount: filtred_refund_data.amounts, size: filtred_refund_data.sizes}
            }

            if(login_data[0].users[0].login_status === "Active"){
                const api_responce = await add_record(tables, login_data[0].users[0].id)
            }else{
                const api_responce = await add_record(tables)
            }

            navigate("/refunds", {state: {msg: "refund placed"}})

        }
    }

    return(

        <>
            <p>{error_msg}</p>

                <form onSubmit={handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th>product name</th>
                                <th>product size</th>
                                <th>product prize</th>
                                <th>product quntity</th>
                                <th>reason</th>
                                <th>refund/yes-no</th>
                            </tr>
                        </thead>

                        <tbody>
                            {location.state.data.order_products.map((product_data: OrderProduct, index: number) =>
                                <Refund_row key={index.toString()} product_data={product_data} pozition={index} on_change={set_refund_data} table_data={refund_data}></Refund_row>
                            )}
                        </tbody>

                    </table>

                    <button>submit</button>

                </form> 
        </>
    )
}