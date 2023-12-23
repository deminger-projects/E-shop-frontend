import get_show_cases from "../functions/getters/get_show_cases"

import { ProductImage } from "../interfaces/Product"

export default function User_show_case(props: {images: Array<ProductImage>, id: number, folder: string}){

    const show_cases = get_show_cases(props.images)

    return(
        <>
            {show_cases.model_show_case.map((image, index) => (
                <img key={image + index.toString()} className="grid-item2" src={"images/" + props.folder + "/" + props.id + "/" + image} alt="" width={"100xp"} height={"100px"}/>
            ))}

            <br />

            {show_cases.detail_show_case.map((image, index) => (
                <img key={image + index.toString()} className="grid-item2" src={"images/" + props.folder + "/" + props.id + "/" + image} alt="" width={"100xp"} height={"100px"}/>
            ))}

            <br />

            {show_cases.other.map((image, index) => (
                <img key={image + index.toString()} className="grid-item2" src={"images/" + props.folder + "/" + props.id + "/" + image} alt="" width={"100xp"} height={"100px"}/>
            ))}
        </>
    )

}