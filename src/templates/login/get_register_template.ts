const register_template = (username: string, email: string, password: string, name: string, surname: string, phone: string, adress: string, city: string, postcode: string) => {
    return {
        users: {username: username, email$: email, password: password},
        user_data: {user_id: null, name: name, surname: surname, phone: phone, adress: adress, city: city, postcode: postcode}
    }
}

export default register_template