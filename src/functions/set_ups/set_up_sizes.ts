interface sizes{
    size: string
    current_amount: number
}

export default function set_up_sizes(selected_sizes?: Array<sizes>){

    var default_sizes = [{size: "XXXS", current_amount: 0, is_checked: false}, {size: "XXS", current_amount: 0, is_checked: false}, {size: "XS", current_amount: 0, is_checked: false}, {size: "S", current_amount: 0, is_checked: false}, {size: "M", current_amount: 0, is_checked: false}, {size: "L", current_amount: 0, is_checked: false}, {size: "XL", current_amount: 0, is_checked: false}, {size: "XXL", current_amount: 0, is_checked: false},{size: "XXXL", current_amount: 0, is_checked: false}]

    if(selected_sizes){
        for (let index = 0; index < selected_sizes.length; index++) {
           for (let index2 = 0; index2 < default_sizes.length; index2++) {
            if(default_sizes[index2].size === selected_sizes[index].size){
                default_sizes[index2].size = selected_sizes[index].size
                default_sizes[index2].current_amount = selected_sizes[index].current_amount
                default_sizes[index2].is_checked = true
            }
            
           }
            
        }
    }

    return default_sizes    
    
}