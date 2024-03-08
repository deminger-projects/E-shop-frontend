import Access_denied from "../Access_denied";

import Order, {OrderProduct} from "../../../interfaces/user/User_orders"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Orders(){

    const [orders_arr, set_orders_arr] = useState<Array<Order>>([])
    const [search_order_id, set_search_order_id] = useState<string>("")

    const [cookies, setCookie] = useCookies(['user'])
    const [loading, set_loading] = useState(true)

    useEffect(() => {
        var res_arr: Array<Order> = []

        for(var order of orders_arr){
            
            var order_fix: Order = order

            if(search_order_id){
                if(order_fix.refunds[0] .id.toString().includes(search_order_id)){
                    res_arr.push(order)
                }
            }
        }

        if(search_order_id){
            set_orders_arr(res_arr)
        }else{
            set_orders_arr(orders_arr)
        }

    }, [search_order_id,])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_orders', {
            method: 'POST'  
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_orders_arr(data)
          set_loading(false);

        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };


    return(
        <>

            {loading ? <p>loading</p> : <>
                <label htmlFor="">order id</label>
                <input type="text" value={search_order_id} onChange={(event) => set_search_order_id(event.target.value)}/>

                {cookies.user[0].login_status === "Active" ? orders_arr.length > 0 ? 
                    <>
                        {orders_arr.map((order: Order, index1: number) => 
                            <div key={index1.toString()}>
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
                                            <th>status</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        <tr>
                                            <td><p>{order.refunds[0].id}</p></td>
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
                                                <td><img src={"images/products" + "/" + product.product_id + "/" + product.image_url} width={"100px"} height={"100px"}/></td>
                                            </tr>
                            )}
                                        </tbody>
                                    </table>

                            <br />
                        </div>               
                )} </> : <p>no orders</p> : <Access_denied></Access_denied>}
            </>}
            
        </>
    )
}