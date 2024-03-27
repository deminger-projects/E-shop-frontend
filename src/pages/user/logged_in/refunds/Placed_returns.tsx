
import Access_denied from "../../Access_denied"

import User_refunds, {OrderProduct, Refund} from "../../../../interfaces/user/User_Refunds"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"

export default function Placed_returns(){

    const [refunds_arr, set_refunds_arr] = useState<Array<User_refunds>>([])
    const [refunds_arr_display, set_refunds_arr_display] = useState<Array<User_refunds>>([])

    const [search_refund_id, set_search_refund_id] = useState<string>("")

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    const [loading, set_loading] = useState<boolean>(true)

    useEffect(() => {
        var res_arr: Array<User_refunds> = []

        for(var refund of refunds_arr){

            var refund_fix: User_refunds = refund

            if(search_refund_id){
                if(refund_fix.refunds[0].id.toString().includes(search_refund_id)){
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
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
          
            const email = user_data[0].email
            const password = user_data[0].password

            const form_data = new FormData()

            form_data.append("email", JSON.stringify(email))
            form_data.append("password", JSON.stringify(password))


          const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_user_place_returns', {
            method: 'POST',
            body: form_data
        }); 

          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          
          set_refunds_arr(data)
          set_refunds_arr_display(data)

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
                <input type="text" value={search_refund_id} onChange={(event) => set_search_refund_id(event.target.value)}/>

                {user_data.length > 0 ? refunds_arr_display.length !== 0 ?   
                    refunds_arr_display.map((refund: User_refunds) => (
                            
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
                                        <td><p>{refund.refunds[0].id}</p></td>
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
            </>}
            
        </>
    )
}
