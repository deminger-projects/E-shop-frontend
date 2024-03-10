interface refund {
    id: number
    reason: string | undefined
    amount: string | undefined
    size: string
    status: boolean
    product_id?: number
}

export default function filter_refund_data(refund_data: Array<refund>){

    var ids: Array<number> = []
    var sizes: Array<string> = []
    var reasons: Array<string> = []
    var amounts: Array<string> = []


    for(var refund of refund_data){
        if(refund.reason && refund.size && refund.amount && refund.status === true){
            ids.push(refund.id)
            sizes.push(refund.size)
            reasons.push(refund.reason)
            amounts.push(refund.amount)
        }
    }

    return {ids: ids, sizes: sizes, reasons: reasons, amounts: amounts}
}