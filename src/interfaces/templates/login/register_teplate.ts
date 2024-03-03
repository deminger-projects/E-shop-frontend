export default interface register_template_interface {
    users: {username: string, email$: string, password: string},
    user_data: {user_id: null, name: string, surname: string, phone: string, adress: string, city: string, postcode: string}
}
