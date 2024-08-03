import Files from "../interfaces/Files";

export default function get_filtred_data(urls: {main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}, files: Files | undefined, base_layout: {main: string|undefined, hover:string|undefined, other: Array<string>, model_show_case: Array<string>, detail_show_case: Array<string>}){
    
    var new_files: Array<File> = []
    var file_names_to_keep: Array<string> = []
    var files_for_tables: Array<string> = []

    var model_show_case_status = true
    var detail_show_case_status = true

    if(files){
        if(files.main){
            new_files.push(files.main)
            files_for_tables.push(files.main.name)
        }

        if(files.hover){
            new_files.push(files.hover)
            files_for_tables.push(files.hover.name)
        }

        if(files.other){
            for(var file of files.other){
                if(file){
                    new_files.push(file)
                    files_for_tables.push(file.name)
                }
            }
        }

        
        if(files.model_show_case){
            var is_error = false

            for(let file of files.model_show_case.data){
                if(file.url === undefined){
                    is_error = true
                    break
                }
            }

            if(is_error === false){
                for(let file of files.model_show_case.data){
                    if(file){
                        if(file.file){
                            new_files.push(file.file)
                            files_for_tables.push(file.file.name)
                        }
                    }
                }
                model_show_case_status = true

            }else if(is_error === true){
                model_show_case_status = false
            }else if(urls.model_show_case.length > 0){
                model_show_case_status = true
            }else if(files.model_show_case.status === false || files.model_show_case.data.length === 0){
                model_show_case_status = true
            }
        }
    

        if(files.detail_show_case){
            var is_error = false

            for(let file of files.detail_show_case.data){
                if(file.url === undefined){
                    is_error = true
                    break
                }
            }


            if(is_error === false){
                for(let file of files.detail_show_case.data){
                    if(file){
                        if(file.file){
                            new_files.push(file.file)
                            files_for_tables.push(file.file.name)
                        }
                    }
                }
                detail_show_case_status = true

            }else if(is_error === true){
                detail_show_case_status = false
            }else if(urls.detail_show_case.length > 0){
                detail_show_case_status = true
            }else if(files.detail_show_case.status === false || files.detail_show_case.data.length === 0){
                detail_show_case_status = true
            }
        }
    }







    if(urls.main === base_layout.main && base_layout.main){
        var temp = base_layout.main.split("/")
        file_names_to_keep.push(temp[temp.length - 1])
    }



    if(urls.hover === base_layout.hover && base_layout.hover){
        var temp = base_layout.hover.split("/")
        file_names_to_keep.push(temp[temp.length - 1])
    }



    for (let base_index = 0; base_index < base_layout.other.length; base_index++) {
        for (let new_index = 0; new_index < urls.other.length; new_index++) {
            if(urls.other[new_index] === base_layout.other[base_index]){
                var temp = base_layout.other[base_index].split("/")
                file_names_to_keep.push(temp[temp.length - 1])
                break
            }
        }
    }





    if(files && files.detail_show_case){
        if(files.detail_show_case.data.length > 0){
            for (let index = 0; index < files.detail_show_case.data.length; index++) {
                if(files.detail_show_case.data[index].file !== undefined){
                    urls.detail_show_case[index] = files.detail_show_case.data[index].file.name
                }
            }
        }
    }

    if(files && files.model_show_case){
        if(files.model_show_case.data.length > 0){
            for (let index = 0; index < files.model_show_case.data.length; index++) {
                if(files.model_show_case.data[index].file !== undefined){
                    urls.detail_show_case[index] = files.model_show_case.data[index].file.name
                }
            }
        }
    }






    if(files === undefined || files.model_show_case?.status === true){
    
        for(var base_file of base_layout.model_show_case){
            for(var new_file of urls.model_show_case){
                
                if(base_file === new_file){
                    
                    var temp = base_file.split("/")
                    file_names_to_keep.push(temp[temp.length - 1])                              
                    break;
                }
            }
        }
    }

    



    if(files === undefined || files.detail_show_case?.status === true){

        for(var base_file of base_layout.detail_show_case){
            for(var new_file of urls.detail_show_case){
                
                if(base_file === new_file){
                    var temp = base_file.split("/")
                    file_names_to_keep.push(temp[temp.length - 1])                              
                    break;
                }
            }
        }
    }


    return {files_to_save: new_files, file_names_to_keep: file_names_to_keep, file_names_for_table: files_for_tables, model_show_case_status: model_show_case_status, detail_show_case_status: detail_show_case_status}
}