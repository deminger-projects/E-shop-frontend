import Access_denied from "../Access_denied";

import user_orders from "../../../data/user_orders.json"
import login_data from "../../../data/login_data.json"

import Order, {OrderProduct} from "../../../interfaces/user/User_orders"

export default function Orders(){

    return(
        <>
            {login_data[0].users[0].login_status === "Active" ? user_orders.length > 0 ? 
                <>
                    {user_orders.map((order: Order, index1: number) => 
                        <div key={index1.toString()}>
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
                                        <th>status</th>
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
                                        <td><p>{order.refunds[0].status}</p></td>
                                    </tr>
                                </tbody>

                                </table>   
                
                                <table>
                                    <thead>
                                        <tr>
                                            <th>product name</th>
                                            <th>product size</th>
                                            <th>product prize</th>
                                            <th>product quntity</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                        {order.order_products.map((product: OrderProduct, index2: number) => 
                                        <tr key={index2.toString()}>
                                            <td><p>{product.name}</p></td>
                                            <td><p>{product.size}</p></td>
                                            <td><p>{product.prize}</p></td>
                                            <td><p>{product.amount}</p></td>
                                        </tr>
                        )}
                                    </tbody>
                                </table>

                        <br />
                    </div>               
            )} </> : <p>no orders</p> : <Access_denied></Access_denied>}
        </>
    )
}