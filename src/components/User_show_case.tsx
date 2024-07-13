import { useState } from "react"
import get_show_cases from "../functions/getters/get_show_cases"

import { ProductImage } from "../interfaces/Product"

export default function User_show_case(props: {images: Array<ProductImage>, id: number, folder: string}){

    const show_cases = get_show_cases(props.images)
    console.log("🚀 ~ User_show_case ~ show_cases:", show_cases)

    const [button_status, set_button_status] = useState<boolean>(show_cases.other.length > 0 ? true : false)

    const [other_status, set_other_status] = useState<boolean>(false)


    return(
        <>
            {show_cases.model_show_case.map((image, index) => (
                <img key={image + index.toString()} className="grid-item2" src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/" + props.folder + "/" + props.id + "/" + image} alt="" width={"100xp"} height={"100px"}/>
            ))}

            <br />

            {show_cases.detail_show_case.map((image, index) => (
                <img key={image + index.toString()} className="grid-item2" src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/" + props.folder + "/" + props.id + "/" + image} alt="" width={"100xp"} height={"100px"}/>
            ))}

            <br />

            {button_status ? <button onClick={() => set_other_status(!other_status)}>Rool</button> : <></>}

            {other_status ? show_cases.other.map((image, index) => (
                <img key={image + index.toString()} className="grid-item2" src={process.env.REACT_APP_SECRET_SERVER_URL + "/images/" + props.folder + "/" + props.id + "/" + image} alt="" width={"100xp"} height={"100px"}/>
            )) : <></>}

            
        </>
    )

}