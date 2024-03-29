export default async function get_product_by_id(id: number){
    try {
    
        const form = new FormData();
    
        form.append("id", JSON.stringify(id))

      const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_product_by_id', {
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