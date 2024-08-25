import Access_denied from "../Access_denied";

import Order, {OrderProduct} from "../../../interfaces/user/User_orders"
import { useEffect, useState } from "react";
import get_user_orders from "../../../apis/getters/user/get_user_orders";
import Loading from "../../../components/Loading";
import Roll_button from "../../../components/Roll_button";
import get_more_products from "../../../functions/get_more_products";

export default function Orders(){

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [roll_button_status, set_roll_button_status] = useState<boolean>(true)
    const [last_item_id, set_last_item_id] = useState<number>(0)

    const [orders_arr, set_orders_arr] = useState<Array<Order>>([])
    const [orders_arr_display, set_orders_arr_display] = useState<Array<Order>>([])

    const [search_order_id, set_search_order_id] = useState<string>("")

    const [loading, set_loading] = useState(true)

    useEffect(() => {
        var res_arr: Array<Order> = []

        for(var order of orders_arr){
            
            var order_fix: Order = order

            if(search_order_id){
                if(order_fix.refunds[0].order_code.toString().includes(search_order_id)){
                    res_arr.push(order)
                }
            }
        }

        if(search_order_id){
            set_orders_arr_display(res_arr)
        }else{
            set_orders_arr_display(orders_arr)
        }

    }, [search_order_id,])

    useEffect(() => {
        const fetchData = async () => {
            var data = await get_user_orders(user_data[0].email, user_data[0].password, last_item_id)

            set_orders_arr(data)
            set_orders_arr_display(data)
            set_loading(false);
          };

        fetchData()
    }, [])

    var get_more_products = async () => {
        set_loading(true)

        var data1 = await get_user_orders(user_data[0].email, user_data[0].password, last_item_id)

        if(data1.length > 2){
            var products_arr_copy = [...orders_arr]
            var new_data = products_arr_copy.concat(data1)
    
            set_orders_arr(new_data)
            set_orders_arr_display(new_data)
    
            set_last_item_id(data1[data1.length - 1].refunds[0].id)
            
            set_roll_button_status(true)
        }else if (data1.length <= 2){
            set_roll_button_status(false)
        }

        set_loading(false)
    }

    return(
        <>

            {loading ? <Loading></Loading> : <>
                <label htmlFor="">order code</label>
                <input type="text" value={search_order_id} onChange={(event) => set_search_order_id(event.target.value)}/>

                {user_data.length > 0 ? orders_arr_display.length > 0 ? 
                    <>
                        {orders_arr_display.map((order: Order, index1: number) => 
                            <div key={index1.toString()}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>order code</th>
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
                                            <td><p>{order.refunds[0].order_code}</p></td>
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
                                                <th>image</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                            {order.order_products.map((product: OrderProduct, index2: number) => 
                                            <tr key={index2.toString()}>
                                                <td><p>{product.name}</p></td>
                                                <td><p>{product.size}</p></td>
                                                <td><p>{product.prize}</p></td>
                                                <td><p>{product.amount}</p></td>
                                                <td><img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products" + "/" + product.product_id + "/" + product.image_url} width={"100px"} height={"100px"}/></td>
                                            </tr>
                            )}
                                        </tbody>
                                    </table>

                            <br />
                        </div>               
                )} </> : <p>no orders</p> : <Access_denied></Access_denied>}

                {roll_button_status ? <Roll_button get_more_products={get_more_products}></Roll_button> : <></>}

            </>}
            
        </>
    )
}