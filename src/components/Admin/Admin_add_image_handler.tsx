import { useState } from "react"

import Sub_image_add from "../sub_components/Sub_image_add"
import corrent_file_name from "../../functions/sub_functions/fix_file_name"
import fix_file_name from "../../functions/sub_functions/fix_file_name"

export default function Admin_image_add(props: {on_change: Function, default_urls?: {main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}, settings?: {hover: boolean, model_show_case?: boolean, detail_show_case?: boolean}}){

    const settings = props.settings ? {main: true, hover: props.settings.hover, model_show_case: props.settings.model_show_case, detail_show_case: props.settings.detail_show_case} : {main: true, hover: false, model_show_case: false, detail_show_case: false}

    const [default_urls, set_default_urls] = useState<{main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>(props.default_urls ? props.default_urls : {main: undefined, hover: undefined, other: [], model_show_case: [], detail_show_case: []})

    const [files, set_files] = useState<{main: File|undefined, hover: File|undefined, other: Array<File>, model_show_case: {status: Boolean, data: Array<{file: File, url: string}>}, detail_show_case: {status: Boolean, data: Array<{file: File, url: string}>}}>({main: undefined, hover: undefined, other: [], model_show_case: {status: false, data: []}, detail_show_case: {status: false, data: []}})

    var handle_add_img = () => {

        var old_other = [...default_urls.other]
        old_other.push("place_holder")
        set_default_urls({...default_urls, other: old_other})
    }

    var handle_input_change = (file: FileList|null, type: string, pozition?: number, special_type?: string) => {

        if(file !== null){
            var new_name = URL.createObjectURL(file[0])    
            if(type === "main"){
                
                var asplit_ild_name = file[0].name.split(".")
                var extencion = asplit_ild_name[1]
                var name = fix_file_name(asplit_ild_name[0])

                var new_file_name = name + "_main." + extencion
                var blob = file[0].slice(0, file[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                set_files({...files, main: new_file})
                set_default_urls({...default_urls, main: new_name})
                props.on_change({...files, main: new_file})

            }

            if(type === "hover"){

                var asplit_ild_name = file[0].name.split(".")
                var extencion = asplit_ild_name[1]
                var name = fix_file_name(asplit_ild_name[0])

                var new_file_name = name + "_hover." + extencion
                var blob = file[0].slice(0, file[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})
                
                set_files({...files, hover: new_file})
                set_default_urls({...default_urls, hover: new_name})
                props.on_change({...files, hover: new_file})

            }

            if(type === "other" && pozition !== undefined){
                var old_other = [...default_urls.other]
                var old_files = [...files.other]

                var asplit_ild_name = file[0].name.split(".")
                var extencion = asplit_ild_name[1]
                var name = fix_file_name(asplit_ild_name[0])

                var new_file_name = name + "." + extencion
                var blob = file[0].slice(0, file[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_other[pozition] = new_name
                old_files[pozition] = new_file

                set_files({...files, other: old_files})
                set_default_urls({...default_urls, other: old_other})
                props.on_change({...files, other: old_files})

            }
        }
    }

    var handle_delete_img = (pozition: number) => {

        var old_files = [...files.other]
        var old_urls = [...default_urls.other]

        old_files.splice(pozition, 1)
        old_urls.splice(pozition, 1)

        set_files({...files, other: old_files})
        set_default_urls({...default_urls, other: old_urls})

        props.on_change({...files, other: old_files})

    }

    var set_show_case = (new_files: {status: boolean, data: Array<{file: File, url: string}>}, type: string) => {

        if(type === "model"){
            set_files({...files, model_show_case: {...files.model_show_case, data: new_files.data}})
            props.on_change({...files, model_show_case: new_files})
        }else if(type === "detail"){
            set_files({...files, detail_show_case: {...files.detail_show_case, data: new_files.data}})
            props.on_change({...files, detail_show_case: new_files})
        }

    }


    var handle_special_type_change = (special_type_status: {product_show_case: boolean, detail_show_case: boolean}) => {
        set_files({...files, model_show_case: { ...files.model_show_case, status: special_type_status.product_show_case}, detail_show_case: {...files.detail_show_case, status: special_type_status.detail_show_case}})
        props.on_change({...files, model_show_case: { ...files.model_show_case, status: special_type_status.product_show_case}, detail_show_case: {...files.detail_show_case, status: special_type_status.detail_show_case}})
    }

    return(
        <>
            {default_urls.main !== undefined || settings.main === true ? 
                <div key={"main"}>
                    <img src={default_urls.main} width={"100px"} height={"100px"} alt="img"></img>
                    <input type="file" id="main" onChange={(event) => {handle_input_change(event.target.files, "main")}}></input>
                    <label htmlFor="main">(main)</label>
                    <br></br>
                </div> 
            : 
                <></>
            }

            {default_urls.hover !== undefined || settings.hover === true ? 
                <div key={"hover"}>
                    <img src={default_urls.hover} width={"100px"} height={"100px"} alt="img"></img>
                    <input type="file" id="hover" onChange={(event) => {handle_input_change(event.target.files, "hover")}}></input>
                    <label htmlFor="hover">(hover)</label>
                    <br></br>
                </div> 
            : <></>}

            {default_urls.other.map((url: string, index: number) => 
                <div key={index.toString()} id={index.toString()}>
                    <img src={url} width={"100px"} height={"100px"} alt="img"></img>
                    <input type="file" id={"other_" + index.toString()} onChange={(event) => {handle_input_change(event.target.files, "other", index)}}></input>
                    <label htmlFor={"other_" + index.toString()}></label>

                    <button type='button' onClick={() => handle_delete_img(index)}>delete</button>
                </div> 
            )}

            <button type='button' onClick={handle_add_img}>add image</button>

            <br />

            {props.settings ? <><Sub_image_add get_check_box_status={handle_special_type_change} get_show_case={set_show_case} settings={{model_show_case: props.settings.model_show_case, detail_show_case: props.settings.detail_show_case}} default_urls={{model_show_case: default_urls.model_show_case, detail_show_case: default_urls.detail_show_case}}/></> : <></>}
            
        </>
    )

}