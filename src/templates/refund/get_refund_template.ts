const refund_template = (order_id: number, refund_id: number|null, product_id: number[], reason_id: string[], amount: string[], size: string[], status: string) => {
    return {
        refunds: {order_id$: order_id, status: status},
        refund_products : {refund_id: refund_id, product_id: product_id, reason_id: reason_id, amount: amount, size: size}
    }
}

export default refund_template