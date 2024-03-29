import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import refund_request from "../../apis/other/refund_request";
import get_refund_request_template from "../../templates/refund/get_refund_request_template";
import Loading from "../../components/Loading";

export default function Refund(){

    const navigate = useNavigate();

    const [order_code, set_order_code] = useState<string>("");
    const [email, set_email] = useState<string>("");

    const [loading, set_loading] = useState<boolean>(false);

    const [error_msg, set_error_msg] = useState<string>("");

    var handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        set_loading(true)

        event.preventDefault();        

            if(!order_code){set_error_msg("order code is empty")}
            if(!email){set_error_msg("email is empty")}

            if(order_code && email){

                const refund_template = get_refund_request_template(Number(order_code), email)  

                const [api_responce, error] = await refund_request(refund_template, email, true)
                
                if(error){
                    set_error_msg("error ocured")
                }else{
                    if(api_responce.next_status === false){
                        set_error_msg(api_responce.msg)
                    }else if(api_responce.next_status === true){
                        navigate('/code-check',{state: {code: api_responce.code, data: api_responce.data, request: "refund"}})
                    }
                }
            }

            set_loading(false)
        }       

    return(
        <>  
            {loading ? <Loading></Loading> : <>
                <p>{error_msg}</p>

                <label htmlFor="order_code">Order code</label>
                <input id="order_code" value={order_code} onChange={(event) => set_order_code(event.target.value)} type="text"></input>

                <label htmlFor="email">Email</label>
                <input id="email" value={email} onChange={(event) => set_email(event.target.value)} type="email"></input>
                
                <button onClick={handleSubmit}>proceed</button>
            </>}
            
        </>
    )
}
