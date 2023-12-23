import { useState } from "react";
import fix_file_name from "../../functions/sub_functions/fix_file_name";

export default function Sub_image_add(props: {get_check_box_status: Function, settings: {model_show_case: boolean|undefined, detail_show_case: boolean|undefined}, get_show_case: Function, default_urls?: {model_show_case: Array<string>, detail_show_case: Array<string>}}){
    
    const [check_box_status, set_check_box_status] = useState<{product_show_case: boolean, detail_show_case: boolean}>(props.default_urls ? props.default_urls.model_show_case.length > 0 && props.default_urls.detail_show_case.length > 0 ? {product_show_case: true, detail_show_case: true} : props.default_urls.model_show_case.length > 0 && props.default_urls.detail_show_case.length <= 0 ? {product_show_case: true, detail_show_case: false} : props.default_urls.model_show_case.length <= 0 && props.default_urls.detail_show_case.length > 0 ? {product_show_case: false, detail_show_case: true} : {product_show_case: false, detail_show_case: false} : {product_show_case: false, detail_show_case: false})

    const [model_show_case_arr, set_model_show_case_arr] = useState<Array<{file: File|undefined, url: string|undefined}>>(props.default_urls ? [{file: undefined, url: props.default_urls.model_show_case[0]}, {file: undefined, url: props.default_urls.model_show_case[1]}, {file: undefined, url: props.default_urls.model_show_case[2]}, {file: undefined, url: props.default_urls.model_show_case[3]}] : [{file: undefined, url: undefined}, {file: undefined, url: undefined}, {file: undefined, url: undefined}, {file: undefined, url: undefined}])

    const [detail_show_case_arr, set_detail_show_case_arr] = useState<Array<{file: File|undefined, url: string|undefined}>>(props.default_urls ? [{file: undefined, url: props.default_urls.detail_show_case[0]}, {file: undefined, url: props.default_urls.detail_show_case[1]}, {file: undefined, url: props.default_urls.detail_show_case[2]}, {file: undefined, url: props.default_urls.detail_show_case[3]}] : [{file: undefined, url: undefined}, {file: undefined, url: undefined}, {file: undefined, url: undefined}, {file: undefined, url: undefined}])

    var handle_input_change = (file: FileList|null, type: string, pozition: number) => {

        if(file !== null){

            var new_url = URL.createObjectURL(file[0])    

            if(type === "product_show_case"){
                var old_data = [...model_show_case_arr]

                var asplit_ild_name = file[0].name.split(".")
                var extencion = asplit_ild_name[1]
                var name = fix_file_name(asplit_ild_name[0])
                
                var new_file_name = name + "_model_" + pozition + "." + extencion
                var blob = file[0].slice(0, file[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_data[pozition].file = new_file
                old_data[pozition].url = new_url

                set_model_show_case_arr(old_data)
                props.get_show_case({status: check_box_status.product_show_case, data: old_data}, "model")

            }else if(type === "detail_show_case"){
                var old_data = [...detail_show_case_arr]

                var asplit_ild_name = file[0].name.split(".")
                var extencion = asplit_ild_name[1]
                var name = fix_file_name(asplit_ild_name[0])

                var new_file_name = name + "_detail_" + pozition + "." + extencion
                var blob = file[0].slice(0, file[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_data[pozition].file = new_file
                old_data[pozition].url = new_url
                
                set_detail_show_case_arr(old_data)
                props.get_show_case({status: check_box_status.detail_show_case, data: old_data}, "detail")
            }
        }
    }

    return(
        <>
            {props.settings?.model_show_case ? <>
                <label htmlFor="product_show_case">Product model show case</label>
                <input checked={check_box_status.product_show_case} id="product_show_case" type="checkbox" onChange={() => {set_check_box_status({product_show_case: !check_box_status.product_show_case, detail_show_case: check_box_status.detail_show_case}); props.get_check_box_status({product_show_case: !check_box_status.product_show_case, detail_show_case: check_box_status.detail_show_case})}}/>

                {check_box_status.product_show_case ? 
                    model_show_case_arr.map(({file, url}, index) => (
                        <div key={index.toString()} id={index.toString()}>
                            <img src={url} width={"100px"} height={"100px"} alt="img"></img>
                            <input type="file" id={"other_" + index.toString()} onChange={(event) => {handle_input_change(event.target.files, "product_show_case", index)}}></input>
                            <label htmlFor={"other_" + index.toString()}></label>
                        </div> 
                    ))
                : <></>}
                
            </> : <></>}

            <br />

            {props.settings?.detail_show_case ? <>
                <label htmlFor="detail_show_case">Detail show case</label>
                <input checked={check_box_status.detail_show_case} id="detail_show_case" type="checkbox" onChange={() => {set_check_box_status({product_show_case: check_box_status.product_show_case, detail_show_case: !check_box_status.detail_show_case}); props.get_check_box_status({product_show_case: check_box_status.product_show_case, detail_show_case: !check_box_status.detail_show_case})}}/>
        
                {check_box_status.detail_show_case ?     
                    detail_show_case_arr.map(({file, url}, index) => (
                        <div key={index.toString()} id={index.toString()}>
                            <img src={url} width={"100px"} height={"100px"} alt="img"></img>
                            <input type="file" id={"other_" + index.toString()} onChange={(event) => {handle_input_change(event.target.files, "detail_show_case", index)}}></input>
                            <label htmlFor={"other_" + index.toString()}></label>
                        </div> 
                    ))
                
                : <></>}
                
            </> : <></>}
        </>
    )

}