import { useState } from "react";

import orders from "../../../data/orders.json"
import login_data from "../../../data/login_data.json"

import Access_denied from '../../user/Access_denied';

import change_status from "../../../apis/change_status";

import Order, {OrderProduct} from "../../../interfaces/Order"

export default function Admin_order_page(){

    const [responce_msg, set_responce_msg] = useState<string>()
    const [error_msg, set_error_msg] = useState<string>()

    var handle_submit = async (event: React.MouseEvent<HTMLElement>, record_id: number) => {

        event.preventDefault();

        var tables = {
            orders: {status: "Inactive"},
        }

        const [api_responce, error] = await change_status(tables, record_id)

        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }
    }

    return(
        <>
            <p>{responce_msg}</p>
            <p>{error_msg}</p>

           {login_data[0].users[0].login_status === "Active" && login_data[0].users[0].username === "Admin" ? orders.length > 0 ? 
                <div>
                {orders.map((order: Order) => 
                
                    <table key={order.orders[0].id}>
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
                                <td>{order.orders[0].name}</td>
                                <td>{order.orders[0].surname}</td>
                                <td>{order.orders[0].adress}</td>
                                <td>{order.orders[0].email}</td>
                                <td>{order.orders[0].phone}</td>
                                <td>{order.orders[0].postcode}</td>
                                <td>{order.orders[0].add_date}</td>
                                <td>{order.orders[0].status}</td>
                            </tr>
                        </tbody>
                        
                        <thead>
                            <tr>
                                <th>product_name</th>
                                <th>size</th>
                                <th>quntity</th>
                            </tr>
                        </thead>
                        
                        <tbody>

                {order.order_products.map((item: OrderProduct) => 
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.size}</td>
                                <td>{item.amount}</td>
                            </tr>
                )}
                            <tr>
                                <td>
                                    <button onClick={(event) => handle_submit(event, order.orders[0].id)}>prepared</button>
                                </td>
                            </tr>
                        
                        </tbody>
                   
                    </table>
            )}
            </div>
            : <p>no records</p>
            : <Access_denied></Access_denied>
            }
        </>
    )
}