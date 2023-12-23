import user_returns from "../../../../data/user_refunds.json"
import login_data from "../../../../data/login_data.json"

import Access_denied from "../../Access_denied"

import Refund, {RefundProduct} from "../../../../interfaces/user/User_Refunds"

export default function Placed_returns(){

    return(
        <>
            {login_data[0].users[0].login_status  === "Active" ? user_returns.length !== 0 ?
                <table>
                    {user_returns.map((refund: Refund) => (
                        <>
                            <tr>
                                <th>name</th>
                                <th>surname</th>
                                <th>email</th>
                                <th>phone</th>
                                <th>adress</th>
                                <th>psc</th>
                                <th>order date</th>
                            </tr> 

                                <tr>
                                    <td><p>{refund.refunds[0].name}</p></td>
                                    <td><p>{refund.refunds[0].surname}</p></td>
                                    <td><p>{refund.refunds[0].email}</p></td>
                                    <td><p>{refund.refunds[0].phone}</p></td>
                                    <td><p>{refund.refunds[0].adress}</p></td>
                                    <td><p>{refund.refunds[0].postcode}</p></td>
                                    <td><p>{refund.refunds[0].add_date}</p></td>
                                </tr>

                                <tr>
                                    <th>product name</th>
                                    <th>product size</th>
                                    <th>product prize</th>
                                    <th>product quntity</th>
                                </tr>

                                {refund.refund_products.map((product: RefundProduct) => 
                                    <>
                                        <tr>
                                        <td><p>{product.name}</p></td>
                                        <td><p>{product.size}</p></td>
                                        <td><p>{product.prize}</p></td>
                                        <td><p>{product.amount}</p></td>
                                        </tr>            
                                    </>
                                )}

                                <br></br>
                                <br></br>
                                <br></br>

                        </>
                    ))}

                </table>

                :<p>no data</p>
                : <Access_denied></Access_denied>
            }
        </>
    )
}