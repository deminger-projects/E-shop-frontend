import { Link } from "react-router-dom"

import Collection from "../interfaces/Collections"

export default function Collection_comp(props: {item: Collection}){

    const collection = props.item

    return(
        <>
            <div key={collection.collections[0].id.toString()}>
                <Link to={"/showcase/" + collection.collections[0].id}>
                    <p>{collection.collections[0].name}</p>
                    <img className="images" src={process.env.REACT_APP_SECRET_SERVER_URL + "/collections/" + collection.collections[0].id + "/" + collection.collections[0].image_url} width={"100px"} height={"100px"}></img>
                </Link>
            </div>
        </>
    )

}