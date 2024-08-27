
import Access_denied from "../../Access_denied"

import User_refunds, {OrderProduct} from "../../../../interfaces/user/User_Refunds"
import { useEffect, useState } from "react"
import get_user_placed_returns from "../../../../apis/getters/user/get_user_placed_returns"
import Loading from "../../../../components/Loading"
import Roll_button from "../../../../components/Roll_button"

export default function Placed_returns(){

    const [refunds_arr, set_refunds_arr] = useState<Array<User_refunds>>([])
    const [refunds_arr_display, set_refunds_arr_display] = useState<Array<User_refunds>>([])

    const [search_refund_id, set_search_refund_id] = useState<string>("")

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [loading, set_loading] = useState<boolean>(true)

    const [roll_button_status, set_roll_button_status] = useState<boolean>(false)
    const [last_item_id, set_last_item_id] = useState<number>(0)

    useEffect(() => {
        var res_arr: Array<User_refunds> = []

        for(var refund of refunds_arr){

            var refund_fix: User_refunds = refund

            if(search_refund_id){
                if(refund_fix.refunds[0].order_code.toString().includes(search_refund_id)){
                    res_arr.push(refund)
                }
            }
        }

        if(search_refund_id){
            set_refunds_arr_display(res_arr)
        }else{
            set_refunds_arr_display(refunds_arr)
        }

    }, [search_refund_id])


    useEffect(() => {
        const fetchData = async () => {
            var data = await get_user_placed_returns(user_data[0].email, user_data[0].password, last_item_id)
    
            if(data.length < 3){
                set_roll_button_status(false)
            }
    
            if (data.length === 3){
                set_roll_button_status(true)
            }

            if(data.length > 0){
                set_refunds_arr(data)
                set_refunds_arr_display(data)

                set_last_item_id(data[data.length - 1].refunds[0].id)

            }
            
    
            set_loading(false);
          };

        fetchData()
    }, [])


    var get_more_products = async () => {
        set_loading(true)

        var data1 = await get_user_placed_returns(user_data[0].email, user_data[0].password, last_item_id)

        if(data1.length < 3){
            set_roll_button_status(false)
        }

        if (data1.length === 3){
            set_roll_button_status(true)
        }

        if(data1.length > 0){
            var products_arr_copy = [...refunds_arr]
            var new_data = products_arr_copy.concat(data1)
    
            set_refunds_arr(new_data)
            set_refunds_arr_display(new_data)
    
            set_last_item_id(data1[data1.length - 1].refunds[0].id)
        }

        if(data1.length < 3){
            set_roll_button_status(false)

        }

        set_loading(false)
    }

    return(
        <>

            {loading ? <Loading></Loading> : <>
                <label htmlFor="">order code</label>
                <input type="text" value={search_refund_id} onChange={(event) => set_search_refund_id(event.target.value)}/>

                {user_data.length > 0 ? refunds_arr_display.length !== 0 ?   
                    refunds_arr_display.map((refund: User_refunds) => (
                            
                            <table key={refund.refunds[0].id.toString()}>
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
                                        <td><p>{refund.refunds[0].order_code}</p></td>
                                        <td><p>{refund.refunds[0].name}</p></td>
                                        <td><p>{refund.refunds[0].surname}</p></td>
                                        <td><p>{refund.refunds[0].email}</p></td>
                                        <td><p>{refund.refunds[0].phone}</p></td>
                                        <td><p>{refund.refunds[0].adress}</p></td>
                                        <td><p>{refund.refunds[0].postcode}</p></td>
                                        <td><p>{refund.refunds[0].add_date}</p></td>
                                        <td><p>{refund.refunds[0].status}</p></td>
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

                                    {refund.order_products.map((product: OrderProduct) => 
                                            <tbody key={product.id.toString()}>                                                                
                                                <tr>
                                                    <td><p>{product.name}</p></td>
                                                    <td><p>{product.size}</p></td>
                                                    <td><p>{product.prize}</p></td>
                                                    <td><p>{product.amount}</p></td>
                                                    <td><img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + product.product_id + "/" + product.image_url} width={"100px"} height={"100px"}/></td>
                                                </tr>     
                                            </tbody>       
                                        
                                    )}
                                    </table>
                            
                        ))

                    

                    :<p>no data</p>
                    : <Access_denied></Access_denied>
                }
                                
                {roll_button_status ? <Roll_button get_more_products={get_more_products}></Roll_button> : <></>}

            </>}
            
        </>
    )
}
