import { useEffect, useState } from "react";

import Access_denied from '../../user/Access_denied';

import change_status from "../../../apis/records/change_status";

import Order, {OrderProduct} from "../../../interfaces/Order"
import get_order_status_change_template from "../../../templates/admin/get_order_status_change_template";
import check_for_admin from "../../../functions/sub_functions/check_for_admin";
import get_admin_orders from "../../../apis/getters/admin/get_admin_orders";
import Loading from "../../../components/Loading";

export default function Admin_order_page(){

    const [responce_msg, set_responce_msg] = useState<string>("")
    const [error_msg, set_error_msg] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)
    
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
    const [order_arr_display, set_order_arr_display] = useState<Array<Order>>([]);

    const [update, set_update] = useState<boolean>(true);

    const [current_status, set_current_status] = useState<string>("");

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    useEffect(() => {
        const temp = async() => {
            set_loading(true)
            var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

            if(is_admin.next_status === true){
                set_is_admin(true)
                set_loading(false)
            }
        }

        temp()
    }, [])

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
                if(new_order.orders[0].name.toString().toLocaleLowerCase().includes(search_name.toLocaleLowerCase()) && new_order.orders[0].surname.toString().toLocaleLowerCase().includes(search_surname.toLocaleLowerCase())){
                    res_arr.push(order)
                }   
            }else if(search_order_id){
                if(new_order.orders[0].order_code.toString().toLocaleLowerCase().includes(search_order_id.toLocaleLowerCase())){
                    res_arr.push(order)
                }            
            }else if(search_name){
                if(new_order.orders[0].name.toString().toLocaleLowerCase().includes(search_name.toLocaleLowerCase())){
                    res_arr.push(order)    
                }
            }else if(search_surname){
                if(new_order.orders[0].surname.toString().toLocaleLowerCase().includes(search_surname.toLocaleLowerCase())){
                    res_arr.push(order)    
                }
            }else if(search_email){
                if(new_order.orders[0].email.toString().toLocaleLowerCase().includes(search_email.toLocaleLowerCase())){
                    res_arr.push(order)    
                }
            }else if(search_phone){
                if(new_order.orders[0].phone.toString().toLocaleLowerCase().includes(search_phone.toLocaleLowerCase())){
                    res_arr.push(order)
                }
            }else{
                res_arr.push(order)
            }
        }

        if(!search_order_id && !search_name && !search_surname && !search_email && !search_phone && !search_gate_active && !search_gate_preparing && !search_gate_prepared && !search_gate_on_trave && !search_gate_delivered && !search_gate_cancled){
            set_order_arr_display(order_arr)
        }else{
            set_order_arr_display(res_arr)
        }

    },[search_order_id, search_name, search_surname, search_email, search_phone, search_gate_active, search_gate_preparing, search_gate_prepared, search_gate_on_trave, search_gate_delivered, search_gate_cancled])

    var handle_submit = async (event: React.MouseEvent<HTMLElement>, record_id: number, status: string) => {

        set_loading(true)
    
        event.preventDefault();

        const order_status_change_template = get_order_status_change_template(status)

        const [api_responce, error] = await change_status(order_status_change_template, record_id)

        await handle_status_select(current_status)
    
        if(error){
            set_error_msg("error ocured")
        }else{
            set_responce_msg(api_responce.msg)
        }

        //set_update(!update)
        set_loading(false)
    }


    var handle_status_select = async(status: string) => {
        set_loading(true)

        set_search_order_id("")
        set_search_name("")
        set_search_surname("")
        set_search_email("")
        set_search_phone("")

        set_search_gate_order_id(false)
        set_search_gate_name(false)
        set_search_gate_email(false)
        set_search_gate_phone(false)

        const fetchData = async () => {
            
            var data = await get_admin_orders(status)

            set_order_arr(data)
            set_order_arr_display(data)

            set_current_status(status)

            set_loading(false);
          };

        await fetchData()
    }

    return(
        <>
            {loading ? <Loading></Loading> : <>
            <p>{responce_msg}</p>
            <p>{error_msg}</p>

            <button onClick={() => {set_search_gate_order_id(!search_gate_order_id); set_search_gate_name(false); set_search_gate_email(false); set_search_gate_phone(false)}}>Search by order code</button>

            <button onClick={() => {set_search_gate_name(!search_gate_name); set_search_gate_order_id(false); set_search_gate_email(false); set_search_gate_phone(false)}}>Search by customer name</button>

            <button onClick={() => {set_search_gate_email(!search_gate_email); set_search_gate_name(false); set_search_gate_order_id(false); set_search_gate_phone(false)}}>Search by customer email</button>

            <button onClick={() => {set_search_gate_phone(!search_gate_phone); set_search_gate_name(false); set_search_gate_email(false); set_search_gate_order_id(false)}}>Search by customer phone number</button>


            {search_gate_order_id ? <>
                <label htmlFor="">Order code</label>
                <input type="string" value={search_order_id} onChange={(event) => set_search_order_id(event.target.value)}></input>
            </> : ""}

            {search_gate_name ? <>
                <label htmlFor="">Customer name</label>
                <input type="string" value={search_name} onChange={(event) => set_search_name(event.target.value)}></input>

                <label htmlFor="">Customer surname</label>
                <input type="string" value={search_surname} onChange={(event) => set_search_surname(event.target.value)}></input>
            </> : ""}

            {search_gate_email ? <>
                <label htmlFor="">Customer email</label>
                <input type="string" value={search_email} onChange={(event) => set_search_email(event.target.value)}></input>
            </> : ""}

            {search_gate_phone ? <>
                <label htmlFor="">Customer phone number</label>
                <input type="string" value={search_phone} onChange={(event) => set_search_phone(event.target.value)}></input>
            </> : ""}

            <br />
            <br />

            <button onClick={() => {handle_status_select("Active"); set_search_gate_active(!search_gate_active); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>Active status</button>

            <button onClick={() => {handle_status_select("Preparing"); set_search_gate_active(false); set_search_gate_preparing(!search_gate_preparing); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>Preparing status</button>

            <button onClick={() => {handle_status_select("Prepared"); set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(!search_gate_prepared); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>Prepared status</button>

            <button onClick={() => {handle_status_select("On travel"); set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(!search_gate_on_trave); set_search_gate_delivered(false); set_search_gate_cancled(false)}}>On travel status</button>

            <button onClick={() => {handle_status_select("Delivered"); set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(!search_gate_delivered); set_search_gate_cancled(false)}}>Delivered status</button>

            <button onClick={() => {handle_status_select("Cancled"); set_search_gate_active(false); set_search_gate_preparing(false); set_search_gate_prepared(false); set_search_gate_on_trave(false); set_search_gate_delivered(false); set_search_gate_cancled(!search_gate_cancled)}}>Cancled status</button>


            <br />


            <br />

           {is_admin ? order_arr_display.length > 0 ? 
                <div>
                    {order_arr_display.map((order: Order) => 
                    
                        <table key={order.orders[0].id.toString()}>
                            <thead>
                                <tr>
                                    <th>Order code</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>Adress</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>PSČ</th>
                                    <th>Add date</th>
                                    <th>Country</th>
                                    <th>Zásilkovna status</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                <tr>
                                    <td>{order.orders[0].order_code}</td>
                                    <td>{order.orders[0].name}</td>
                                    <td>{order.orders[0].surname}</td>
                                    <td>{order.orders[0].adress}</td>
                                    <td>{order.orders[0].email}</td>
                                    <td>{order.orders[0].phone}</td>
                                    <td>{order.orders[0].postcode}</td>
                                    <td>{order.orders[0].add_date}</td>
                                    <td>{order.orders[0].country}</td>
                                    <td>{order.orders[0].zasilkovna}</td>
                                    <td>{order.orders[0].status}</td>
                                </tr>
                            </tbody>
                            
                            <thead>
                                <tr>
                                    <th>Product name</th>
                                    <th>Size</th>
                                    <th>Quantity</th>
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
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Preparing")}>Preparing</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Prepared")}>Prepared</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "On travel")}>On travel</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Delivered")}>Delivered</button>
                                        <button onClick={(event) => handle_submit(event, order.orders[0].id, "Cancled")}>Cancled</button>

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