export default async function get_user_acccount_data(email: string, password: string){
    try {
    
        const form = new FormData();

        form.append("email", JSON.stringify(email))
        form.append("password", JSON.stringify(password))

      const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_user_acccount_data', {
        method: 'POST',
        body: form  
    }); 

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();

      return data

    } catch (error) {

      console.log(error);
    }
}