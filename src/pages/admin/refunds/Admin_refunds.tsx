import { useState } from "react"

import refunds from "../../../data/refunds.json"
import login_data from "../../../data/login_data.json"

import Access_denied from "../../user/Access_denied"

import edit_record from "../../../apis/edit_record"

import User_Refunds, { RefundProduct } from "../../../interfaces/user/User_Refunds"

export default function Admin_refunds(){

    const [api_responce_msg, set_api_responce_msg] = useState<string>()
    const [error_msg, set_error_msg] = useState<string>()

    var handle_submit = async (event: React.MouseEvent<HTMLElement>, record_id: number) => {

        event.preventDefault();

        var tables = {
            refunds: {status: "Accepted"},
        }

        const [api_responce, error] = await edit_record(tables, record_id, login_data[0].users[0].id)

        if(error){
            set_error_msg("error ocured")
        }else{
            set_api_responce_msg(api_responce.msg)
        }
    }

    return(
        <>
            <p>{api_responce_msg}</p>
            <p>{error_msg}</p>

            {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? refunds.length > 0 ?
                <div>
                    <p>refunds</p>
                    {refunds.map((refund: User_Refunds) => 
                        
                            <table key={refund.refunds[0].id}>
                                <thead>
                                    <tr>
                                        <th>name</th>
                                        <th>surname</th>
                                        <th>adress</th>
                                        <th>email</th>
                                        <th>phone</th>
                                        <th>psc</th>
                                        <th>order_date</th>
                                        <th>status</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    <tr>
                                        <td>{refund.refunds[0].name}</td>
                                        <td>{refund.refunds[0].surname}</td>
                                        <td>{refund.refunds[0].adress}</td>
                                        <td>{refund.refunds[0].email}</td>
                                        <td>{refund.refunds[0].phone}</td>
                                        <td>{refund.refunds[0].postcode}</td>
                                        <td>{refund.refunds[0].add_date}</td>
                                        <td>{refund.refunds[0].status}</td>
                                    </tr>
                                </tbody>
                                
                                <thead>
                                    <tr>
                                        <th>product_name</th>
                                        <th>size</th>
                                        <th>prize</th>
                                        <th>quntity</th>
                                        <th>reason</th>
                                    </tr>
                                </thead>
                                
                                <tbody>

                                {refund.refund_products.map((product: RefundProduct) => 
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.size}</td>
                                        <td>{product.prize}</td>
                                        <td>{product.amount}</td>
                                        <td>{product.reason}</td>
                                    </tr>
                                )}

                                    <tr>
                                        <td>
                                            <button onClick={(event) => handle_submit(event, refund.refunds[0].id)}>Accept</button>
                                        </td>
                                    </tr>

                                </tbody>
                               
                            </table>                        
                    )}
                </div>
            
            : <p>no records</p> 
            : <Access_denied></Access_denied>}
        </>
    )
}