const get_psw_template = (password: string) => {
    return {users: {password: password}}
}

export default get_psw_template