interface Sizes{
    size: string
    current_amount: number
    is_checked: boolean
}

export default function filter_sizes(sizes: Array<Sizes>){

    var selected_sizes: Array<string> = []
    var amounts: Array<string> = []

    for (let index = 0; index < sizes.length; index++) {
        if(sizes[index].is_checked === true){
            selected_sizes.push(sizes[index].size)
            amounts.push((sizes[index].current_amount).toString())
        }
    }

    return {sizes: selected_sizes, amounts: amounts}

}