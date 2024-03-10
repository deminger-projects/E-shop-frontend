import { Link, useLocation } from "react-router-dom";

import Access_denied from "../../Access_denied";

import New_orders, {OrderProduct, Order}  from "../../../../interfaces/new_refunds";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Refunds(){

    const location = useLocation()

    const [orders_arr, set_orders_arr] = useState<Array<New_orders>>([])
    const [search_order_id, set_search_order_id] = useState<string>("")

    const [cookies, setCookie] = useCookies(['user_data'])

    useEffect(() => {
        var res_arr: Array<New_orders> = []

        for(var order of orders_arr){

            console.log(order)

            var order_fix: New_orders = order

            if(search_order_id){
                if(order_fix.orders[0].id.toString().includes(search_order_id)){
                    res_arr.push(order)
                }
            }
        }

        if(search_order_id){
            set_orders_arr(res_arr)
        }else{
            set_orders_arr(orders_arr)
        }

    }, [search_order_id])
    

    return(
        <>

            <label htmlFor="">order id</label>
            <input type="text" value={search_order_id} onChange={(event) => set_search_order_id(event.target.value)}/>

            {location.state ? <p>{location.state.msg}</p> : <></>}

            {cookies.user_data[0].login_status  === "Active" ? orders_arr.length !== 0 ? orders_arr.map((order: New_orders, index: number) => {

                return <div key={index.toString()}>
                <table>
                    <thead>
                        <tr>
                            <th>order id</th>
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
                            <td><p>{order.orders[0].id}</p></td>
                            <td><p>{order.orders[0].name}</p></td>
                            <td><p>{order.orders[0].surname}</p></td>
                            <td><p>{order.orders[0].email}</p></td>
                            <td><p>{order.orders[0].phone}</p></td>
                            <td><p>{order.orders[0].adress}</p></td>
                            <td><p>{order.orders[0].postcode}</p></td>
                            <td><p>{order.orders[0].add_date}</p></td>
                        </tr>
                    </tbody>

                    <thead>
                        <tr>
                            <th>product name</th>
                            <th>product size</th>
                            <th>product prize</th>
                            <th>product quntity</th>
                            <th>image</th>
                        </tr>
                    </thead>

                    <tbody>

                    {order.order_products.map((refunds: OrderProduct, index: number) => 
                    
                        <tr key={index.toString()}>
                            <td><p>{refunds.name}</p></td>
                            <td><p>{refunds.size}</p></td>
                            <td><p>{refunds.prize}</p></td>
                            <td><p>{refunds.amount}</p></td>
                            <td><img src={"/images/products/" + refunds.product_id + "/" + refunds.image_url} width={"100px"} height={"100px"}/>
</td>
                        </tr>            
                    )}

                    </tbody>

                </table>

                <button><Link to="/place-refund" state={{data: order}}>refund</Link></button> 

                </div>

            })  : <p>no records</p> : <Access_denied></Access_denied>
            }    
        </>    
    )
}
