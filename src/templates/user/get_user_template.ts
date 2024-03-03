const get_user_data_template = (username: string, email: string) => {
    return {users: {username: username, email$: email}}
}

export default get_user_data_template