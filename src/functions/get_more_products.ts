export default async function get_more_products(set_loading: Function, getter: Function, set_roll: Function, set_data1: Function, set_data2: Function, data: any, product_id: number, last_item_id: number, set_last_item: Function){
    
        set_loading(true)

        var data1 = await getter(product_id, last_item_id)

        if(data1.length > 0){
            var products_arr_copy = [...data]
            var new_data = products_arr_copy.concat(data1)
    
            set_data1(new_data)
            set_data2(new_data)
    
            set_last_item(data1[data1.length - 1].collections[0].id)
            
            if(data1.length < 9){
                set_roll(false)
            }
            set_roll(true)
        }else{
            set_roll(false)
        }

        set_loading(false)
    
}