const login_template = (email: string, password: string) => {
    return {users: {email$: email, password$: password, login_status: "Active"}}
}

export default login_template