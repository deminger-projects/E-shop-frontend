import { Link, useLocation } from "react-router-dom";

import Access_denied from "../../Access_denied";

import user_orders from "../../../../data/user_orders.json"
import login_data from "../../../../data/login_data.json"

import User_orders, {OrderProduct} from "../../../../interfaces/user/User_orders"

export default function Refunds(){

    const location = useLocation()

    return(
        <>
            {location.state ? <p>{location.state.msg}</p> : <></>}

            {login_data[0].users[0].login_status  === "Active" ? user_orders.length !== 0 ? user_orders.map((order: User_orders, index: number) => {

                

                if(order.refunds[0].refund_count > 0){
                    var button = <button>refund in progress</button>    
                }else{
                    var button = <button><Link to="/place-refund" state={{data: order}}>refund</Link></button> 

                }

                return <div key={index.toString()}>
                <table>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>surname</th>
                            <th>email</th>
                            <th>phone</th>
                            <th>adress</th>
                            <th>psc</th>
                            <th>order date</th>
                        </tr> 
                    </thead>
                    
                    <tbody>
                        <tr>
                            <td><p>{order.refunds[0].name}</p></td>
                            <td><p>{order.refunds[0].surname}</p></td>
                            <td><p>{order.refunds[0].email}</p></td>
                            <td><p>{order.refunds[0].phone}</p></td>
                            <td><p>{order.refunds[0].adress}</p></td>
                            <td><p>{order.refunds[0].postcode}</p></td>
                            <td><p>{order.refunds[0].add_date}</p></td>
                        </tr>
                    </tbody>

                    <thead>
                        <tr>
                            <th>product name</th>
                            <th>product size</th>
                            <th>product prize</th>
                            <th>product quntity</th>
                        </tr>
                    </thead>

                    <tbody>

                    {order.order_products.map((refunds: OrderProduct, index: number) => 
                    
                        <tr key={index.toString()}>
                            <td><p>{refunds.name}</p></td>
                            <td><p>{refunds.size}</p></td>
                            <td><p>{refunds.prize}</p></td>
                            <td><p>{refunds.amount}</p></td>
                        </tr>            
                    )}

                    </tbody>

                </table>

                {button}

                </div>

            })  : <p>no records</p> : <Access_denied></Access_denied>
            }    
        </>    
    )
}