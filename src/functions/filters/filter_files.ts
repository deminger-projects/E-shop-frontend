import Files from "../../interfaces/Files"
import Url from "../../interfaces/Url"

export default function check_files(files_data: Files, base_files_names?: Url){
    
    var file_names: Array<string> = []
    var file_names_to_keep: Array<string> = []
    var files: Array<File> = []
    var show_case_status: {model_show_case: boolean|undefined, detail_show_case: boolean|undefined} = {model_show_case: undefined, detail_show_case: undefined}



    if(files_data.main){
        file_names.push(files_data.main.name)
        files.push(files_data.main)
    }else{
        if(base_files_names){
            if(base_files_names.main){
                file_names_to_keep.push(base_files_names.main)
            }
        }
    }




    if(files_data.hover){
        file_names.push(files_data.hover.name)
        files.push(files_data.hover)
    }else{
        if(base_files_names){
            if(base_files_names.hover){
                file_names_to_keep.push(base_files_names.hover)
            }
        }
    }


    


   
    for(let file of files_data.other){
        if(file){
            file_names.push(file.name)
            files.push(file)
        }
    }

    if(base_files_names){
        if(base_files_names.other){
            if(base_files_names.other.length != 0){
                for(let name of base_files_names.other){
                    file_names_to_keep.push(name)
                }
            }
        }
    }





    
    

    if(base_files_names){
        if(base_files_names.model_show_case && files_data.model_show_case){
            if(base_files_names.model_show_case.length > 0){
                for (let index = 0; index < files_data.model_show_case.data.length; index++) {
                    if(!files_data.model_show_case.data[index].file){
                        file_names_to_keep.push(base_files_names.model_show_case[index])
                    }else{
                        file_names.push(files_data.model_show_case.data[index].file.name)
                        files.push(files_data.model_show_case.data[index].file)
                    }
                }
            }
        }
    }
    
    if(files_data.model_show_case){
        if(files_data.model_show_case.status){
            for(let file_data of files_data.model_show_case.data){
                if(file_data.file){
                    show_case_status.model_show_case = true
                }else{
                    show_case_status.model_show_case = false
                    break
                }
            }

            if(show_case_status.model_show_case === true){
                for(let file_data of files_data.model_show_case.data){
                    file_names.push(file_data.file.name)
                    files.push(file_data.file) 
                }
            }
        }
    }









    if(base_files_names){
        if(base_files_names.detail_show_case && files_data.detail_show_case){
            if(base_files_names.detail_show_case.length > 0){
                for (let index = 0; index < files_data.detail_show_case.data.length; index++) {
                    if(!files_data.detail_show_case.data[index].file){
                        file_names_to_keep.push(base_files_names.detail_show_case[index])
                    }else{
                        file_names.push(files_data.detail_show_case.data[index].file.name)
                        files.push(files_data.detail_show_case.data[index].file)
                    }
                }
            }
        }
    }
    
    if(files_data.detail_show_case){
        if(files_data.detail_show_case.status){
            for(let file_data of files_data.detail_show_case.data){
                if(file_data.file){
                    show_case_status.detail_show_case = true
                }else{
                    show_case_status.detail_show_case = false
                    break
                }
            }

            if(show_case_status.detail_show_case === true){
                for(let file_data of files_data.detail_show_case.data){
                    file_names.push(file_data.file.name)
                    files.push(file_data.file) 
                }
            }
        }
    }

    return {files_names_tables: file_names, files: files, file_names_to_keep: file_names_to_keep, show_case_status: show_case_status}

}