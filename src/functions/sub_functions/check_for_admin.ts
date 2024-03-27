export default async function check_for_admin(email: string, password: string){

    try{
        const form_data = new FormData()

        form_data.append("email", JSON.stringify(email))
        form_data.append("password", JSON.stringify(password))

        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/check_for_admin', {
            method: 'POST',
            body: form_data
        })

        return await responce.json()

    }catch(err){
        console.log(err)
    }
}