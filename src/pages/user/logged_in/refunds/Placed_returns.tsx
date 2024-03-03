import user_returns from "../../../../data/user_refunds.json"
import login_data from "../../../../data/login_data.json"

import Access_denied from "../../Access_denied"

import User_refunds, {OrderProduct, Refund} from "../../../../interfaces/user/User_Refunds"
import { useEffect, useState } from "react"

export default function Placed_returns(){

    const [refunds_arr, set_refunds_arr] = useState<Array<User_refunds>>(user_returns)
    const [search_refund_id, set_search_refund_id] = useState<string>("")


    console.log(user_returns)

    useEffect(() => {
        var res_arr: Array<User_refunds> = []

        for(var refund of user_returns){

            var refund_fix: User_refunds = refund

            if(search_refund_id){
                if(refund_fix.refunds[0].order_id.toString().includes(search_refund_id)){
                    res_arr.push(refund)
                }
            }
        }

        if(search_refund_id){
            set_refunds_arr(res_arr)
        }else{
            set_refunds_arr(user_returns)
        }

    }, [search_refund_id])

    return(
        <>
            <label htmlFor="">order id</label>
            <input type="text" value={search_refund_id} onChange={(event) => set_search_refund_id(event.target.value)}/>

            {login_data[0].users[0].login_status  === "Active" ? user_returns.length !== 0 ?
                
                    refunds_arr.map((refund: User_refunds) => (
                        
                        <table key={refund.refunds[0].id.toString()}>
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
                                    <td><p>{refund.refunds[0].order_id}</p></td>
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
                                                <td><img src={"images/products/" + product.product_id + "/" + product.image_url} width={"100px"} height={"100px"}/></td>
                                            </tr>     
                                        </tbody>       
                                    
                                )}
                                </table>
                        
                    ))

                

                :<p>no data</p>
                : <Access_denied></Access_denied>
            }
        </>
    )
}
