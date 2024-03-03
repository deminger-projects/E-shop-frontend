import {ProductData, ProductImage} from "../../interfaces/Product"

import Url from "../../interfaces/Url"

export default function set_up_files(images?: Array<ProductImage>, product?: ProductData, folder?: string){
    
    var default_files: Url = {main: undefined, hover: undefined, other: [], model_show_case: [], detail_show_case: []}
    var default_files_without_path: Url = {main: undefined, hover: undefined, other: [], model_show_case: [], detail_show_case: []}
    var files_to_keep: Array<string> = []

    if(images && product && folder){
        for (let index = 0; index < images.length; index++) {
            var name_split = images[index].image_url.split(".")
    
            var suffix = undefined
            var type = undefined

            var path = "images/" +  folder + "/" + product.id + "/"
    
            if(name_split[0].includes("_")){
                var suffix_split = name_split[0].split("_")
                suffix = suffix_split[suffix_split.length - 1]
                type = suffix_split[suffix_split.length - 2]
            }
    
            if(suffix){
                if(suffix === "main"){
                    default_files.main = path + images[index].image_url
                    default_files_without_path.main = images[index].image_url
                }else if(suffix === "hover"){
                    default_files.hover = path + images[index].image_url
                    default_files_without_path.hover = images[index].image_url
                }
            }else{
                default_files.other.push(path + images[index].image_url)
                default_files_without_path.other.push(images[index].image_url)
            }

            if(type){
                if(type === "model"){
                    default_files.model_show_case.push(path + images[index].image_url)
                    default_files_without_path.model_show_case.push(images[index].image_url)
                }else if(type === "detail"){
                    default_files.detail_show_case.push(path + images[index].image_url)
                    default_files_without_path.detail_show_case.push(images[index].image_url)
                }
            }

            files_to_keep.push(images[index].image_url)

        }
    }

    return {ulrs: default_files, files_to_keep: files_to_keep, urls_without_path: default_files_without_path}

}