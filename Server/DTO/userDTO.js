export class User{
    id;
    name;
    email;
    password;
    role;

    constructor(data){
        this.id = data.id
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
    }
}