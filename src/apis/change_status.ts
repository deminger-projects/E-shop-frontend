import Tables from "../interfaces/Tables"

export default async function change_status(tables: Tables, record_id: number, user_id?: number){

    const form_data = new FormData()

    form_data.append("tables", JSON.stringify(tables))
    form_data.append("record_id", JSON.stringify(record_id))

    if(user_id){
        form_data.append("user_id", JSON.stringify(user_id))
    }
    
    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/change_status', {
            method: 'POST',
            body: form_data
        })

        return [await responce.json(), undefined]

    } catch(err){
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
        
        return [undefined, err]
    }
}