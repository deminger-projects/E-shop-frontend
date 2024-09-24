export default function filter_images(files: any, urls: any){

    var files_names_for_tables = [] // urls
    var files_for_save = [] // files

    var model = []
    var detail = []

    if(files.main){
        files_for_save.push(files.main)
    }

    if(files.hover){
        files_for_save.push(files.hover)
    }

    if(files.other){
        for(let image of files.other){
            if(image !== undefined){
                files_for_save.push(image)
            }
        }
    }
    

    if(files.model_show_case[0]){
        if(files.model_show_case.status === true){
            // for(let image of files.model_show_case[0]){
            //     if(image !== undefined){
            //         files_for_save.push(image)
            //     }
            // }
            files_for_save.push(files.model_show_case[0])

        }else{
            for(let image of files.model_show_case){
                if(image !== undefined){
                    files_for_save.push(image)
                }
            }
        }
    }




    if(files.detail_show_case[0]){
        if(files.detail_show_case.status === true){
            // for(let image of files.detail_show_case[0]){
            //     if(image !== undefined){
            //         files_for_save.push(image)
            //     }
            // }
            files_for_save.push(files.detail_show_case[0])
        }else{
            for(let image of files.detail_show_case){
                if(image !== undefined){
                    files_for_save.push(image)
                }
            }
        }
    }




    if(urls.main){
        if(urls.main.includes("/")){
            var split = urls.main.split("/")
            var new_name = split[split.length - 1]
            files_names_for_tables.push(new_name)
        }else{
            files_names_for_tables.push(urls.main)
        }
    }

    if(urls.hover){
        if(urls.hover.includes("/")){
            var split = urls.hover.split("/")
            var new_name = split[split.length - 1]
            files_names_for_tables.push(new_name)
        }else{
            files_names_for_tables.push(urls.hover)
        }
    }

    if(urls.other){
        for(let item of urls.other){
            if(item !== undefined){
                if(item.includes("/")){
                    var split = item.split("/")
                    var new_name = split[split.length - 1]
                    files_names_for_tables.push(new_name)
                }else{
                    files_names_for_tables.push(item)
                }
            }
        }
    }

    if(urls.model_show_case){
        for(let item of urls.model_show_case){
            if(item !== undefined){
                if(item.includes("/")){
                    var split = item.split("/")
                    var new_name = split[split.length - 1]
                    files_names_for_tables.push(new_name)
                    model.push(item)
                }else{
                    files_names_for_tables.push(item)
                    model.push(item)
                }
            }   
        }
    }

    if(urls.detail_show_case){    
        for(let item of urls.detail_show_case){
            if(item !== undefined){
                if(item.includes("/")){
                    var split = item.split("/")
                    var new_name = split[split.length - 1]
                    files_names_for_tables.push(new_name)
                    detail.push(item)
                }else{
                    files_names_for_tables.push(item)
                    detail.push(item)
                }
            }
        }
    }


    return({files_for_save: files_for_save, files_names_for_tables: files_names_for_tables, model_files: model, detail_files: detail})

}
    