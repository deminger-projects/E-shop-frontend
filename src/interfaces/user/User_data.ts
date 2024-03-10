export default interface UserData {
    users:     User[];
    user_data: User_data[];
}

export interface User_data {
    pes: string;
    id:       number;
    user_id:  number;
    name:     string;
    surname:  string;
    phone:    string;
    adress:   string;
    city:     string;
    postcode: string;
    status:   string;
    email:    string;
}

export interface User {
    id:       number;
    username: string;
    email:    string;
    password: string;
}
