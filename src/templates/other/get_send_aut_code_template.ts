const send_aut_code_template = (email: string) => {
    return {users: {email$: email}}
}

export default send_aut_code_template