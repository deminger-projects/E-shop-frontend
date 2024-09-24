import { useEffect, useState } from "react"
import fix_file_name from "../../functions/sub_functions/fix_file_name"

export default function Image_test(props: {files_to_delete: Array<string>, change_files_to_delete: Function, default_files:any, change_urls: Function, change_files: Function, default_urls: any, settings: {hover: boolean, model_show_case: boolean, detail_show_case: boolean, other: boolean}}){

    const [blobs, set_blobs] = useState<{main: string, hover: string, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}>({main: "", hover: "", other: [], model_show_case: [], detail_show_case: []})

    const [gates, set_gates] = useState({other: props.default_urls.other.length > 0 ? true : false, model_show_case: props.default_urls.model_show_case.length > 0 ? true : false, detail_show_case: props.default_urls.detail_show_case.length > 0 ? true : false})

    useEffect(() =>{
        set_blobs({...blobs, main: props.default_urls.main, hover: props.default_urls.hover, other: props.default_urls.other, model_show_case: props.default_urls.model_show_case, detail_show_case: props.default_urls.detail_show_case})
    }, [])

    var handle_input_change = ((files: FileList | null, type: string, pozition?: number) => {


        if(type === "main"){
            if(files){
                var old_data = props.default_urls

                var old_name = old_data.main
                var file_name = files[0].name


                var split1 = file_name.split(".")
                var extencion = split1[1]
                var name = fix_file_name(split1[0])

                var new_file_name = name + "_main." + extencion

                var blob = files[0].slice(0, files[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_data.main = new_file_name

                set_blobs({...blobs, main: URL.createObjectURL(new_file)})
                
                props.change_urls(old_data)

                //if(props.default_files.main){

                var new_files = props.default_files

                new_files.main = new_file

                props.change_files({...props.default_files, main: new_files.main})

                if(old_name){
                    if(old_name.substring(0, 7) === "http://" || old_name.substring(0, 8) === "https://"){
                        var files_delete = props.files_to_delete
    
                        files_delete.push(old_name)
        
                        props.change_files_to_delete(files_delete)
                    }
                }
            }
        }

        if(type === "hover"){
            if(files){
                var old_data = props.default_urls

                var old_name = old_data.hover

                var file_name = files[0].name


                var split1 = file_name.split(".")
                var extencion = split1[1]
                var name = fix_file_name(split1[0])

                var new_file_name = name + "_hover." + extencion

                var blob = files[0].slice(0, files[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_data.hover = new_file_name

                set_blobs({...blobs, hover: URL.createObjectURL(new_file)})
                
                props.change_urls(old_data)

                //if(props.default_files.hover){
                var new_files = props.default_files

                new_files.hover = new_file

                props.change_files({...props.default_files, hover: new_files.hover})

                if(old_name){
                    if(old_name.substring(0, 7) === "http://" || old_name.substring(0, 8) === "https://"){
                        var files_delete = props.files_to_delete
    
                        files_delete.push(old_name)
        
                        props.change_files_to_delete(files_delete)
                    }
                }   
            }
        }

        if(type === "other"){

            if(files && (pozition !== undefined)){
                var old_data = props.default_urls

                var old_name = old_data.other[pozition]

                var file_name = files[0].name


                var split1 = file_name.split(".")
                var extencion = split1[1]
                var name = fix_file_name(split1[0])

                var new_file_name = name + "_other_" + pozition + "." + extencion

                var blob = files[0].slice(0, files[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_data.other[pozition] = new_file_name

                props.change_urls(old_data)

                var old_blobs_other = [...blobs.other]

                old_blobs_other[pozition] = URL.createObjectURL(new_file)

                set_blobs({...blobs, other: old_blobs_other})

                if(props.default_files.other){
                    var new_files = props.default_files

                    new_files.other[pozition] = new_file
    
                    props.change_files({...props.default_files, other: new_files.other})
    
                    if(old_name){
                        if(old_name.substring(0, 7) === "http://" || old_name.substring(0, 8) === "https://"){
                            var files_delete = props.files_to_delete

                            files_delete.push(old_name)
            
                            props.change_files_to_delete(files_delete)
                        }
                    }
                }

            }
        }

        if(type === "model_show_case"){

            if(files && (pozition !== undefined)){
                var old_data = props.default_urls

                var old_name = old_data.model_show_case[pozition]

                var file_name = files[0].name

                var old_model_show_case = old_data.model_show_case

                var split1 = file_name.split(".")
                var extencion = split1[1]
                var name = fix_file_name(split1[0])

                var new_file_name = name + "_model_" + pozition + "." + extencion

                var blob = files[0].slice(0, files[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_model_show_case[pozition] = new_file_name

                old_data.model_show_case = old_model_show_case

                props.change_urls(old_data)


                var old_blobs_model_show_case = [...blobs.model_show_case]

                old_blobs_model_show_case[pozition] = URL.createObjectURL(new_file)

                set_blobs({...blobs, model_show_case: old_blobs_model_show_case})

                
                if(props.default_files.model_show_case){
                    var new_files = props.default_files

                    new_files.model_show_case[pozition] = new_file

                    props.change_files({...props.default_files, model_show_case: new_files.model_show_case})
    
                    if(old_name){
                        if(old_name.substring(0, 7) === "http://" || old_name.substring(0, 8) === "https://"){
                            var files_delete = props.files_to_delete
        
                            files_delete.push(old_name)
            
                            props.change_files_to_delete(files_delete)
                        }
                    }
                }

            }
        }

        if(type === "detail_show_case"){

            if(files && (pozition !== undefined)){
                var old_data = props.default_urls

                var old_name = old_data.detail_show_case[pozition]

                var file_name = files[0].name

                var old_detail_show_case = old_data.detail_show_case

                var split1 = file_name.split(".")
                var extencion = split1[1]
                var name = fix_file_name(split1[0])

                var new_file_name = name + "_detail_" + pozition + "." + extencion

                var blob = files[0].slice(0, files[0].size, 'image/png'); 
                var new_file = new File([blob], new_file_name, {type: 'image/png'})

                old_detail_show_case[pozition] = new_file_name

                old_data.detail_show_case = old_detail_show_case

                props.change_urls(old_data)


                var old_blobs_detail_show_case = [...blobs.detail_show_case]

                old_blobs_detail_show_case[pozition] = URL.createObjectURL(new_file)

                set_blobs({...blobs, detail_show_case: old_blobs_detail_show_case})

                if(props.default_files.detail_show_case){
                    var new_files = props.default_files

                    new_files.detail_show_case[pozition] = new_file
    
                    props.change_files({...props.default_files, detail_show_case: new_files.detail_show_case})
    
                    if(old_name){
                        if(old_name.substring(0, 7) === "http://" || old_name.substring(0, 8) === "https://"){
                            var files_delete = props.files_to_delete
        
                            files_delete.push(old_name)
            
                            props.change_files_to_delete(files_delete)
                        }
                    }
                }
               
            }
        }
    })

    var handle_add_image = ((event: any) => {

        event.preventDefault()

        var other_copy = [...blobs.other]

        other_copy.push("place_holder")

        set_blobs({...blobs, other: other_copy})
    })

    var handle_gate_close = ((type: string, event: any) => {
        var data =  props.default_urls

        event.target.checked = !gates.other

        if(type === "other"){

            var files_delete = props.files_to_delete

            for(var old_image of props.default_urls.other){
                if(old_image.substring(0, 7) === "http://" || old_image.substring(0, 8) === "https://"){

                    files_delete.push(old_image)
    
                }
            }

            props.change_files_to_delete(files_delete)

            set_gates({...gates, other: !gates.other})

            set_blobs({...blobs, other: []})

            data.other = []

            props.change_urls(data)

            props.change_files({...props.default_files, other: []})

        }

        if(type === "model_show_case"){

            var files_delete = props.files_to_delete

            for(var old_image of props.default_urls.model_show_case){
                if(old_image.substring(0, 7) === "http://" || old_image.substring(0, 8) === "https://"){

                    files_delete.push(old_image)
    
                }
            }

            props.change_files_to_delete(files_delete)


            set_gates({...gates, model_show_case: !gates.model_show_case})

            set_blobs({...blobs, model_show_case: []})
            
            data.model_show_case = []

            props.change_urls(data)

            props.change_files({...props.default_files, model_show_case: []})

           
        }

        if(type === "detail_show_case"){
            var files_delete = props.files_to_delete

            for(var old_image of props.default_urls.detail_show_case){
                if(old_image.substring(0, 7) === "http://" || old_image.substring(0, 8) === "https://"){

                    files_delete.push(old_image)
    
                }
            }

            props.change_files_to_delete(files_delete)


            set_gates({...gates, detail_show_case: !gates.detail_show_case})

            set_blobs({...blobs, detail_show_case: []})

            data.detail_show_case = []

            props.change_urls(data)

            props.change_files({...props.default_files, detail_show_case: []})
        }

    })

    var handle_other_delete = ((event: any, pozition: number) => {
        event.preventDefault()

        var data = props.default_urls
        var data2 = props.default_files


        if(blobs.other.length === 1){
            handle_gate_close("other", event)
        }else{
            var copy_blobs = [...blobs.other]

            copy_blobs.splice(pozition, 1)

            set_blobs({...blobs, other: copy_blobs})

            if(data.other[pozition]){
                data.other.splice(pozition, 1)
                data2.other.splice(pozition, 1)
            }

            // data.other = copy_blobs

            props.change_urls(data)
            props.change_files(data2)
        }

    })

    return(
        <>
            <div key={"main"}>
                <img src={blobs.main} width={"100px"} height={"100px"} alt="img"></img>
                <input accept="image/png, image/gif, image/jpeg" type="file" id="main" onChange={(event) => handle_input_change(event.target.files, "main")}></input>
                <label htmlFor="main">(Main image)</label>
                <br></br>
            </div> 

            {props.settings.hover ? <>
                <div key={"hover"}>
                    <img src={blobs.hover} width={"100px"} height={"100px"} alt="img"></img>
                    <input accept="image/png, image/gif, image/jpeg" type="file" id="hover" onChange={(event) => handle_input_change(event.target.files, "hover")}></input>
                    <label htmlFor="hover">(Hover image)</label>
                    <br></br>
                </div> 
            </> : <></>}
            

            <br />

            {props.settings.model_show_case ? <>

                <input id="model_show_case" type="checkbox" checked={gates.model_show_case} onChange={(e) => handle_gate_close("model_show_case", e)}></input>
                <label htmlFor="model_show_case">Model showcase</label>

                {gates.model_show_case ? (blobs.model_show_case.length === 4 && blobs.model_show_case[0] !== undefined && blobs.model_show_case[1] !== undefined && blobs.model_show_case[2] !== undefined && blobs.model_show_case[3] !== undefined) ? <>
                    {blobs.model_show_case.map((image_url: string, number: number) => (
                    
                        <div key={number.toString()}>
                            <img src={image_url} width={"100px"} height={"100px"} alt="img"></img>
                            <input accept="image/png, image/gif, image/jpeg" type="file" onChange={(event) => handle_input_change(event.target.files, "model_show_case", number)}></input>
                            <label htmlFor="model_show_case">(Model showcase)</label>
                            <br></br>
                        </div>

                    
                ))}
                </> : <>
                
                {[1,2,3,4].map((number: number, index: number) => (
                    <div key={index.toString()}>
                        {blobs.model_show_case[index] ? <img src={blobs.model_show_case[index]} width={"100px"} height={"100px"} alt="img"></img> : <img src={""} width={"100px"} height={"100px"} alt="img"></img>}
                        <input accept="image/png, image/gif, image/jpeg" type="file" onChange={(event) => handle_input_change(event.target.files, "model_show_case", index)}></input>
                        <label htmlFor="model_show_case">(Model showcase)</label>
                        <br></br>
                </div>
                ))}
                
                </> : <></>}

            </> : <></>}

            <br />

            {props.settings.detail_show_case ? <>

                <input id="detail_show_case" type="checkbox" checked={gates.detail_show_case} onChange={(e) => handle_gate_close("detail_show_case", e)}></input>
                <label htmlFor="detail_show_case">Detail showcase</label>

                {gates.detail_show_case ? (blobs.detail_show_case.length === 4 && blobs.detail_show_case[0] !== undefined && blobs.detail_show_case[1] !== undefined && blobs.detail_show_case[2] !== undefined && blobs.detail_show_case[3] !== undefined) ? <>
                    {blobs.detail_show_case.map((image_url: string, number: number) => (
                    
                    <div key={number.toString()}>
                            <img src={image_url} width={"100px"} height={"100px"} alt="img"></img>
                            <input accept="image/png, image/gif, image/jpeg" type="file" onChange={(event) => handle_input_change(event.target.files, "detail_show_case", number)}></input>
                            <label htmlFor="detail_show_case">(Detail showcase)</label>
                            <br></br>
                        </div>
                    
                ))}
                </> : <>
                
                {[1,2,3,4].map((number: number, index: number) => (
                    <div key={index.toString()}>
                        {blobs.detail_show_case[index] ? <img src={blobs.detail_show_case[index]} width={"100px"} height={"100px"} alt="img"></img> : <img src={""} width={"100px"} height={"100px"} alt="img"></img>}
                        <input accept="image/png, image/gif, image/jpeg" type="file" onChange={(event) => handle_input_change(event.target.files, "detail_show_case", index)}></input>
                        <label htmlFor="detail_show_case">(Detail showcase)</label>
                        <br></br>
                </div>
                ))}

                </> : <></>}

            </> : <></>}

            <br />

            {props.settings.other ? <>
                
            
                <input id="other_checkbox" type="checkbox" checked={gates.other} onChange={(e) => handle_gate_close("other", e)}></input>
                <label htmlFor="other_checkbox">Other images</label>
    
                {gates.other ? blobs.other.length > 0 ? <>
                    {blobs.other.map((image_url: string, number: number) => (
                    
                    <div key={number.toString()}>
                            <img src={image_url} width={"100px"} height={"100px"} alt="img"></img>
                            <input accept="image/png, image/gif, image/jpeg" type="file" onChange={(event) => handle_input_change(event.target.files, "other", number)}></input>
                            <label htmlFor="other">(Other)</label>
                            <button onClick={(event) => handle_other_delete(event, number)}>Delete</button>
                            <br></br>
                        </div>
                    
    
                ))}
    
                <button onClick={(event) => handle_add_image(event)}>Add image</button>
    
                </> : <>
                        <div>
                            <img src={""} width={"100px"} height={"100px"} alt="img"></img>
                            <input accept="image/png, image/gif, image/jpeg" type="file" onChange={(event) => handle_input_change(event.target.files, "other", 0)}></input>
                            <label htmlFor="other">(Other)</label>
                            <br></br>
                        </div>
                </> : <></>}
                        
                </> : <></>} 
        </>
    )
}