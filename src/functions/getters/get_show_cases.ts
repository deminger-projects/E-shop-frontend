import {ProductImage} from "../../interfaces/Product"

export default function get_show_cases(images: ProductImage[]){

    var model_show_case: Array<string> = []
    var detail_show_case: Array<string> = []
    var other: Array<string> = []

    for(let image of images){
        var image_split = image.image_url.split(".")
        var image_split2 = image_split[0].split("_")

        if(image_split2[image_split2.length - 2] === "model"){
            model_show_case.push(image.image_url)
        }else if(image_split2[image_split2.length - 2] === "detail"){
            detail_show_case.push(image.image_url)
        }else{
            other.push(image.image_url)
        }
    }

    return {model_show_case: model_show_case, detail_show_case: detail_show_case, other: other}

}