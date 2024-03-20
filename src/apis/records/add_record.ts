import { json } from "stream/consumers";
import Tables from "../../interfaces/Tables"

export default async function add_record(tables: any, user_id?: number, folder?: string, files?: Array<File>, is_order?: boolean, user_status?: string, cart?: any){

    const form = new FormData();

    if(user_status === "Active"){
        if(user_id){
            form.append("user_id", JSON.stringify(user_id))
        }
    }

    if(is_order){
        form.append("order", JSON.stringify(is_order))
    }

    if(folder){
        form.append("folder", JSON.stringify(folder))
    }

    if(files){
        for(var file of files){
            if(files.length > 1){
                form.append("multiple_files", file)
            }else{
                form.append("single_file", file)
            }
        }
    }

    if(cart){
        form.append("cart", JSON.stringify(cart))
    }

    form.append("tables", JSON.stringify(tables))

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/add_record', {
            method: 'POST',
            body: form  
        })

        return [await responce.json(), undefined]
        
    } catch (err){
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
        
        return [undefined, err]
    }
}