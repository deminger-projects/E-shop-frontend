import { useEffect, useState } from "react"

import Access_denied from "../../user/Access_denied"

import Refund, { Refund_Product } from "../../../interfaces/Refunds"
import change_status from "../../../apis/records/change_status"
import get_refund_status_change_template from "../../../templates/admin/get_refund_status_change_template"
import check_for_admin from "../../../functions/sub_functions/check_for_admin"
import get_admin_refunds from "../../../apis/getters/admin/get_admin_refunds"

export default function Admin_refunds(){

    const [api_responce_msg, set_api_responce_msg] = useState<string>("")
    const [error_msg, set_error_msg] = useState<string>("")

    const [search_gate_order_id, set_search_gate_order_id] = useState<boolean>(false)
    const [search_gate_name, set_search_gate_name] = useState<boolean>(false)
    const [search_gate_email, set_search_gate_email] = useState<boolean>(false)
    const [search_gate_phone, set_search_gate_phone] = useState<boolean>(false)

    const [search_gate_active, set_search_gate_active] = useState<boolean>(false)
    const [search_gate_processing, set_search_gate_processing] = useState<boolean>(false)
    const [search_gate_cancel, set_search_gate_cancel] = useState<boolean>(false)
    const [search_gate_done, set_search_gate_done] = useState<boolean>(false)

    const [refund_arr, set_refund_arr] = useState<Array<Refund>>([]);
    const [refund_arr_display, set_refund_arr_display] = useState<Array<Refund>>([]);

    const [search_order_id, set_search_order_id] = useState<string>("")
    const [search_name, set_search_name] = useState<string>("")
    const [search_surname, set_search_surname] = useState<string>("")
    const [search_email, set_search_email] = useState<string>("")
    const [search_phone, set_search_phone] = useState<string>("")

    const [loading, set_loading] = useState<boolean>(true)
    const [update, set_update] = useState<boolean>(true)

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [is_admin, set_is_admin] = useState<boolean>(false)

    useEffect(() => {
        set_loading(true)

        const temp = async() => {
            var is_admin = await check_for_admin(user_data[0].email, user_data[0].password)

            if(is_admin.next_status === true){
                set_is_admin(true)
            }
        }

        temp()
        set_loading(false);

    }, [])

    useEffect(() => {
        set_loading(true)
        const fetchData = async () => {
            var data = await get_admin_refunds()

            set_refund_arr(data)
            set_refund_arr_display(data)
  
          };

        fetchData()
        set_loading(false);

    }, [update])

    
    useEffect(() => {      // searches products based on user input, valid input: product name, product size
        var res_arr: Array<Refund> = []

        var filtred_refunds = []

        for(let refund2 of refund_arr){

            var refund: Refund = refund2

            if(search_gate_active){
                if(refund.refunds[0].status === "Active"){
                    filtred_refunds.push(refund)
                }
            }else if(search_gate_processing){
                if(refund.refunds[0].status === "Proccesing"){
                    filtred_refunds.push(refund)
                }
            }else if(search_gate_cancel){
                if(refund.refunds[0].status === "Cancel"){
                    filtred_refunds.push(refund)
                }
            }else if(search_gate_done){
                if(refund.refunds[0].status === "Done"){
                    filtred_refunds.push(refund)
                }
            }else{
                filtred_refunds.push(refund)
            }
        }

        for(var refund of filtred_refunds){ 
            var new_refund: Refund = refund

            if(search_name && search_surname){
                if(new_refund.refunds[0].name.toString().toLocaleLowerCase().includes(search_name.toLocaleLowerCase()) && new_refund.refunds[0].surname.toString().includes(search_surname.toLocaleLowerCase())){
                    res_arr.push(refund)
                }   
            }else if(search_order_id){
                if(new_refund.refunds[0].order_id.toString().toLocaleLowerCase().includes(search_order_id.toLocaleLowerCase())){
                    res_arr.push(refund)
                }            
            }else if(search_name){
                if(new_refund.refunds[0].name.toString().toLocaleLowerCase().includes(search_name.toLocaleLowerCase())){
                    res_arr.push(refund)    
                }
            }else if(search_surname){
                if(new_refund.refunds[0].surname.toString().toLocaleLowerCase().includes(search_surname.toLocaleLowerCase())){
                    res_arr.push(refund)    
                }
            }else if(search_email){
                if(new_refund.refunds[0].email.toString().toLocaleLowerCase().includes(search_email.toLocaleLowerCase())){
                    res_arr.push(refund)    
                }
            }else if(search_phone){
                if(new_refund.refunds[0].phone.toString().toLocaleLowerCase().includes(search_phone.toLocaleLowerCase())){
                    res_arr.push(refund)
                }
            }else{
                res_arr.push(refund)
            }
        }

        if(!search_order_id && !search_name && !search_surname && !search_email && !search_phone && !search_gate_active && !search_gate_processing && !search_gate_cancel && !search_gate_done){
            set_refund_arr_display(refund_arr)
        }else{
            set_refund_arr_display(res_arr)
        }

    },[search_order_id, search_name, search_surname, search_email, search_phone, search_gate_active, search_gate_processing, search_gate_cancel, search_gate_done])

    
    var handle_submit = async (event: React.MouseEvent<HTMLElement>, record_id: number, status: string) => {

        set_loading(true)

        event.preventDefault();

        const refund_status_change = get_refund_status_change_template(status)

        const [api_responce, error] = await change_status(refund_status_change, record_id)

        if(error){
            set_error_msg("error ocured")
        }else{
            set_api_responce_msg(api_responce.msg)
        }

        set_update(!update)
        set_loading(false)

    }

    return(
        <>
            {loading ? <p>loading</p> : <>
            <p>{api_responce_msg}</p>
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

            <button onClick={() => {set_search_gate_active(!search_gate_active); set_search_gate_processing(false); set_search_gate_cancel(false); set_search_gate_done(false)}}>status Active</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_processing(!search_gate_processing); set_search_gate_cancel(false); set_search_gate_done(false)}}>status Proccesing</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_processing(false); set_search_gate_cancel(!search_gate_cancel); set_search_gate_done(false)}}>status Cancled</button>

            <button onClick={() => {set_search_gate_active(false); set_search_gate_processing(false); set_search_gate_cancel(false); set_search_gate_done(!search_gate_done)}}>status Done</button>


            {is_admin ? refund_arr_display.length > 0 ?
                <div>
                    <p>refunds</p>
                    {refund_arr_display.map((refund: Refund) => 
                        
                            <table key={refund.refunds[0].id}>
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
                                        <td>{refund.refunds[0].order_id}</td>
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

                                {refund.refund_products.map((product: Refund_Product, index: number) => 
                                    <tr key={index.toString()}>
                                        <td>{product.name}</td>
                                        <td>{product.size}</td>
                                        <td>{product.price}</td>
                                        <td>{product.amount}</td>
                                        <td>{product.reason}</td>
                                    </tr>
                                )}

                                    <tr>
                                        <td>
                                            <button onClick={(event) => handle_submit(event, refund.refunds[0].id, "Proccesing")}>Proccesing</button>
                                            <button onClick={(event) => handle_submit(event, refund.refunds[0].id, "Cancel")}>Cancel</button>
                                            <button onClick={(event) => handle_submit(event, refund.refunds[0].id, "Done")}>Done</button>
                                        </td>
                                    </tr>

                                </tbody>
                               
                            </table>                        
                    )}
                </div>
            
            : <p>no records</p> 
            : <Access_denied></Access_denied>}
            </>}
            
        </>
    )
}    