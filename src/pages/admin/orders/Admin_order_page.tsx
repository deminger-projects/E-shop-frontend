import { useEffect, useState } from "react";

import Access_denied from '../../user/Access_denied';

import change_status from "../../../apis/records/change_status";

import Order, {OrderProduct} from "../../../interfaces/Order"
import get_order_status_change_template from "../../../templates/admin/get_order_status_change_template";
import { useCookies } from "react-cookie";

export default function Admin_order_page(){

    const [responce_msg, set_responce_msg] = useState<string>("")
    const [error_msg, set_error_msg] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)

    const [cookies, setCookie] = useCookies(['user_data'])
    
    const [search_gate_order_id, set_search_gate_order_id] = useState<boolean>(false)
    const [search_gate_name, set_search_gate_name] = useState<boolean>(false)
    const [search_gate_email, set_search_gate_email] = useState<boolean>(false)
    const [search_gate_phone, set_search_gate_phone] = useState<boolean>(false)

    const [search_gate_active, set_search_gate_active] = useState<boolean>(false)
    const [search_gate_preparing, set_search_gate_preparing] = useState<boolean>(false)
    const [search_gate_prepared, set_search_gate_prepared] = useState<boolean>(false)
    const [search_gate_on_trave, set_search_gate_on_trave] = useState<boolean>(false)
    const [search_gate_delivered, set_search_gate_delivered] = useState<boolean>(false)
    const [search_gate_cancled, set_search_gate_cancled] = useState<boolean>(false)

    const [search_order_id, set_search_order_id] = useState<string>("")
    const [search_name, set_search_name] = useState<string>("")
    const [search_surname, set_search_surname] = useState<string>("")
    const [search_email, set_search_email] = useState<string>("")
    const [search_phone, set_search_phone] = useState<string>("")

    const [order_arr, set_order_arr] = useState<Array<Order>>([]);
    const [update, set_update] = useState<boolean>(true);

    useEffect(() => {      // searches products based on user input, valid input: product name, product size
        var res_arr: Array<Order> = []

        var filtred_orders = []

        for(let order2 of order_arr){

            var order: Order = order2

            if(search_gate_active){
                if(order.orders[0].status === "Active"){
                    filtred_orders.push(order)
                }
            }else if(search_gate_preparing){
                if(order.orders[0].status === "Preparing"){
                    filtred_orders.push(order)
                }
            }else if(search_gate_prepared){
                if(order.orders[0].status === "Prepared"){
                    filtred_orders.push(order)
                }
            }else if(search_gate_on_trave){
                if(order.orders[0].status === "On travel"){
                    filtred_orders.push(order)
                }
            }else if(search_gate_delivered){
                if(order.orders[0].status === "Delivered"){
                    filtred_orders.push(order)
                }
            }else if(search_gate_cancled){
                if(order.orders[0].status === "Cancled"){
                    filtred_orders.push(order)
                }
            }else{
                filtred_orders.push(order)
            }
        }

        for(var order of filtred_orders){ 
            var new_order: Order = order
            if(search_name && search_surname){
                if(new_order.orders[0].name.toString().includes(search_name) && new_order.orders[0].surname.toString().includes(search_surname)){
                    res_arr.push(order)
                }   
            }else if(search_order_id){
                if(new_order.orders[0].id.toString().includes(search_order_id)){
                    res_arr.push(order)
                }            
            }else if(search_name){
                if(new_order.orders[0].name.toString().includes(search_name)){
                    res_arr.push(order)    
                }
            }else if(search_surname){
                if(new_order.orders[0].surname.toString().includes(search_surname)){
                    res_arr.push(order)    
                }
            }else if(search_email){
                if(new_order.orders[0].email.toString().includes(search_email)){
                    res_arr.push(order)    
                }
            }else if(search_phone){
                if(new_order.orders[0].phone.toString().includes(search_phone)){
                    res_arr.push(order)
                }
            }else{
                res_arr.push(order)
            }
        }

        if(!search_order_id && !search_name && !search_surname && !search_email && !search_phone && !search_gate_active && !search_gate_preparing && !search_gate_prepared && !search_gate_on_trave && !search_gate_delivered && !search_gate_cancled){
            set_order_arr(order_arr)
        }else{
            set_order_arr(res_arr)
        }

    },[search_order_id, search_name, search_surname, search_email, search_phone, search_gate_active, search_gate_preparing, search_gate_prepared, search_gate_on_trave, search_gate_delivered, search_gate_cancled])

    
    useEffect(() => {
        fetchData()
    }, [update])

    const fetchData = async () => {
        try {
          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_orders', {
            method: 'POST'  
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_order_arr(data)
          set_loading(false);

        } catch (error) {

          console.log(error);

          set_loading(false);
        }
      };

    var handle_submit = async (event: React.MouseEvent<HTMLElement>, record_id: number, status: string) => {

        set_loading(true)
    
        event.preventDefault();

        const order_status_change_template = get_order_status_change_template(status)

        const [api_responce, error] = await change_status(order_status_change_template, record_id , cookies.user_data[0].id)
    
        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }

        set_update(!update)
        set_loading(false)
    }

    return(
        <>
            {loading ? <p>loading</p> : <>
            <p>{responce_msg}</p>
            <p>{error_msg}</p>

            <button onClick={() => {set_search_gate_order_id(!search_gate_order_id); set_search_gate_name(false); set_search_gate_email(false); set_search_gate_phone(false)}}>search by order id</button>

            <button onClick={() => {set_search_gate_name(!search_gate_name); set_search_gate_order_id(false); set_search_gate_email(false); set_search_gate_phone(false)}}>search by name</button>

            <button onClick={() => {set_search_gate_email(!search_gate_email); set_search_gate_name(false); set_search_gate_order_id(false); set_search_gate_phone(false)}}>search by email</button>

            <button onClick={() => {set_search_gate_phone(!search_gate_phone); set_search_gate_name(false); set_search_gate_email(false); set_search_gate_order_id(false)}}>search by phone number</button>


            {search_gate_order_id ? <>
                <label htmlFor="">order id</label>
                <input type="string" value={search_order_id} onChange={(event) => set_search_order_id(event.target.value)}></input>
            </> : ""}

            {search_gate_name ? <>
                <label htmlFor="">name</label>
                <input type="string" value={search_name} onChange={(event) => set_search_name(event.target.value)}></input>

                <label htmlFor="">surname</label>
                <input type="string" value={search_surname} onChange={(event) => set_search_surname(event.target.value)}></input>
            </> : ""}

            {search_gate_email ? <>
                <label htmlFor="">email</label>
                <input type="string" value={search_email} onChange={(event) => set_search_email(event.target.value)}></input>
            </> : ""}

            {search_gate_phone ? <>
                <label htmlFor="">phone</label>
                <input type="string" value={search_phone} onChange={(event) => set_search_phone(event.target.value)}></input>
            </> : ""}

            <br />
            <br />

            <button onClick={() => {set_search_gate_active(!search_gate_active); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>Active status</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_preparing(!search_gate_preparing); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>Preparing status</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(!search_gate_prepared); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>Prepared status</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(!search_gate_on_trave); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>On travel status</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(!search_gate_delivered); set_search_gate_cancled(false)}}>Delivered status</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(!search_gate_cancled)}}>Cancled status</button>


            <br />
            <br />

           {cookies.user_data[0].login_status === "Active" && cookies.user_data[0].username === "Admin" ? order_arr.length > 0 ? 
                <div>
                    {order_arr.map((order: Order) => 
                    
                        <table key={order.orders[0].id.toString()}>
                            <thead>
                                <tr>
                                    <th>order id</th>
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
                                    <td>{order.orders[0].id}</td>
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
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Preparing")}>preparing</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Prepared")}>prepared</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "On travel")}>on travel</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Delivered")}>delivered</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Cancled")}>cancled</button>

                                    </td>
                                </tr>
                            
                            </tbody>
                    
                        </table>
                )}
                </div>
                : <p>no records</p>
                : <Access_denied></Access_denied>
                }
            </>}
            
        </>
    )
}