import Tables from "../../interfaces/Tables"

export default async function edit_record(tables: any, record_id: number, user_id?: number, files?: Array<File>, files_names_to_keep?: Array<string>, folder?: string, psw_change?: boolean){

    const form_data = new FormData();   

    form_data.append("tables", JSON.stringify(tables))
    form_data.append("record_id", JSON.stringify(record_id))

    if(psw_change){
        form_data.append("psw_change", JSON.stringify(psw_change))
    }

    if(files_names_to_keep){
        form_data.append("files_names_to_keep", JSON.stringify(files_names_to_keep))
    }

    if(folder){
        form_data.append("folder", JSON.stringify(folder))
    }

    if(user_id){
        form_data.append("user_id", JSON.stringify(user_id))
    }

    if(files){
        for(var file of files){
            if(files.length > 1){
                form_data.append("multiple_files", file)
            }else{
                form_data.append("single_file", file)
            }
        }
    }

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/edit_record', {
            method: 'POST',
            body: form_data
        })

        return [await responce.json(), undefined]

    } catch(err) {
        console.log("🚀 ~ file: edit_record.ts:40 ~ edit_record ~ err:", err)
            
        return [undefined, err]
    }
}