import { Link } from "react-router-dom";

import Access_denied from "../Access_denied";

import { useState } from "react";

export default function User_options(){

    const [user_data] = useState<Array<any>>(sessionStorage.getItem("user_data") === null ? [] : JSON.parse(sessionStorage.getItem("user_data")!))

    return(
        <>
            {user_data.length > 0 ? 
                <>
                    <Link to="/refunds"><p>Place refund</p></Link>
                    <Link to="/change-password"><p>Change password</p></Link>
                    <Link to="/orders"><p>Your orders</p></Link>
                    <Link to="/account-info"><p>Account informations</p></Link>
                    <Link to="/placed-returns"><p>Placed returns</p></Link>

                    <br></br>

                    <Link to="/add-delivery-info"><p>Add informations for delivery</p></Link>
                </> 
                
                : <Access_denied></Access_denied>}
        </>
    )
}