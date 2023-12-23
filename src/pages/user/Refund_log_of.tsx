import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import refund_request from "../../apis/refund_request";

export default function Refund(){

    const navigate = useNavigate();

    const [order_code, set_order_code] = useState<string>();
    const [email, set_email] = useState<string>();

    const [error_msg, set_error_msg] = useState<string>();

    var handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        event.preventDefault();        

            if(!order_code){set_error_msg("order code is empty")}
            if(!email){set_error_msg("email is empty")}

            if(order_code && email){

                var tables = {
                    orders: {id$: order_code, email$: email}
                }        

                const [api_responce, error] = await refund_request(tables, email)

                if(error){
                    set_error_msg("error ocured")
                }else{
                    if(api_responce.status === false){
                        set_error_msg(api_responce.msg)
                    }else if(api_responce.status === true){
                        navigate('/code-check',{state: {code: api_responce.code, data: api_responce.data, request: "refund"}})
                    }
                }
            }
        }       

    return(
        <>  
            <p>{error_msg}</p>

            <label htmlFor="order_code">Order code</label>
            <input id="order_code" value={order_code} onChange={(event) => set_order_code(event.target.value)} type="text"></input>

            <label htmlFor="email">Email</label>
            <input id="email" value={email} onChange={(event) => set_email(event.target.value)} type="email"></input>
            
            <button onClick={handleSubmit}>proceed</button>
        </>
    )
}
