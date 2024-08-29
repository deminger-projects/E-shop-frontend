import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {OrderProduct} from "../../../../interfaces/user/User_orders"
import Refund from "../../../../interfaces/Refund_table"

import add_record from "../../../../apis/records/add_record";

import Refund_row from "../../../../components/Refund_table_row";

import set_up_refund_products from "../../../../functions/set_ups/set_up_refund_products";
import filter_refund_data from "../../../../functions/filters/filter_refund_data";

import get_refund_template from "../../../../templates/refund/get_refund_template";
import Reasons from "../../../../interfaces/Refund_reasons";
import Access_denied from "../../Access_denied";
import get_refund_reasons from "../../../../apis/getters/get_refund_reasons";
import Loading from "../../../../components/Loading";

export default function Order_refund(){

    const navigate = useNavigate();
    const location = useLocation();

    const refund_data_set_up = set_up_refund_products(location.state.data)

    const [refund_data, set_refund_data] = useState<Refund[]>(refund_data_set_up);

    const [error_msg, set_error_msg] = useState<string>("");

    const [loading, set_loading] = useState<boolean>(false);
    const [reasons, set_reasons] = useState<Array<Reasons>>([])

    useEffect(() => {
        const fetchData = async () => {
            var data = await get_refund_reasons()
    
            set_reasons(data);
            set_loading(false);
          };
        fetchData()
    }, [])

    
    var handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        set_loading(true)

        event.preventDefault(); 

        const filtred_refund_data = filter_refund_data(refund_data)

        if(filtred_refund_data.ids.length <= 0){set_error_msg("selelct value")}

        if(filtred_refund_data.ids.length > 0){

            const refund_template = get_refund_template(location.state.data.orders[0].id, null, filtred_refund_data.ids, filtred_refund_data.reasons, filtred_refund_data.amounts, filtred_refund_data.sizes, "Proccesing")
           
            const [api_responce, error] = await add_record(refund_template, undefined, undefined, undefined, undefined, undefined)
           
            if(error){
                set_error_msg("error ocured")
            }else if(api_responce.next_status === true){
                navigate("/placed-returns", {state: {msg: api_responce.msg}})
            }else if(api_responce.next_status === false){
                set_error_msg(api_responce.msg)
            }
        }

        set_loading(false)
    }

    return(

        <>
            {loading ? <Loading></Loading> : <>

                <p>{error_msg}</p>

                <form onSubmit={handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Size</th>
                                <th>Prize</th>
                                <th>Quntity</th>
                                <th>Refund reason</th>
                                <th>Refund thes item ?</th>
                            </tr>
                        </thead>

                        <tbody>
                            {location.state.data.order_products.map((product_data: OrderProduct, index: number) =>
                                <Refund_row reasons={reasons} key={index.toString()} product_data={product_data} pozition={index} on_change={set_refund_data} table_data={refund_data}></Refund_row>
                            )}
                        </tbody>

                    </table>

                    <button>submit</button>

                </form> 
                
            </>}
        </>
    )
}
   
