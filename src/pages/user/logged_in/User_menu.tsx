import { Link } from "react-router-dom";

import Access_denied from "../Access_denied";

import { useCookies } from "react-cookie";

export default function User_options(){

    const [cookies, setCookie] = useCookies(['user_data'])

    return(
        <>
            {cookies.user_data[0].login_status === "Active" ? 
                <>
                    <Link to="/refunds"><p>make refunds</p></Link>
                    <Link to="/change-password"><p>change password</p></Link>
                    <Link to="/orders"><p>orders log</p></Link>
                    <Link to="/account-info"><p>account data info</p></Link>
                    <Link to="/placed-returns"><p>placed returns</p></Link>

                    <br></br>

                    <Link to="/add-delivery-info"><p>add delivery informations</p></Link>
                </> 
                
                : <Access_denied></Access_denied>}
        </>
    )
}