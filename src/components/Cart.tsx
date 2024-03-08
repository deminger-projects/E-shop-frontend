import { Link } from "react-router-dom"

import cart from "../data/cart.json"

export default function Cart(){

    return(
        <>
          <div id="cart">
                <Link to="/prepare-order">
                    <img src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/others/cart_image.jpg"} width={"80px"} height={"80px"}></img>
                    <p id="cart_item_number">{cart.length}</p>
                </Link>
            </div>
        </>
    )
}
