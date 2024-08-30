import { useEffect, useState } from "react"

import Sub_image_add from "../sub_components/Sub_image_add"
import fix_file_name from "../../functions/sub_functions/fix_file_name"

import Files from "../../interfaces/Files"

export default function Admin_image_add(props: {on_change: Function, on_delete: Function, default_files?: {main: File|undefined, hover: File|undefined, other: Array<File>, model_show_case: {status: Boolean, data: Array<{file: File, url: string}>}, detail_show_case: {status: Boolean, data: Array<{file: File, url: string}>}}, default_urls?: {main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}, settings?: {hover: boolean, model_show_case?: boolean, detail_show_case?: boolean}, is_order?: boolean}){

    const settings = props.settings ? {main: true, hover: props.settings.hover, model_show_case: props.settings.model_show_case, detail_show_case: props.settings.detail_show_case} : {main: true, hover: false, model_show_case: false, detail_show_case: false}

    const [default_urls, set_default_urls] = useState<{main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>(props.default_urls ? {main: props.default_urls.main , hover: props.default_urls.hover, other: props.default_urls.other, model_show_case: props.default_urls.model_show_case, detail_show_case: props.default_urls.detail_show_case} : {main: undefined , hover: undefined, other: [], model_show_case: [], detail_show_case: []})

    const [files, set_files] = useState<{main: File|undefined, hover: File|undefined, other: Array<File>, model_show_case: {status: Boolean, data: Array<{file: File, url: string}>}, detail_show_case: {status: Boolean, data: Array<{file: File, url: string}>}}>(props.default_files ? props.default_files : {main: undefined, hover: undefined, other: [], model_show_case: {status: false, data: []}, detail_show_case: {status: false, data: []}})

    var handle_add_img = () => {

        var old_other = [...default_urls.other]
        old_other.push("place_holder")

        set_default_urls({...default_urls, other: old_other})
    }

    var handle_input_change = (file: FileList|null, type: string, pozition?: number, special_type?: string) => {

        if(file && file[0].name && file[0]){ //file[0].name && file[0] pridano bez testovani

            var all_file_names = []
    
            var new_file_url = file[0].name

            var split1_main = default_urls.main?.split(".")
    
            if(split1_main){
                var extencion_main = split1_main[split1_main!.length - 1]
    
                var spl_main = default_urls.main?.split("/")
    
                if(spl_main){
                    var temp_split_main = spl_main[spl_main?.length - 1].split("_")
                    temp_split_main.pop()
                    temp_split_main?.join("_")
    
                    var old_file_url_main =  temp_split_main[0] + "." + extencion_main

                    all_file_names.push(old_file_url_main)
    
                }
            }
    
            var split1_hover = default_urls.hover?.split(".")
    
            if(split1_hover){
                var extencion_hover = split1_hover[split1_hover!.length - 1]
    
                var spl_hover = default_urls.hover?.split("/")
    
                if(spl_hover){
                    var temp_split_hover = spl_hover[spl_hover?.length - 1].split("_")
                    temp_split_hover.pop()
                    temp_split_hover?.join("_")
    
                    var old_file_url_hover =  temp_split_hover[0] + "." + extencion_hover

                    all_file_names.push(old_file_url_hover)
    
                }
            }

            for(var other_file of default_urls.other){
                var temp = other_file.split("/")
                var new_other_file = temp[temp.length - 1]

                all_file_names.push(new_other_file)
            }


            if(files.main){
                var temp = files.main.name.split(".")
                var extencion = temp[temp.length - 1]
                
                var spl = files.main.name.split("_")
                spl.pop()
                spl.join('_')

                var new_name = spl[0] + "." + extencion

                all_file_names.push(new_name)            
            }

            if(files.hover){
                var temp = files.hover.name.split(".")
                var extencion = temp[temp.length - 1]
                
                var spl = files.hover.name.split("_")
                spl.pop()
                spl.join('_')

                var new_name = spl[0] + "." + extencion

                all_file_names.push(new_name)            
            }

            for(let other_file of files.other){
                if(other_file){
                    all_file_names.push(other_file.name)
                }
            }

            var count = 0

            for(var file_url of all_file_names){    
                if(file_url === new_file_url){

                    for(let file_test of all_file_names){
                        var file_test_split = file_test.split(".")[0]
                        var new_file_url_split = new_file_url.split(".")[0]

                        if(file_test_split.includes(new_file_url_split)){
                            count++
                        }
                    }

                    if(count === 1){
                        let temp = new_file_url.split(".")
                        let extencion = temp[temp.length - 1]

                        new_file_url = temp[0] + "1." + extencion                        
                
                    }else if(count > 1){
                        var last_file_name_index = undefined

                        for(let file_test of all_file_names){
                            var file_test_split = file_test.split(".")[0]
                            var new_file_url_split = new_file_url.split(".")[0]                         
                            
                            if(file_test_split.includes(new_file_url_split)){
                                let sup_temp = file_test.split(".")
                                let extencion = sup_temp[sup_temp.length - 1]

                                var test = sup_temp[sup_temp.length - 2].substring(sup_temp[sup_temp.length - 2].length - 1, -1)

                                var new_neco = test + "." + extencion

                                if(new_neco === new_file_url){
                                    last_file_name_index = Number(sup_temp[sup_temp.length - 2].slice(-1)) + 1
                                }
                            }
                        }

                        if(last_file_name_index){
                            let temp = new_file_url.split(".")
                            new_file_url = temp[0] + last_file_name_index + "." + temp[temp.length - 1]
                        }
                        
                    }
                    break;
                }
            }

            
                var new_name = URL.createObjectURL(file[0])    
                if(type === "main"){
                    
                    var asplit_ild_name = new_file_url.split(".")
                    var extencion = asplit_ild_name[1]
                    var name = fix_file_name(asplit_ild_name[0])
    
                    var new_file_name = name + "_main." + extencion
                    var blob = file[0].slice(0, file[0].size, 'image/png'); 
                    var new_file = new File([blob], new_file_name, {type: 'image/png'})
    
                    set_files({...files, main: new_file})
                    set_default_urls({...default_urls, main: new_name})
    
                    props.on_change({...files, main: new_file})
                    props.on_delete({...default_urls, main: new_name})
    
                }
    
                if(type === "hover"){
    
                    var asplit_ild_name = new_file_url.split(".")
                    var extencion = asplit_ild_name[1]
                    var name = fix_file_name(asplit_ild_name[0])
    
                    var new_file_name = name + "_hover." + extencion
                    var blob = file[0].slice(0, file[0].size, 'image/png'); 
                    var new_file = new File([blob], new_file_name, {type: 'image/png'})
                    
                    set_files({...files, hover: new_file})
                    set_default_urls({...default_urls, hover: new_name})
    
                    props.on_change({...files, hover: new_file})
                    props.on_delete({...default_urls, hover: new_name})
    
                }
    
                if(type === "other" && pozition !== undefined){
                    var old_other = [...default_urls.other]
                    var old_files = [...files.other]
    
                    var asplit_ild_name = new_file_url.split(".")
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
                    props.on_delete({...default_urls, other: old_other})
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
        props.on_delete({...default_urls, other: old_urls})

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
                    <input accept="image/png, image/gif, image/jpeg" type="file" id="main" onChange={(event) => {handle_input_change(event.target.files, "main")}}></input>
                    <label htmlFor="main">(main)</label>
                    <br></br>
                </div> 
            : 
                <></>
            }

            {default_urls.hover !== undefined || settings.hover === true ? 
                <div key={"hover"}>
                    <img src={default_urls.hover} width={"100px"} height={"100px"} alt="img"></img>
                    <input accept="image/png, image/gif, image/jpeg" type="file" id="hover" onChange={(event) => {handle_input_change(event.target.files, "hover")}}></input>
                    <label htmlFor="hover">(hover)</label>
                    <br></br>
                </div> 
            : <></>}

            {default_urls.other.map((url: string, index: number) => 
                <div key={index.toString()} id={index.toString()}>
                    <img src={url} width={"100px"} height={"100px"} alt="img"></img>
                    <input accept="image/png, image/gif, image/jpeg" type="file" id={"other_" + index.toString()} onChange={(event) => {handle_input_change(event.target.files, "other", index)}}></input>
                    <label htmlFor={"other_" + index.toString()}></label>

                    <button type='button' onClick={() => handle_delete_img(index)}>Delete</button>
                </div> 
            )}

            <button type='button' onClick={handle_add_img}>Add image</button>

            <br />

            {props.settings ? <><Sub_image_add get_check_box_status={handle_special_type_change} get_show_case={set_show_case} settings={{model_show_case: props.settings.model_show_case, detail_show_case: props.settings.detail_show_case}} default_urls={{model_show_case: default_urls.model_show_case, detail_show_case: default_urls.detail_show_case}}/></> : <></>}
            
        </>
    )

}