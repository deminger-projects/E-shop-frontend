const get_user_data_template = (user_id: number, name: string, surname: string, phone: string, adress: string, city: string, postcode: string) => {
    return {user_data: {user_id$: user_id, name$: name, surname$: surname, phone$: phone, adress$: adress, city$: city, postcode$: postcode}}
}

export default get_user_data_template