export default async function get_admin_collections(){
    try {
        const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_admin_collections', {
            method: 'POST'  
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