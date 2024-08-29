import { Link } from "react-router-dom"

import Product from "../interfaces/Product"

export default function Product_comp(props: {item: Product}){

    const product = props.item

    return(
        <>
            <div key={product.products[0].id.toString()} className="grid-item">
                <Link to={"/item-info/" + product.products[0].id} state={{product_data: product}}>
                    <p>{product.products[0].product_name}</p>
                    <img alt={product.products[0].product_name} className="images" src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/products/" + product.products[0].id + "/" + product.products[0].url} width={"100px"} height={"100px"}></img>
                    <p>{product.products[0].price + " €"}</p>
                </Link>
                                
                <br></br>
                <br></br>
            </div>  
        </>
    )

}