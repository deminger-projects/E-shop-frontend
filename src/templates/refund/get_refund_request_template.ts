const refund_request_template = (order_code: string, email: string) => {
    return {
        orders: {order_code$: order_code, email$: email}
    }
}

export default refund_request_template