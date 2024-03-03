const refund_request_template = (order_code: number, email: string) => {
    return {
        orders: {id$: order_code, email$: email}
    }
}

export default refund_request_template