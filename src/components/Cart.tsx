import { useCookies } from "react-cookie";
import { Link } from "react-router-dom"

export default function Cart(){

    const [cookies, set_cookies] = useCookies(['cart_data']);

    return(
        <>
          <div id="cart">
                <Link to="/prepare-order">
                    <img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/others/cart_image.jpg"} width={"80px"} height={"80px"}></img>
                    <p id="cart_item_number">{cookies.cart_data.length}</p>
                </Link>
            </div>
        </>
    )
}
