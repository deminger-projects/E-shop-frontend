export default async function get_products(){
    try{
        const responce = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_products', {
            method: 'POST'  
        })

        return await responce.json()
    }catch(err){
        console.log(err)
    }
}