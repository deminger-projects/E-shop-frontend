export default async function get_collection_product_showcase(collection_id: number, last_item_id: number){
    try {
        const form = new FormData();

        form.append("id", JSON.stringify(collection_id))
        form.append("last_item_id", JSON.stringify(last_item_id))

      const response = await fetch(process.env.REACT_APP_SECRET_SERVER_URL + '/get_collection_product_showcase', {
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