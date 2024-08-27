
export default async function check_password(userInputPassword: string, storedHashedPassword: string, ){

    const form_data = new FormData()

    form_data.append("userInputPassword", JSON.stringify(userInputPassword))
    form_data.append("storedHashedPassword", JSON.stringify(storedHashedPassword))

    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/check_password', {
            method: 'POST',
            body: form_data
        })
        return [await responce.json(), undefined]

    } catch(err) {
        console.log("🚀 ~ file: add_record.ts:40 ~ add_record ~ err:", err)
            
        return [undefined, err]
    }                    
}