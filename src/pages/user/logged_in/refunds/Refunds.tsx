import { Link, useLocation } from "react-router-dom";

import Access_denied from "../../Access_denied";

import New_orders, {OrderProduct, Order}  from "../../../../interfaces/new_refunds";

import { useEffect, useState } from "react";
import get_user_avaible_returns from "../../../../apis/getters/user/get_user_avaible_returns";
import Loading from "../../../../components/Loading";
import Roll_button from "../../../../components/Roll_button";

export default function Refunds(){

    const location = useLocation()

    const [roll_button_status, set_roll_button_status] = useState<boolean>(true)
    const [last_item_id, set_last_item_id] = useState<number>(0)

    const [orders_arr, set_orders_arr] = useState<Array<New_orders>>([])
    const [orders_arr_display, set_orders_arr_display] = useState<Array<New_orders>>([])

    const [search_order_id, set_search_order_id] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    useEffect(() => {
        var res_arr: Array<New_orders> = []

        for(var order of orders_arr){

            console.log(order)

            var order_fix: New_orders = order

            if(search_order_id){
                if(order_fix.orders[0].order_code.toString().includes(search_order_id)){
                    res_arr.push(order)
                }
            }
        }

        if(search_order_id){
            set_orders_arr_display(res_arr)
        }else{
            set_orders_arr_display(orders_arr)
        }

    }, [search_order_id])
    
    useEffect(() => {
        const fetchData = async () => {
            var data = await get_user_avaible_returns(user_data[0].email, user_data[0].password, last_item_id)

            if(data.length < 3){
                set_roll_button_status(false)
            }
    
    
            if(data.length === 3){
                set_roll_button_status(true)
            }

            if(data.length > 0){
                set_orders_arr(data)
                set_orders_arr_display(data)
    
                set_last_item_id(data[data.length - 1].orders[0].id)
            }
  
            set_loading(false);
          };

        fetchData()
    }, [])

    var get_more_products = async () => {
        set_loading(true)

        var data1 = await get_user_avaible_returns(user_data[0].email, user_data[0].password, last_item_id)

        if(data1.length < 3){
            set_roll_button_status(false)
        }


        if(data1.length === 3){
            set_roll_button_status(true)
        }

        if(data1.length > 0){
            var products_arr_copy = [...orders_arr]
            var new_data = products_arr_copy.concat(data1)
    
            set_orders_arr(new_data)
            set_orders_arr_display(new_data)
    
            set_last_item_id(data1[data1.length - 1].orders[0].id)
    
        }

        

        set_loading(false)
    }

    return(
        <>
        {loading ? <Loading></Loading> : <>
            <label htmlFor="">Order code</label>
                <input type="text" value={search_order_id} onChange={(event) => set_search_order_id(event.target.value)}/>

                {location.state ? <p>{location.state.msg}</p> : <></>}

                {user_data.length > 0 ? orders_arr_display.length !== 0 ? orders_arr_display.map((order: New_orders, index: number) => {

                    return <div key={index.toString()}>
                    <table>
                        <thead>
                            <tr>
                                <th>Order code</th>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Adress</th>
                                <th>PSČ</th>
                                <th>Add date</th>
                            </tr> 
                        </thead>
                        
                        <tbody>
                            <tr>
                                <td><p>{order.orders[0].order_code}</p></td>
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
                                <th>Product name</th>
                                <th>Size</th>
                                <th>Prize</th>
                                <th>Quntity</th>
                                <th>Product preview</th>
                            </tr>
                        </thead>

                        <tbody> 

                        {order.order_products.map((refunds: OrderProduct, index: number) => 
                        
                            <tr key={index.toString()}>
                                <td><p>{refunds.name}</p></td>
                                <td><p>{refunds.size}</p></td>
                                <td><p>{refunds.prize}</p></td>
                                <td><p>{refunds.amount}</p></td>
                                <td><img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + refunds.product_id + "/" + refunds.image_url} width={"100px"} height={"100px"}/>
    </td>
                            </tr>            
                        )}

                        </tbody>

                    </table>

                    <button><Link to="/place-refund" state={{data: order}}>Place refund</Link></button> 

                    </div>

                })  
        

                : <p>no records</p> : <Access_denied></Access_denied>
                }    
                
                {roll_button_status ? <Roll_button get_more_products={get_more_products}></Roll_button> : <></>}
        </>}


        </>    
    )
}
